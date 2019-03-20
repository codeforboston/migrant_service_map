import React from "react";
import "./details-pane.css";

const DetailsPane = ({ provider }) => (
  <div className="details-pane">
    <div className="provider-info">
      <span className="popup-info">
        <img alt="phone icon" src="https://icon.now.sh/perm_phone_msg" />
        {provider.telephone}
      </span>
      <span className="popup-info">
        <img alt="web icon" src="https://icon.now.sh/language" />
        <a href={provider.website}> {provider.website}</a>
      </span>
      <span className="popup-info">
        <img alt="home icon" src="https://icon.now.sh/home" />
        {provider.address || "address"}
      </span>
      <div className="popup-text">{provider.mission.slice(0, 70)}</div>
    </div>
  </div>
);

export default DetailsPane;
