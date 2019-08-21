import React from "react";
import { Row } from "simple-flexbox";
import "./details-pane.css";
import ProviderDetailsInfo from "./provider-details-info";

export default class DetailsPane extends React.Component {
  state = { isMissionTextExpanded: false };

  onMissionTextExpanderClicked = e => {
    e.stopPropagation();
    const { isMissionTextExpanded } = this.state;

    this.setState({ isMissionTextExpanded: !isMissionTextExpanded });
  };

  render() {
    const {
      provider: { email, address, website, telephone, mission },
      flyToProvider
    } = this.props;
    const { isMissionTextExpanded } = this.state;
    return (
      <div className="details-pane provider-info">
        <Row>
          <ProviderDetailsInfo icon="email" label="email" ellipsis>
            <a href={"mailto:" + email}>{email}</a>
          </ProviderDetailsInfo>
          <ProviderDetailsInfo icon="language" label="website" ellipsis>
            <a href={website}> {website}</a>
          </ProviderDetailsInfo>
        </Row>
        <Row>
          <ProviderDetailsInfo icon="home" label="address" flyToProvider={flyToProvider}>
            {address || "address"}
          </ProviderDetailsInfo>
          <ProviderDetailsInfo icon="perm_phone_msg" label="phone">
            {telephone}
          </ProviderDetailsInfo>
        </Row>
        <div
          className={"missions" + (isMissionTextExpanded ? " expanded" : "")}
        >
          {mission}
        </div>
        <div
          className="missions-expander"
          onClick={e => this.onMissionTextExpanderClicked(e)}
        >
          SHOW {isMissionTextExpanded ? "LESS" : "MORE"}
        </div>
      </div>
    );
  }
}
