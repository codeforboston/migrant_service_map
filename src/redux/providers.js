import { INITIALIZE_PROVIDERS, SAVE_PROVIDER, UNSAVE_PROVIDER, HIGHLIGHT_PROVIDER } from "./actions";
import dotProp from 'dot-prop-immutable';
import { stat } from "fs";

const INITIAL_STATE = {
  allIds: [],
  byId: {},
  highlightedProviders: [],
  savedProviders: []
};

export default function providers(state = INITIAL_STATE, action) {
  switch (action.type) {
    case INITIALIZE_PROVIDERS:
      return initialProviders(state, action.payload);
    case SAVE_PROVIDER:
      return {
        ...state,
        savedProviders: [action.id, ...state.savedProviders]
      }
    case UNSAVE_PROVIDER:
      return {
        ...state,
        savedProviders: state.savedProviders.filter( p => p !== action.id )
      };
    case HIGHLIGHT_PROVIDER: {
        // const providerIndex = state.findIndex(provider => provider.name === action.provider.name);
        const providerIndex = state.highlightedProviders.indexOf(action.id);
        let updatedList = [];
        if (providerIndex > -1) {
          updatedList = dotProp.delete(state.highlightedProviders, providerIndex)
        } else {
          updatedList = [action.id, ...state.highlightedProviders]
        }
          return {
            ...state,
            highlightedProviders: updatedList
          }
        }
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
