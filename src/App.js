import React, { Component } from "react";
import TopNav from "./components/TopNav";
import Map from "./map";

class App extends Component {
  render() {
    return (
      <div>
        <TopNav />
        <Map />
      </div>
    );
  }
}

export default App;
