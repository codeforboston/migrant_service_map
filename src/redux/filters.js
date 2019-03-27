import {
  CHANGE_DISTANCE,
  CLEAR_DISTANCE,
  CHANGE_VISA,
  CLEAR_VISA
} from "./actions";

export default function filters(state = {}, action) {
  // TO ADD LATER: visa status, accepting clients
  switch (action.type) {
    case CLEAR_DISTANCE: // both init and 'clear' button
      return { ...state, distance: null };
    case CHANGE_DISTANCE:
      return { ...state, distance: action.distance };
    case CLEAR_VISA: // both init and 'clear' button
      return { ...state, visa: null };
    case CHANGE_VISA:
      return { ...state, visa: action.visa };
    default:
      return state;
  }
}
