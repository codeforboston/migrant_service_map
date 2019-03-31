import React from "react";
import { Row } from "simple-flexbox";
import "./details-pane.css";
import ProviderDetailsInfo from "./provider-details-info";

export default class DetailsPane extends React.Component {
  render() {
    const {
      provider: { email, address, website, telephone, mission }
    } = this.props;
    return (
      <div className="details-pane provider-info">
        <Row>
          <ProviderDetailsInfo icon="email" label="email">
            {email}
          </ProviderDetailsInfo>
          <ProviderDetailsInfo icon="language" label="website">
            <a href={website}> {website}</a>
          </ProviderDetailsInfo>
        </Row>
        <Row>
          <ProviderDetailsInfo icon="perm_phone_msg" label="phone">
            {telephone}
          </ProviderDetailsInfo>
          <ProviderDetailsInfo icon="home" label="address">
            {address || "address"}
          </ProviderDetailsInfo>
        </Row>
        <div className="popup-text">{mission}</div>
      </div>
    );
  }
}
