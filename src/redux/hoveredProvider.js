import { HOVERED_PROVIDER } from "./actions";

export default function hoveredProvider(state = null, action) {
  switch (action.type) {
    case HOVERED_PROVIDER: {
      state = action.id;
    }
    default:
      return state;
  }
}
