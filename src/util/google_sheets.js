import Papa from "papaparse";
import { initializeProviders } from "redux/actions";
import store from "../redux/store";
import { ProviderBuilder } from "../redux/providerModels";
import _ from "lodash";

const normalizedColumnHeadersToProviderFields = {
  "validated by": "validatedBy",
  timestamp: "timestamp",
  "organization name": "name",
  website: "website",
  "type of service": "typeName",
  mission: "mission",
  telephone: "telephone",
  email: "email",
  address: "address",
  longitude: "longitude",
  latitude: "latitude"
};

/**
 * Processes column headers, matching against expected columns.
 *
 * @returns A function that accepts a row array and returns a map from provider fields to cell contents.
 *          Fields are not included for empty cells.
 */
const createRowParser = columnHeaders => {
  const normalizedHeaders = columnHeaders.map(header => {
    return header
      .match(/^[a-zA-Z ]*/)[0]
      .toLowerCase()
      .trim();
  });
  const headerColumnIndices = Object.keys(
    normalizedColumnHeadersToProviderFields
  ).map(expectedHeader => {
    const headerColumnIndex = normalizedHeaders.indexOf(expectedHeader);
    if (headerColumnIndex === -1) {
      throw Error(`No column matching ${expectedHeader}`);
    }
    return headerColumnIndex;
  });
  const fieldNames = Object.values(normalizedColumnHeadersToProviderFields);
  return row => {
    const rawFields = {};
    headerColumnIndices.forEach((columnIndex, i) => {
      if (!_.isNil(row[columnIndex]) && row[columnIndex].trim()) {
        rawFields[fieldNames[i]] = row[columnIndex].trim();
      }
    });
    return rawFields;
  };
};

const providersLoadCallback = (rows, errors, url) => {
  if (Array.isArray(errors) && errors.length > 0) {
    console.error(`Errors while loading spreadsheet: ${errors}`);
  }

  const columnHeaders = rows.shift();
  if (!columnHeaders) {
    console.error(
      `Could not parse spreadsheet from ${url}. Spreadsheet seem to be empty`
    );
    return;
  }

  let getRawFields;
  try {
    getRawFields = createRowParser(columnHeaders);
  } catch (e) {
    console.error(
      `Could not parse spreadsheet from ${url}. Could not find required columns ${Object.keys(
        normalizedColumnHeadersToProviderFields
      )} among actual columns ${columnHeaders}`
    );
    return;
  }

  const providerBuilder = new ProviderBuilder();

  rows.forEach((row, rowIndex)=> {
    const rawFields = getRawFields(row);
    try {
      providerBuilder.addProvider({
        coordinates: [
          parseFloat(rawFields.longitude),
          parseFloat(rawFields.latitude)
        ],
        name: rawFields.name,
        address: rawFields.address,
        email: rawFields.email,
        mission: rawFields.mission,
        telephone: rawFields.telephone,
        timestamp: rawFields.timestamp,
        typeName: rawFields.typeName,
        website: rawFields.website
      });
    } catch (e) {
      console.warn(`Could not load provider from row ${rowIndex + 1} with values [${row}]\n${e}`);
    }
  });

  const providerStore = providerBuilder.build();
  store.dispatch(initializeProviders(providerStore));
};

const getProvidersFromSheet = async url => {
  Papa.parse(url, {
    download: true,
    complete: result => providersLoadCallback(result.data, result.errors, url)
  });
};

export { getProvidersFromSheet };
