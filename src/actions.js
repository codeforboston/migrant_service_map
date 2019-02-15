export const INITIALIZE_PROVIDERS = 'INITIALIZE_PROVIDERS';
export const TOGGLE_TYPE = 'TOGGLE_TYPE';
export const CHANGE_DISTANCE = 'CHANGE_DISTANCE';
export const CLEAR_DISTANCE = 'CLEAR_DISTANCE';

export function initializeProviders(providers) {
  return {
    type: INITIALIZE_PROVIDERS,
    providers,
  };
}

export function toggleProviderVisibility(providerType) {
  return {
    type: TOGGLE_TYPE,
    providerType
  }
}

export function changeDistanceFilter(distance) {
  return {
    type: CHANGE_DISTANCE,
    distance
  }
}

export function clearDistanceFilter() {
  return {
    type: CLEAR_DISTANCE,
  }
}