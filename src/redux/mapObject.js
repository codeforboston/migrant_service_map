import { SET_MAP_OBJECT } from "./actions";

const INITIAL_STATE = {
  mapObject: {}
};

export default function mapObject(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_MAP_OBJECT:
      return action.mapObject;
    default:
      return state;
  }
}
