import { HOVERED_PROVIDER } from "./actions";

export default function hoveredProvider(state = null, action) {
  if (action.type === HOVERED_PROVIDER) {
    state = action.id;
  }
  return state;
}
