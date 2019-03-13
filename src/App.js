import React from "react";
import { Provider } from 'react-redux';
import { Column, Row } from "simple-flexbox";
import TopNav from "./components/TopNav";
import Menu from './components/Menu/Menu';
import Map from "./components/Map";
import ProviderDetailList from "./components/ProviderDetailList";

import store from './store';

import "./App.css";

export default function App() {
  return (
    <Provider store={store}>
      <div>
        <TopNav />
        <div className="map-container">
          <Menu />
          <ProviderDetailList />
          <Map />
        </div>
      </div>
    </Provider>
  );
}
