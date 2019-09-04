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
      <TabbedMenu />
      <Map />
      <ReactTooltip effect="solid" place="bottom" className="tooltip" />
    </Provider>
  );
}
