import { SET_SEARCH_COORDINATES } from "./actions";

const INITIAL_STATE = {
  mapCenter: [-71.066954, 42.359947],
  coordinates: [-71.066954, 42.359947]
};

export default function search(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_SEARCH_COORDINATES:
      return { ...state, coordinates: action.coordinates };
    default:
      return state;
  }
}
