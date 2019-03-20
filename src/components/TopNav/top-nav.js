import React from "react";
import "./top-nav.css";

const TopNav = () => {
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
};

export default TopNav;
