import React from "react";
import logo from "../../assets/icons/msm_logo.png";

export default class Logo extends React.Component {
  render() {
    return (
        <div id="logo">
            <img src={logo}
            alt="Migrate Service Map"
            />
        </div>
    );
  }
}
