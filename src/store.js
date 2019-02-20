import { createStore, combineReducers } from 'redux';

import * as reducers from './reducers';

export default createStore(
  combineReducers(reducers),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
