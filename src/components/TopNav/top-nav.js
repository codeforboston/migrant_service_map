import React, { Component } from "react";
import "../ProviderList/provider-list.css";
import AcceptingNewFilter from "../MenuAcceptingNewFilter/menu-accepting-new-filter.js";
import { MenuDistanceFilter, MenuVisaFilter } from "..";
import SimpleDropdown from "../SimpleDropdown/simple-dropdown";
import { Row } from "simple-flexbox";

class TopNav extends Component {
  toggle = (name, event) => {
    const myDiv = event.currentTarget;
    console.log(myDiv);
    Array.from(myDiv.classList).includes("expanded")
      ? myDiv.classList.remove("expanded")
      : myDiv.classList.add("expanded");
  };

  render() {
    const {
      filters,
      clearDistanceFilter,
      changeDistanceFilter,
      clearVisaFilter,
      changeVisaFilter,
      visibleTypes,
      providerTypes,
      toggleProviderVisibility
    } = this.props;
    return (
      <nav className="top-nav">
        <link
          rel="stylesheet"
          href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v3.1.6/mapbox-gl-geocoder.css"
          type="text/css"
        />
        <div className="upper-bar">
          <ul className="dropdown-row">
            <Row className="dropdown-list-container">
              <MenuVisaFilter
                handleClick={this.toggle.bind(this, this.props.name)}
                filters={filters}
                clearVisaFilter={clearVisaFilter}
                changeVisaFilter={changeVisaFilter}
              />
            </Row>
            <Row className="dropdown-list-container">
              <SimpleDropdown
                handleClick={this.toggle.bind(this, this.props.name)}
                heading={"Provider Type"}
                subHead={"Currently selected providers"}
                incomingState={visibleTypes}
                handleChange={toggleProviderVisibility}
                items={providerTypes.allIds}
              />
            </Row>
            <Row className="dropdown-list-container">
              <AcceptingNewFilter />
            </Row>
            <Row className="dropdown-list-container">
              <div
                id="nav-search"
                className="nav-search"
                style={{ flex: 0.5 }}
              />
            </Row>
            <Row className="dropdown-list-container">
              <MenuDistanceFilter
                handleClick={this.toggle.bind(this, this.props.name)}
                filters={filters}
                clearDistanceFilter={clearDistanceFilter}
                changeDistanceFilter={changeDistanceFilter}
              />
            </Row>
          </ul>
        </div>
      </nav>
    );
  }
}

export default TopNav;
