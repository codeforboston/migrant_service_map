import React from "react";
import "./top-nav.css";

const TopNav = () => {
  return (
    <nav>
      <link rel='stylesheet' 
      href='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v3.1.6/mapbox-gl-geocoder.css'
      type='text/css' />
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
      <div id="nav-search" class="nav-search"></div>
    </nav>
  );
};

export default TopNav;
