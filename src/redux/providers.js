import { INITIALIZE_PROVIDERS } from "./actions";

const INITIAL_STATE = {
  allIds: [],
  byId: {},
  savedProviders: []
};

export default function providers(state = INITIAL_STATE, action) {
  switch (action.type) {
    case INITIALIZE_PROVIDERS:
      return initialProviders(state, action.payload);
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
