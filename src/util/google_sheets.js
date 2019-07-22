import Papa from "papaparse";
import { initializeProviders } from "redux/actions";
import _ from "lodash";

const headersToProviderProperties = {
  "Validated By": "validated_by",
  Timestamp: "timestamp",
  "Organization Name": "name",
  Website: "website",
  "Type of Service": "type_of_service",
  Mission: "mission",
  Telephone: "telephone",
  Email: "email",
  Address: "address",
  Longitude: "longitude",
  Latitude: "latitude"
};

const headerToProviderProperty = header => {
  /**
   * For instance, "Type of Service: " => "type_of_service"
   */
  try {
    const [headerText] = header.match(/^[a-zA-Z ]*/);
    return headersToProviderProperties[headerText.trim()];
  } catch (e) {
    console.error(e);
  }
};

const convertProviderProperties = ({provider, id}) => {
  const type_of_service_not_normalized = provider.type_of_service;
  const type_of_service = type_of_service_not_normalized
    .toLowerCase()
    .replace(/ /, "-");
  return {
    ..._.pick(provider, [
      "address",
      "email",
      "mission",
      "name",
      "telephone",
      "timestamp",
      "website"
    ]),
    id,
    coordinates: [
      parseFloat(provider.longitude),
      parseFloat(provider.latitude)
    ],
    typeName: type_of_service_not_normalized,
    typeId: type_of_service,
    "Type of Service": type_of_service_not_normalized
  };
};

const providersLoadCallback = ({ data: providersData, errors }) => {
  if (Array.isArray(errors) && errors.length > 0) {
    throw new Error(errors);
  }

  const headers = providersData.shift();
  const providerProperties = headers.map(headerToProviderProperty);

  const providerTypes = {
    byId: {},
    allIds: []
  };
  const providerTypeIds = new Set();
  const providers = {
    byId: {},
    allIds: []
  };

  _.forEach(providersData, (providerRow, index) => {
    const provider = convertProviderProperties(
      {
        provider: _.zipObject(providerProperties, providerRow),
        id: index
      }
    );
    const { id, typeId } = provider;

    providerTypeIds.add(typeId);
    if (providerTypes.byId[typeId]) {
      providerTypes.byId[typeId].providers.push(id);
    } else {
      providerTypes.byId[typeId] = {
        id: typeId,
        name: provider.typeName,
        providers: [id]
      };
    }

    providers.byId[id] = provider;
  });
  providerTypes.allIds = Array.from(providerTypeIds);

  debugger;
  initializeProviders(providersData);
};

const getProvidersFromSheet = async url => {
  Papa.parse(url, {
    download: true,
    complete: providersLoadCallback
  });
};

export { getProvidersFromSheet };
