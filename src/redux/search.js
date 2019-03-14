import { SET_SEARCH_COORDINATES } from "./actions";

export default function search(state = {}, action) {
  switch (action.type) {
    case SET_SEARCH_COORDINATES:
      return { ...state, coordinates: action.coordinates };
    default:
      return state;
  }
}
