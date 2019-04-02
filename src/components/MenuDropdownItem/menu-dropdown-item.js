import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderPlus,
  faUsers,
  faEnvelopeOpenText,
  faGlobeEurope,
  faMapMarkedAlt,
  faPhone,
  faTrashAlt
} from "@fortawesome/free-solid-svg-icons";
import "./menu-dropdown-item.css";
import DetailsPane from "../DetailsPane";

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
      toggleSavedStatus,
      isHighlighted
    } = this.props;
    const { expand, more } = this.state;
    return (
      <div className="provider-card">
        <div className="card-container">
          <div className="card-header">
            <h5 /*onClick={this.onItemClick}*/>{provider.name}</h5>
            <div className="wrapped-info">
              <div className={`prov-type ${expand}`}>
                <FontAwesomeIcon icon={faUsers} />
                <p>{providerTypeName}</p>
              </div>
              {!isHighlighted && (
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
        {isHighlighted && (
          <DetailsPane provider={provider} />
        )}
      </div>
    );
  }
}
