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
  faBalanceScale,
  faGripVertical
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
  
  state = { isActive: false }
  
  toggleSave = e => {
    e.stopPropagation();
    this.props.toggleSavedStatus();
  }

  setActive = (e) => {this.setState({isActive: true})}
  unsetActive = (e) => {this.setState({isActive: false})}

  render() {
    const { provider, isSaved, isHighlighted, isDragging, flyToProvider } = this.props;
    const {isActive} = this.state;
    const inSavedMenu = !!this.props.inSavedMenu;
    const isExpanded = isHighlighted;
    const activeClass = isActive ? "active" : "";
    const dragClass = isDragging ? "dragging" : "resting";
    const expandClass = isExpanded ? "expanded" : "wrapped";
    const menuClass = inSavedMenu ? "saved" : "search";
    const cardIcon = cardIconMappings[provider.typeName];
    return (
      <div
        className={`provider-card ${menuClass} card-${expandClass} card-${dragClass} ${activeClass}` }
        id={`provider-${provider.id}`}
        onMouseDown={this.setActive}
        onMouseUp={this.unsetActive}
        onMouseLeave={this.unsetActive}
      >
        {inSavedMenu && (<div className="card-draggable-icon">
        <FontAwesomeIcon
                  icon={faGripVertical}
                />
        </div>)}
        <div className="card-layout">
        <div className="card-container">
          <div className="card-header">
            <h5 className={expandClass}>
              {provider.name}
            </h5>
            <div className="wrapped-info">
              <div className={`prov-type ${expandClass}`}>
                <FontAwesomeIcon
                  icon={cardIcon}
                  color={providerTypeToColor[provider.typeName]}
                />
                <p>{provider.typeName}</p>
              </div>
              {!isExpanded && (
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
              <button className={`remoteButton`} 
                onClick={this.toggleSave}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
                Remove
              </button>
            ) : (
              <button
                className={`button ${isSaved}`}
                onClick={this.toggleSave}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
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
        {isExpanded && <DetailsPane provider={provider} flyToProvider={flyToProvider} />}
        </div>
      </div>
    );
  }
}
