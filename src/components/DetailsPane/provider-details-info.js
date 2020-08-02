import React from "react";
import { Column } from "simple-flexbox";
import "./provider-details-info.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faMapPin, faGlobe, faPhone } from "@fortawesome/free-solid-svg-icons";

export default class ProviderDetailsInfo extends React.Component {
  iconsByType = {
    "email": faEnvelope,
    "address": faMapPin,
    "website": faGlobe,
    "phone": faPhone,
  }

  onAddressClicked = (e) => {
    e.stopPropagation();
    if (this.props.onClick) {
      this.props.onClick();
    }
  };

  render() {
    const { label, type, ellipsis } = this.props;
    return (
      <span className="provider-details-info">
        <FontAwesomeIcon
          alt={type + " icon"}
          className="provider-details-icon"
          icon={this.iconsByType[type]}
        />
        <Column
          className={ellipsis ? "ellipsis" : ""}
          justifyContent="center"
          onClick={this.onAddressClicked}
        >
          <div className="provider-details-content-label">
            {label.toUpperCase()}
          </div>
          <div className="providers-detail-content">{this.props.children}</div>
        </Column>
      </span>
    );
  }
}
