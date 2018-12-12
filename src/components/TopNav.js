import React, { Component } from "react";

export default class TopNav extends Component {
  render() {
    return (
      <nav>
        <div className="header-title">
          <a href="https://refugeeswelcomehome.org/">
            <h1>Migrant Service Map</h1>
          </a>
        </div>
        <div id="top-nav" className="top-nav">
          <a className="top-nav" href="#target">
            Top Nav
          </a>
          <a className="top-nav" href="#target">
            Top Nav
          </a>
          <a className="top-nav" href="#target">
            Top Nav
          </a>
        </div>
      </nav>
    );
  }
}
