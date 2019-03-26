import { CHANGE_DISTANCE, CLEAR_DISTANCE } from "./actions";

export default function filters(state = {}, action) {
  // TO ADD LATER: visa status, accepting clients
  switch (action.type) {
    case CLEAR_DISTANCE: // both init and 'clear' button
      return { ...state, distance: null };
    case CHANGE_DISTANCE:
      return { ...state, distance: action.distance };
    default:
      return state;
  }
}
