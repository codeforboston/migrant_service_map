import React from "react";
import { Column } from "simple-flexbox";
import "./provider-details-info.css";

export default class ProviderDetailsInfo extends React.Component {

  onAddressClicked = e => {
    e.stopPropagation();
    this.props.flyToProvider();
  }

  render() {
    const { label, icon, ellipsis } = this.props;
    return (
      <span className="provider-details-info">
        <img
          className="provider-details-icon"
          alt={icon + " icon"}
          src={"https://icon.now.sh/" + icon}
        />
        <Column className={ellipsis ? "ellipsis" : ""} justifyContent="center" onClick={this.onAddressClicked}>
          <div className="provider-details-content-label">
            {label.toUpperCase()}
          </div>
          <div className="providers-detail-content">{this.props.children}</div>
        </Column>
      </span>
    );
  }
}
