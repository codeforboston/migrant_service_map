import React from "react";
import ReactDOM from "react-dom";
// Import transitively imports mapbox-gl, which tries to access window.URL.createObjectURL,
// Which doesn't exist in jsdom.
// TODO: Fix or mock out mapbox-gl.
// import App from "./App";

it.skip("renders without crashing", () => {
  const div = document.createElement("div");
  // ReactDOM.render(<App />, div);
  // ReactDOM.unmountComponentAtNode(div);
});
