import "core-js/features/array/flat";
import "core-js/features/array/flat-map";

import React from "react";
import { Provider } from "react-redux";
import { Map, TopBar, TabbedMenu } from "components";
import ReactTooltip from "react-tooltip";

import store from "redux/store";

import "./App.css";

export default function App() {
  return (
    <Provider store={store}>
      <TopBar />
      <main role="main">
        <TabbedMenu />
        <Map />
        <ReactTooltip effect="solid" place="bottom" className="tooltip" />
      </main>
    </Provider>
  );
}
