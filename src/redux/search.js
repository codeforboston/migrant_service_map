import {
  SELECT_TAB,
  FLY_TO_PROVIDER,
  ZOOM_TO_FIT,
  CLEAR_SEARCH_RESULT,
  SET_SEARCH_RESULT,
} from "./actions";

const INITIAL_STATE = {
  mapCenter: [-71.066954, 42.359947],
  coordinates: [-71.066954, 42.359947],
  selectedTabIndex: 0,
  currentLocation: "default", //references item in history object once user submits search string
  history: {
    default: {
      coordinates: [-71.066954, 42.359947],
      searchText: "center of Boston"
    }
  }
};

export default function search(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SELECT_TAB:
      return { ...state, selectedTabIndex: action.index };
    case SET_SEARCH_RESULT:
      return {
        ...state,
        searchKey: action.key,
        coordinates: action.coordinates,
        currentLocation: action.mapboxId,
        selectedTabIndex: 0,
        history: {
          ...state.history,
          [action.mapboxId]: {
            coordinates: action.coordinates,
            searchText: action.text
          }
        }
      };
    case CLEAR_SEARCH_RESULT:
      return {
        ...INITIAL_STATE,
        searchKey: action.key,
        selectedTabIndex: state.selectedTabIndex
      }
    case FLY_TO_PROVIDER:
      return {
        ...state,
        flyToProviderId: action.id,
        flyToProviderKey: action.key
      };
    case ZOOM_TO_FIT:
      return {
        ...state,
        zoomToFitKey: action.key
      };
    default:
      return state;
  }
}
