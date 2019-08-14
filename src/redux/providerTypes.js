import { INITIALIZE_PROVIDERS, TOGGLE_TYPE } from "./actions";

const INITIAL_STATE = {
  allIds: [],
  byId: {},
  visible: []
};

export default function providerTypes(state = INITIAL_STATE, action) {
  switch (action.type) {
    case INITIALIZE_PROVIDERS:
      return initialProviders(state, action.payload);
    case TOGGLE_TYPE:
      return setVisibleTypes(state, action.payload);
    default:
      return state;
  }
}

function initialProviders(state, payload) {
  return {
    ...state,
    allIds: payload.providerTypes.allIds,
    byId: payload.providerTypes.byId
  };
}

function setVisibleTypes(state, type) {
  // If visible contains type removes it
  if (typeof type === 'undefined') {
    return { ...state, visible: [] };
  }
  if (state.visible.includes(type)) {
    const removedVisible = state.visible.filter(typeId => type !== typeId);
    return { ...state, visible: removedVisible };
  }
  return { ...state, visible: [...state.visible, type] };
}
