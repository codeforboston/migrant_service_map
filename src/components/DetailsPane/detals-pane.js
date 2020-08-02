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
          <ProviderDetailsInfo type="email" label="email" ellipsis>
            <a
              href={"mailto:" + email}
              target="_blank"
              rel="noopener noreferrer"
            >
              {email}
            </a>
          </ProviderDetailsInfo>
          <ProviderDetailsInfo type="website" label="website" ellipsis>
            <a href={website} target="_blank" rel="noopener noreferrer">
              {website}
            </a>
          </ProviderDetailsInfo>
        </Row>
        <Row>
          <ProviderDetailsInfo
            type="address"
            label="address"
            onClick={flyToProvider}
          >
            {address || "address"}
          </ProviderDetailsInfo>
          <ProviderDetailsInfo type="phone" label="phone">
            {telephone}
          </ProviderDetailsInfo>
        </Row>
        <div
          className={"missions" + (isMissionTextExpanded ? " expanded" : "")}
          onClick={e => this.onMissionTextExpanderClicked(e)}
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
