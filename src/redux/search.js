import { SET_SEARCH_COORDINATES, SELECT_TAB } from "./actions";

const INITIAL_STATE = {
  mapCenter: [-71.066954, 42.359947],
  coordinates: [-71.066954, 42.359947],
  selectedTabIndex: 0
};

export default function search(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_SEARCH_COORDINATES:
      return { ...state, coordinates: action.coordinates };
    case SELECT_TAB:
      return { ...state, selectedTabIndex: action.index };
    default:
      return state;
  }
}