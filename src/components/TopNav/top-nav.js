import React, { Component } from "react";
import "../Menu/menu.css";
import AcceptingNewFilter from "../MenuAcceptingNewFilter/menu-accepting-new-filter.js";
import { MenuDistanceFilter, MenuVisaFilter } from "..";
import SimpleDropdown from "../SimpleDropdown/simple-dropdown";
import { toggleProviderVisibility } from "../../redux/actions";

class TopNav extends Component {
  toggle = (name, event) => {
    const myDiv = event.currentTarget;
    console.log(myDiv);
    Array.from(myDiv.classList).includes("expanded")
      ? myDiv.classList.remove("expanded")
      : myDiv.classList.add("expanded");
  };

  // expanded={visibleTypes.includes(providerType.id)}
  //                     onToggle={toggleProviderVisibility}

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
            <MenuVisaFilter
              handleClick={this.toggle.bind(this, this.props.name)}
              filters={filters}
              clearVisaFilter={clearVisaFilter}
              changeVisaFilter={changeVisaFilter}
            />
            <SimpleDropdown
              handleClick={this.toggle.bind(this, this.props.name)}
              heading={"Provider Type"}
              subHead={"Currently selected providers"}
              incomingState={visibleTypes}
              handleChange={toggleProviderVisibility}
              items={providerTypes.allIds}
            />

            <li className="dropdown-list-container">
              <AcceptingNewFilter />
            </li>
            <li className="dropdown-list-container">
              <div id="nav-search" className="nav-search" style={{ flex: 0.5 }} />
            </li>
            <MenuDistanceFilter
              handleClick={this.toggle.bind(this, this.props.name)}
              filters={filters}
              clearDistanceFilter={clearDistanceFilter}
              changeDistanceFilter={changeDistanceFilter}
            />
          </ul>
        </div>
      </nav>
    );
  }
}

export default TopNav;
