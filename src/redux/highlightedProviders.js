import { HIGHLIGHT_PROVIDER } from "./actions";
import dotProp from "dot-prop-immutable";

export default function highlightedProviders(state = [], action) {
  switch (action.type) {
    case HIGHLIGHT_PROVIDER: {
      const providerIndex = state.findIndex(id => id === action.providerId);
      if (providerIndex > -1) {
        return dotProp.delete(state, providerIndex);
      } else {
        return [action.providerId, ...state];
      }
    }
    default:
      return state;
  }
}
