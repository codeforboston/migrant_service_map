import { SET_SEARCH_COORDINATES, SELECT_TAB } from "./actions";

const INITIAL_STATE = {
  mapCenter: [-71.066954, 42.359947], 
  coordinates: [-71.066954, 42.359947],
  selectedTabIndex: 0,
  currentLocation: "default", //references item in history object once user submits search string
  history: {
    "default": {
      coordinates: [-71.066954, 42.359947],
      searchText: "center of Boston"
    }
  }
};

export default function search(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SELECT_TAB:
      return { ...state, selectedTabIndex: action.index };
    case SET_SEARCH_COORDINATES:
      return {
        ...state,
        coordinates: action.coordinates,
        currentLocation: action.mapboxId,
        history: { 
          ...state.history,
          [action.mapboxId]: {
            coordinates: action.coordinates,
            searchText: action.text
          }
        }
      };
    default:
      return state;
  }
}