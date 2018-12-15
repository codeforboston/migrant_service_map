import React, { Component } from "react";

export default class MenuItem extends Component {
  render() {
    let { name } = this.props;

    return (
      <li className="list-item">
        <a href="#target" /* onClick={mapboxPopup}*/>{name}</a>
      </li>
    );
  }
}
