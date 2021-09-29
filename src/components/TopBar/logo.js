import React from "react";
import logo from "../../assets/icons/msm_logo.svg";

export default class Logo extends React.Component {
  render() {
    return (
        <div id="logo">
            <a href="https://bostonmapnetwork.org/" target="_blank" rel="noopener noreferrer">
              <img src={logo} alt="Migrant Service Map" />
            </a>
        </div>
    );
  }
}
