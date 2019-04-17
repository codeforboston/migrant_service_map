import { HIGHLIGHT_PROVIDER } from "./actions";
import dotProp from "dot-prop-immutable";

export default function highlightedProviders(state = [], action) {
  switch (action.type) {
    case HIGHLIGHT_PROVIDER: {
      const providerIndex = state.findIndex(id => id === action.providerId);
      if (providerIndex > -1) {
        return dotProp.delete(state, providerIndex);
      } else {
        const offsetTop = document.getElementById(`provider-${action.providerId}`).offsetTop;
        const cardOffset = 50;
        document.getElementsByClassName('panels')[0].scrollTop = offsetTop - cardOffset;
        return [action.providerId, ...state];
      }
    }
    default:
      return state;
  }
}
