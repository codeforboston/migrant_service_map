import React, { Component } from "react";
import "components/ProviderList/provider-list.css";
import Logo from "./logo";
import ProviderTypeDropdown from "./provider-type-dropdown";
import Search from "./search";
import DistanceDropdown from "./distance-dropdown";
import HelpIcon from "./help-icon.js";
import "./top-bar.css";
// import VisaStatusDropdown from "./visa-status-dropdown";

class TopBar extends Component {

  render() {
    const {
      distance,
      changeDistanceFilter,
      clearDistanceFilter,
      providerTypes,
      toggleProviderVisibility,
      // visaTypes
      // changeVisaFilter,
    } = this.props;
    const topBarItemClass = "top-bar-item";

    return (
      <div className="top-bar">
        {/* <VisaStatusDropdown
          className={topBarItemClass}
          onChange={changeVisaFilter}
          visaTypes={visaTypes}
        /> */}
        <Logo />
        <ProviderTypeDropdown
          className={topBarItemClass}
          providerTypes={providerTypes}
          onChange={toggleProviderVisibility}
        />
        <Search
          className={topBarItemClass}
        />
        <DistanceDropdown
          className={topBarItemClass}
          currentDistance={distance}
          onChange={changeDistanceFilter}
          onClear={clearDistanceFilter}
        />
        <HelpIcon
          className={topBarItemClass}
          // onChange={this.onDistanceSelected}
        />
      </div>
    );
  }
}

export default TopBar;
