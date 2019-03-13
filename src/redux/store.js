import { createStore, combineReducers } from "redux";

import providers from "./providers";
import providerTypes from "./providerTypes";
import filters from "./filters";
import search from "./search";

export default createStore(
  combineReducers({ providers, providerTypes, filters, search }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
