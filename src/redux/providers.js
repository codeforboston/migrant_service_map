import {
  INITIALIZE_PROVIDERS,
  SAVE_PROVIDER,
  REORDER_SAVED_PROVIDERS
} from "./actions";

const INITIAL_STATE = {
  allIds: [],
  byId: {},
  savedProviders: []
};

export default function providers(state = INITIAL_STATE, action) {
  switch (action.type) {
    case INITIALIZE_PROVIDERS:
      return initialProviders(state, action.payload);
    case SAVE_PROVIDER:
      return saveProvider(state, action.id);
    case REORDER_SAVED_PROVIDERS:
      return {
        ...state,
        savedProviders: action.ids
      };
    default:
      return state;
  }
}

function initialProviders(state, payload) {
  return {
    ...state,
    allIds: payload.providers.allIds,
    byId: payload.providers.byId
  };
}

function saveProvider(state, id) {
  return state.savedProviders.includes(id)
    ? {
        //deletes if true
        ...state,
        savedProviders: state.savedProviders.filter(p => p !== id)
      } //adds if false
    : { ...state, savedProviders: [id, ...state.savedProviders] };
}
