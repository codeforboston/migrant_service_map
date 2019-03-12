export const INITIALIZE_PROVIDERS = "INITIALIZE_PROVIDERS";
export const TOGGLE_TYPE = "TOGGLE_TYPE";
export const CHANGE_DISTANCE = "CHANGE_DISTANCE";
export const CLEAR_DISTANCE = "CLEAR_DISTANCE";
export const SET_SEARCH_COORDINATES = "SET_SEARCH_COORDINATES";
export const FILTER_PROVIDERS = "FILTER_PROVIDERS";

export function initializeProviders(providers) {
  return {
    type: INITIALIZE_PROVIDERS,
    payload: providers
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
