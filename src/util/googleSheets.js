import Papa from "papaparse";
import { initializeProviders } from "redux/actions";
import store from "../redux/store";
import { ProviderBuilder } from "../redux/providerModels";
import _ from "lodash";

const providersSheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT4MST1klxwmBdfvMhOycfV5C-lxGe0_sidJnmGS8U42irBYhgazisd-OUjrI4V9l_GqnazklGhNjzJ/pub?output=csv";

const column = (prefix, fieldName) => ({
  prefix,
  fieldName
});
const requiredColumns = [
  column("validated by", "validatedBy"),
  column("timestamp", "timestamp"),
  column("organization name", "name"),
  column("website", "website"),
  column("type of service", "typeName"),
  column("mission", "mission"),
  column("telephone", "telephone"),
  column("email", "email"),
  column("address", "address"),
  column("longitude", "longitude"),
  column("latitude", "latitude")
];

/**
 * Converts spreadsheet data (an array of row objects) to an array of objects with
 * fields matching the expected columns in the spreadsheet, as specified in `requiredColumns`.
 *
 * This function is responsible for validating that the spreadsheet has the correct format.
 *
 * @returns An array of objects with fields matching required spreadsheet columns. Fields are not
 *          created for empty or whitespace-only cells.
 * @throws InvalidSpreadsheetFormat if provider fields cannot be matched to spreadsheet columns.
 */
const getRawProviders = (rowObjects, columnNames) => {
  const normalizedColumnNames = columnNames.map(name =>
    name.toLowerCase().trim()
  );

  const fieldsByColumnName = {};
  requiredColumns.forEach(column => {
    const columnIndex = _.findIndex(normalizedColumnNames, columnName =>
      columnName.startsWith(column.prefix)
    );
    if (columnIndex === -1) {
      throw Error(
        `Couldn't find required column "${column.prefix}" among ${columnNames}`
      );
    }
    fieldsByColumnName[columnNames[columnIndex]] = column.fieldName;
  });

  return rowObjects.map(row => {
    const rawProvider = {};
    _.forOwn(fieldsByColumnName, (fieldName, columnName) => {
      const value = row[columnName].trim();
      if (value) {
        rawProvider[fieldName] = value;
      }
    });
    return rawProvider;
  });
};

/**
 * Builds a provider store from raw providers.
 *
 * @param rawProviders spreadsheet data organized into objects with fields matching
 *        `requiredColumns`, as returned by `getRawProviders`.
 * @returns An object with fields:
 *          providerStore: A provider store as returned by `ProviderBuilder.build`
 *          loadErrors: An array of {index, error} objects indicating the providers
 *          that couldn't be loaded.
 */
const buildProviderStore = rawProviders => {
  const providerBuilder = new ProviderBuilder();
  const loadErrors = [];
  rawProviders.forEach((fields, index) => {
    try {
      providerBuilder.addProvider({
        coordinates: [
          parseFloat(fields.longitude),
          parseFloat(fields.latitude)
        ],
        name: fields.name,
        address: fields.address,
        email: fields.email,
        mission: fields.mission,
        telephone: fields.telephone,
        timestamp: fields.timestamp,
        typeName: fields.typeName,
        website: fields.website
      });
    } catch (error) {
      loadErrors.push({ index, error });
    }
  });
  return {
    providerStore: providerBuilder.build(),
    loadErrors
  };
};

const loadSpreadsheet = url => {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      skipEmptyLines: "greedy",
      header: true,
      error: error => reject(error),
      complete: result =>
        resolve({
          rowObjects: result.data,
          parseErrors: result.errors,
          columnNames: result.meta.fields
        })
    });
  });
};

const alertLoadFailure = url => {
  window.alert(
    `An error occurred while loading the provider spreadsheet at ${url}. Please check developer tools for more information.`
  );
};

const getProvidersFromSheet = async url => {
  try {
    var { rowObjects, parseErrors, columnNames } = await loadSpreadsheet(url);
  } catch (e) {
    console.error(`Error while loading spreadsheet from ${url}`, e);
    alertLoadFailure(url);
    return;
  }

  if (Array.isArray(parseErrors) && parseErrors.length > 0) {
    console.error(
      `Errors while parsing CSV from ${url}: ${parseErrors.map(error =>
        JSON.stringify(error, null, " ")
      )}`
    );
    alertLoadFailure(url);
    return;
  }

  try {
    var rawProviders = getRawProviders(rowObjects, columnNames);
  } catch (e) {
    console.error(`Couldn't parse spreadsheet from ${url}, bad format`, e);
    alertLoadFailure(url);
    return;
  }

  const { providerStore, loadErrors } = buildProviderStore(rawProviders);

  if (loadErrors.length) {
    const googleSpreadsheetIndex = rawProviderIndex => rawProviderIndex + 2;
    const badSpreadsheetRows = loadErrors.map(({ index }) =>
      googleSpreadsheetIndex(index)
    );
    const allRowErrors = loadErrors
      .map(
        ({ error, index }) => `Row ${googleSpreadsheetIndex(index)}: ${error}`
      )
      .join("\n");
    console.warn(
      `Couldn't load providers from rows [${badSpreadsheetRows}] of ${url}. Errors:\n${allRowErrors}`
    );
  }

  store.dispatch(initializeProviders(providerStore));
};

export { getProvidersFromSheet, providersSheetUrl };
