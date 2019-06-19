import React from "react";
import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderPlus,
  faFolderOpen,
  faEnvelopeOpenText,
  faGlobeEurope,
  faMapMarkedAlt,
  faPhone,
  faTrashAlt,
  faBriefcase,
  faPlaceOfWorship,
  faGraduationCap,
  faMoneyBillWave,
  faLandmark,
  faFileContract,
  faHospital,
  faBed,
  faBalanceScale
} from "@fortawesome/free-solid-svg-icons";
import "./menu-dropdown-item.css";
import DetailsPane from "components/DetailsPane";
import providerTypeToColor from "provider-type-to-color.json";

const isPresent = value => value && value !== "n/a";

const cardIconMappings = {
  "Job Placement": faBriefcase,
  "Community Center": faPlaceOfWorship,
  Education: faGraduationCap,
  "Cash/Food Assistance": faMoneyBillWave,
  Resettlement: faLandmark,
  "Mental Health": faFileContract,
  Health: faHospital,
  Housing: faBed,
  Legal: faBalanceScale
};

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
      isSaved,
      toggleSavedStatus,
      isHighlighted,
      toggleHighlight
    } = this.props;
    const inSavedMenu = this.props.inSavedMenu ? this.props.inSavedMenu : false;
    const savedMenuHighlightedProviderCard =
      inSavedMenu && isHighlighted ? "savedHighlighted" : "unchanged";
    const { expand } = this.state;
    const cardIcon = cardIconMappings[provider.typeName];
    return (
      <div
        className={`provider-card ${savedMenuHighlightedProviderCard}`}
        id={`provider-${provider.id}`}
      >
        <div className="card-container">
          <div className="card-header">
            <h5 onClick={toggleHighlight}>{provider.name}</h5>
            <div className="wrapped-info">
              <div className={`prov-type ${expand}`}>
                <FontAwesomeIcon icon={cardIcon} color={providerTypeToColor[provider.typeName]} />
                <p>{provider.typeName}</p>
              </div>
              {!isHighlighted && (
                <div className="wrapped-icons">
                  {isPresent(provider.email) && (
                    <FontAwesomeIcon icon={faEnvelopeOpenText} />
                  )}
                  {isPresent(provider.website) && (
                    <FontAwesomeIcon icon={faGlobeEurope} />
                  )}
                  {!!provider.coordinates.length && (
                    <FontAwesomeIcon icon={faMapMarkedAlt} />
                  )}
                  {isPresent(provider.telephone) && (
                    <FontAwesomeIcon icon={faPhone} />
                  )}
                </div>
              )}
              <div>
                {provider.distance ? (
                  <p>{Math.round(provider.distance * 10) / 10} mi away</p>
                ) : null}
              </div>
            </div>
          </div>
          <div className="save-button-container">
            {inSavedMenu ? (
              <button className={`remoteButton`} onClick={toggleSavedStatus}>
                <FontAwesomeIcon icon={faTrashAlt} />
                Remove
              </button>
            ) : (
              <button
                className={`button ${isSaved}`}
                onClick={toggleSavedStatus}
              >
                {isSaved === "saved" ? (
                  <Fragment>
                    <FontAwesomeIcon icon={faFolderOpen} />
                    SAVED
                  </Fragment>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faFolderPlus} />
                    SAVE
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        {isHighlighted && <DetailsPane provider={provider} />}
      </div>
    );
  }
}
