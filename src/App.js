import React from "react";
import { Provider } from "react-redux";
import TopNav from "./components/TopNav";
import Menu from "./components/Menu/Menu";
import Map from "./components/Map";
import SavedList from "./components/SavedProvidersList";

import store from "./redux/store";

import "./App.css";

export default function App() {
  return (
    <Provider store={store}>
      <div>
        <TopNav />
        <div className="map-container">
          <Menu />
          <Map />
          <SavedList />
        </div>
      </div>
    </Provider>
  );
}
