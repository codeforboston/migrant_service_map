import dotProp from 'dot-prop-immutable';

import { INITIALIZE_PROVIDERS, TOGGLE_TYPE, CHANGE_DISTANCE } from './actions';

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
      let id = provider.type.toLowerCase().split(' ').join('-');
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
    case CHANGE_DISTANCE:
    default:
      return state;
  }
}
