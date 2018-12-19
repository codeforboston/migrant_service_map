import React, { Component } from "react";
import { Column, Row } from "simple-flexbox";
import TopNav from "./components/TopNav";
import Map from "./components/Map";
import "./App.css";

class App extends Component {
  render() {
    return (
      <Column style={{ height: "100%" }}>
        <TopNav />
        <Row style={{ flexGrow: 1 }} alignItems="stretch">
          <Map />
        </Row>
      </Column>
    );
  }
}

export default App;
 