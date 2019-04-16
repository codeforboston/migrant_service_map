import React from "react";
import { Provider } from "react-redux";
import { Map, TopNav, TabbedMenu } from "./components";

import store from "./redux/store";

import "./App.css";

export default function App() {
  return (
    <Provider store={store}>
      <TopNav />
      <TabbedMenu />
      <Map />
    </Provider>
  );
}
