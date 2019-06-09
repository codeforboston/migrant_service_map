import { createStore, combineReducers } from "redux";

import providers from "./providers";
import providerTypes from "./providerTypes";
import filters from "./filters";
import search from "./search";
import highlightedProviders from "./highlightedProviders";
import mapObject from "./mapObject";

export default createStore(
  combineReducers({
    highlightedProviders,
    providers,
    providerTypes,
    filters,
    search,
    mapObject
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
