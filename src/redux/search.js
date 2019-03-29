import { SET_SEARCH_COORDINATES } from "./actions";

const INITIAL_STATE = {
  mapCenter: [-71.066954, 42.359947], 
  coordinates: [-71.066954, 42.359947],
  currentLocation: "default",
  history: {
    "default": {
      coordinates: [-71.066954, 42.359947],
      searchText: "center of Boston"
    }
  }
};

export default function search(state = INITIAL_STATE, action) {
  switch (action.type) {
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
