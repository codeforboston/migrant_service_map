export const INITIALIZE_PROVIDERS = "INITIALIZE_PROVIDERS";
export const TOGGLE_TYPE = "TOGGLE_TYPE";
export const CHANGE_DISTANCE = "CHANGE_DISTANCE";
export const CLEAR_DISTANCE = "CLEAR_DISTANCE";
export const HIGHLIGHT_PROVIDER = "HIGHLIGHT_PROVIDER";
export const SET_SEARCH_COORDINATES = "SET_SEARCH_COORDINATES";
export const FILTER_PROVIDERS = "FILTER_PROVIDERS";
export const FILTER_NAME = "FILTER_NAME";
export const SAVE_PROVIDER = "SAVE_PROVIDER";
export const UNSAVE_PROVIDER = "UNSAVE_PROVIDER";

export const initializeProviders = providers => {
  // TODO WHEN ASYNC async dispatch => {
  // return await dispatch({
  return {
    type: INITIALIZE_PROVIDERS,
    payload: providers
  };
  //});
};

export function displayProviderInformation(providerId) {
  return {
    type: HIGHLIGHT_PROVIDER,
    providerId
  };
 }

export function toggleProviderVisibility(providerType) {
  return {
    type: TOGGLE_TYPE,
    payload: providerType
  };
}

export function changeDistanceFilter(distance) {
  return {
    type: CHANGE_DISTANCE,
    distance
  };
}

export function clearDistanceFilter() {
  return {
    type: CLEAR_DISTANCE
  };
}

export function setSearchCenterCoordinates(coordinates) {
  return {
    type: SET_SEARCH_COORDINATES,
    coordinates
  };
}

export function setFilteredProviders(providers) {
  return {
    type: FILTER_PROVIDERS,
    providers
  };
}

export function filterByName(name) {
  return {
    type: FILTER_NAME,
    name
  };
}

export function saveProvider(id) {
  return {
    type: SAVE_PROVIDER,
    id
  };
}

export function unsaveProvider(id) {
  return {
    type: UNSAVE_PROVIDER,
    id
  };
}
