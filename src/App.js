import React from "react";
import { Provider } from 'react-redux';
import { Column, Row } from "simple-flexbox";
import TopNav from "./components/TopNav";
import Menu from './components/Menu/Menu';
import Map from "./components/Map";

import store from './store';

import "./App.css";

export default function App() {
  return (
    <Provider store={store}>
      <Column style={{ height: "100%" }}>
        <TopNav />
        <Row style={{ flexGrow: 1 }} alignItems="stretch">
          <div className="map-container">
            <Menu />
            <Map />
          </div>
        </Row>
      </Column>
    </Provider>
  );
}
