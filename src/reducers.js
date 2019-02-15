import dotProp from 'dot-prop-immutable';

import { INITIALIZE_PROVIDERS, TOGGLE_TYPE, CLEAR_DISTANCE, CHANGE_DISTANCE } from './actions';

export function providerTypes(state = [], action) {
  switch (action.type) {
    case INITIALIZE_PROVIDERS:
      return groupProvidersByType(action.providers);
    case TOGGLE_TYPE:
      const typeIndex = state.findIndex(type => type.id === action.providerType);
      return dotProp.toggle(state, `${typeIndex}.visible`);
    default:
      return state;
  }
}

function groupProvidersByType(providers) {
  return providers.reduce((types, provider) => {
    const type = types.find(type => type.name === provider.type);
    if (type) {
      type.providers.push(provider);
    } else {
      let id = provider["Type of Service"].toLowerCase().split(' ').join('-');
      if (id === 'community-center') { // special case
        id = 'community-centers';
      }
      types.push({ id, name: provider.type, visible: false, providers: [provider] });
    }
    return types;
  }, []);
}

export function filterProviders(state = [], action) {
  switch( action.type ) {
    case CLEAR_DISTANCE: // both init and 'clear' button
      return { ...state, distance: null }
    case CHANGE_DISTANCE:
      return { ...state, distance: action.distance }
    default:
      return state;
  }
}
