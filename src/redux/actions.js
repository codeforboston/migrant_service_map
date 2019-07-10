export const INITIALIZE_PROVIDERS = "INITIALIZE_PROVIDERS";
export const TOGGLE_TYPE = "TOGGLE_TYPE";
export const CHANGE_DISTANCE = "CHANGE_DISTANCE";
export const CLEAR_DISTANCE = "CLEAR_DISTANCE";
export const CHANGE_VISA = "CHANGE_VISA";
export const CLEAR_VISA = "CLEAR_VISA";
export const HIGHLIGHT_PROVIDER = "HIGHLIGHT_PROVIDER";
export const SET_SEARCH_COORDINATES = "SET_SEARCH_COORDINATES";
export const FILTER_PROVIDERS = "FILTER_PROVIDERS";
export const FILTER_NAME = "FILTER_NAME";
export const SAVE_PROVIDER = "SAVE_PROVIDER";
export const SELECT_TAB = "SELECT_TAB";
export const REORDER_SAVED_PROVIDERS = "REORDER_SAVED_PROVIDERS";
export const CHANGE_SORT_ORDER = "CHANGE_SORT_ORDER";
export const SET_MAP_OBJECT = "SET_MAP_OBJECT";

export const initializeProviders = providers => {
  // TODO WHEN ASYNC async dispatch => {
  // return await dispatch({
  return {
    type: INITIALIZE_PROVIDERS,
    payload: providers
  };
  //});
};

export function setMapObject(mapObject) {
  return {
    type: SET_MAP_OBJECT,
    mapObject
  };
}

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

export function changeVisaFilter(visa) {
  return {
    type: CHANGE_VISA,
    visa
  };
}

export function clearVisaFilter() {
  return {
    type: CLEAR_VISA
  };
}

export function setSearchCenterCoordinates(coordinates, mapboxId, text) {
  return {
    type: SET_SEARCH_COORDINATES,
    coordinates,
    mapboxId,
    text
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

export function selectTab(index) {
  return {
    type: SELECT_TAB,
    index
  };
}

export function reorderSavedProviders(ids) {
  return {
    type: REORDER_SAVED_PROVIDERS,
    ids
  };
}

export function changeSortOrder(id) {
  return {
    type: CHANGE_SORT_ORDER,
    id
  };
}
