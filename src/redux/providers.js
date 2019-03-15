import { INITIALIZE_PROVIDERS, SAVE_PROVIDER, UNSAVE_PROVIDER } from "./actions";
import { stat } from "fs";

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
      console.log('save provider', action.id, 'to state');
      return {
        ...state,
        savedProviders: [action.id, ...state.savedProviders]
      }
    case UNSAVE_PROVIDER:
      console.log('unsave provider', action.id, 'from list');
      return {
        ...state,
        savedProviders: state.savedProviders.filter( p => p !== action.id )
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
