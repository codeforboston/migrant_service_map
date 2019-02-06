export const INITIALIZE_PROVIDERS = 'INITIALIZE_PROVIDERS';
export const TOGGLE_TYPE = 'TOGGLE_TYPE';

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
