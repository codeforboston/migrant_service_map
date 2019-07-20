import Papa from "papaparse";
import { initializeProviders } from "redux/actions";

const headersToProviderProperties = {
  "Validated By": "validated_by",
  "Timestamp": "timestamp",
  "Organization Name": "name",
  "Website": "website",
  "Type of Service": "type_of_service",
  "Mission": "mission",
  "Telephone": "telephone",
  "Email": "email",
  "Address": "address",
  "Longitude": "longitude",
  "Latitude": "latitude"
};

const headerToProviderProperty = header => {
  /**
   * For instance, "Type of Service: " => "type_of_service"
   */
  try {
    const [headerText] = header.match(/^[a-zA-Z ]*/);
    return headersToProviderProperties[headerText.trim()];
  } catch(e) {
    console.error(e);
  }
};

const providersLoadCallback = ({ data: providers, errors }) => {
  if (Array.isArray(errors) && errors.length > 0) {
    throw new Error(errors);
  }

  const headers = providers.shift();
  const providerProperties = headers.map(headerToProviderProperty);
  console.log(providerProperties);
  debugger;
  initializeProviders(providers);
};

const getProvidersFromSheet = async url => {
  Papa.parse(url, {
    download: true,
    complete: providersLoadCallback
  });
};

export { getProvidersFromSheet };
