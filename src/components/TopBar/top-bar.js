import React, { Component } from "react";
import "components/ProviderList/provider-list.css";
import AcceptingNewFilter from "components/MenuAcceptingNewFilter/menu-accepting-new-filter.js";
import { MenuDistanceFilter, MenuVisaFilter } from "components";
import SimpleDropdown from "components/SimpleDropdown/simple-dropdown";
import { Row } from "simple-flexbox";
import VisaStatusDropdown from "./visa-status-dropdown";
import ProviderTypeDropdown from "./provider-type-dropdown";
import Search from "./search";
import DistanceDropdown from "./distance-dropdown";

import "./top-bar.css";

class TopBar extends Component {
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
    const topBarItemClass = "top-bar-item";
    return (
      <div className="top-bar">
        <VisaStatusDropdown className={topBarItemClass} />
        <ProviderTypeDropdown className={topBarItemClass} />
        <AcceptingNewFilter className={topBarItemClass} />
        <Search />
        <DistanceDropdown className={topBarItemClass} />
      </div>
    );
  }
}

export default TopBar;
