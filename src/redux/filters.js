import {
  CHANGE_DISTANCE,
  CLEAR_DISTANCE,
  INITIALIZE_VISA,
  CHANGE_VISA,
  CLEAR_VISA
} from "./actions";

const INITIAL_VISA_STATE = {
  allVisas: [],
  visible: [],
};

export default function filters(state = { visa: INITIAL_VISA_STATE }, action) {
  // TO ADD LATER: visa status, accepting clients
  switch (action.type) {
    case CLEAR_DISTANCE: // both init and 'clear' button
      return { ...state, distance: null };
    case CHANGE_DISTANCE:
      return { ...state, distance: action.distance };
    case INITIALIZE_VISA:
      return { ...state, visa: {
        allVisas: action.visas,
        visible: state.visa.visible
      } };
    case CLEAR_VISA: // both init and 'clear' button
      return { ...state, visa: INITIAL_VISA_STATE };
    case CHANGE_VISA:
      return changeVisa(state, action.visa);
    default:
      return state;
  }
}

function changeVisa(state, visa) {
  if (state.visa.visible.includes(visa)) {
    const removedVisible = state.visa.visible.filter(typeId => visa !== typeId);
    return { ...state, visa: {
      allVisas: state.visa.allVisas,
      visible: removedVisible
    } };
  }
  return { ...state, visa: {
    allVisas: state.visa.allVisas,
    visible: [ ...state.visa.visible, visa]
  } };
}