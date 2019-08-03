import React from "react";
import { Provider } from "react-redux";
import { Map, TopBar, TabbedMenu } from "components";

import store from "redux/store";

import "./App.css";

export default function App() {
  return (
    <Provider store={store}>
      <TopBar />
      <main role="main">
        <TabbedMenu />
        <Map />
      </main>
    </Provider>
  );
}
