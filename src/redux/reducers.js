import dotProp from "dot-prop-immutable";

import {
  INITIALIZE_PROVIDERS,
  TOGGLE_TYPE,
  CLEAR_DISTANCE,
  CHANGE_DISTANCE,
  SET_SEARCH_COORDINATES
} from "./actions";

export function providerTypes(state = [], action) {
  switch (action.type) {
    case INITIALIZE_PROVIDERS:
      return groupProvidersByType(action.providers);
    case TOGGLE_TYPE:
      const typeIndex = state.findIndex(
        type => type.id === action.providerType
      );
      return dotProp.toggle(state, `${typeIndex}.visible`);
    default:
      return state;
  }
}

function groupProvidersByType(providers) {
  return providers.reduce((types, provider) => {
    const type = types.find(type => type.name === provider["Type of Service"]);
    if (type) {
      type.providers.push(provider);
    } else {
      let id = provider["Type of Service"]
        .toLowerCase()
        .split(" ")
        .join("-");
      if (id === "community-center") {
        // special case
        id = "community-centers";
      }
      types.push({
        id,
        name: provider["Type of Service"],
        visible: false,
        providers: [provider]
      });
    }
    return types;
  }, []);
}

export function filters(state = [], action) {
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

// searches [{
//   location: {
//     searchTerm
//     coordinates
//   }
//   results: []
// }]

// searchTerm searchLocation searchString searchAddress
// search {
//   term
//   coordinates

// }
// focusPoint referenceCoordinates centerCoordinates searchPoint epicenter searchCenter groundZero bullseye axisMundi nucleus center

export function search(state = [], action) {
  switch (action.type) {
    case SET_SEARCH_COORDINATES:
      return { ...state, coordinates: action.coordinates };
    default:
      return state;
  }
}
