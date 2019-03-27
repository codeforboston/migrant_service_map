import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderPlus,
  faGripLines,
  faUsers,
  faEnvelopeOpenText,
  faGlobeEurope,
  faMapMarkedAlt,
  faPhone,
  faTrashAlt
} from "@fortawesome/free-solid-svg-icons";
import "./menu-dropdown-item.css";

export default class DropdownMenuItem extends React.Component {
  state = { expand: "wrapped", more: false };

  onItemClick = () => {
    const { expand } = this.state;
    expand === "wrapped"
      ? this.setState({ expand: "expanded" })
      : this.setState({ expand: "wrapped" });
  };

  render() {
    const {
      provider,
      providerTypeName,
      isSaved,
      toggleSavedStatus
    } = this.props;
    const { expand, more } = this.state;
    return (
      <div className="provider-card">
        <div className="card-container">
          <div className="card-header">
            <h5 onClick={this.onItemClick}>{provider.name}</h5>
            <div className="wrapped-info">
              <div className={`prov-type ${expand}`}>
                <FontAwesomeIcon icon={faUsers} />
                <p>{providerTypeName}</p>
              </div>
              {expand === "wrapped" && (
                <div className="wrapped-icons">
                  {provider.email && (
                    <FontAwesomeIcon icon={faEnvelopeOpenText} />
                  )}
                  {provider.website && <FontAwesomeIcon icon={faGlobeEurope} />}
                  {!!provider.coordinates.length && (
                    <FontAwesomeIcon icon={faMapMarkedAlt} />
                  )}
                  {provider.telephone && <FontAwesomeIcon icon={faPhone} />}
                </div>
              )}
              <div>
                <p> {/* TODO Distance */}3.4 mi away</p>
              </div>
            </div>
          </div>
          <div className="save-button-container">
            <button className={`button ${isSaved}`} onClick={toggleSavedStatus}>
              {isSaved === "saved" ? (
                <>
                  <FontAwesomeIcon icon={faTrashAlt} />
                  REMOVE
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faFolderPlus} />
                  SAVE
                </>
              )}
            </button>
          </div>
        </div>
        {expand === "expanded" && (
          <div className="details-pane">
            <div className="provider-info">
              <span className="popup-info">
                <img
                  alt="phone icon"
                  src="https://icon.now.sh/perm_phone_msg"
                />
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
        )}
      </div>
    );
  }
}
