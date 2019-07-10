import {
  CHANGE_DISTANCE,
  CLEAR_DISTANCE,
  INITIALIZE_VISA,
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
    case INITIALIZE_VISA:
      return { ...state, visa: action.visa };
    case CLEAR_VISA: // both init and 'clear' button
      return { ...state, visa: null };
    case CHANGE_VISA:
      return { ...state, visa: action.visa }; /*** THIS WILL NEED TO CHANGE ***/
    default:
      return state;
  }
}
