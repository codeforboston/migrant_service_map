import React from "react";
import { connect } from "react-redux";

import DropdownMenu from "./DropdownMenu";
import DropdownMenuItem from "./DropdownMenuItem";
import DistanceFilter from "./DistanceFilter";
import { toggleProviderVisibility } from '../../actions';
import getProvidersByDistance from '../../selectors';

import './side-menu.css';

export function Menu({ providerTypes, filterProviders, toggleProviderVisibility }) {
  return (
    <div className="side-menu">
      <div className="service-providers">
        <h3>Service Providers</h3>
        <DistanceFilter/>
<<<<<<< HEAD
        {providerTypes.map(serviceType => (
          <DropdownMenu key={serviceType.id} id={serviceType.id} text={serviceType["Organization Name"]} expanded={serviceType.visible} onToggle={toggleProviderVisibility}>
            {serviceType.providers.sort((a,b) => a["Organization Name"].localeCompare(b["Organization Name"])).map((provider, i) => (
=======
        {providerTypes.map(serviceType => {
          let providers = serviceType.providers;
          if (filterProviders.distance && serviceType.providers) {
            providers = getProvidersByDistance(filterProviders.searchCenter, serviceType.providers, filterProviders.distance);
          }
          return <DropdownMenu key={serviceType.id} id={serviceType.id} text={serviceType.name} expanded={serviceType.visible} onToggle={toggleProviderVisibility}>
            {providers.sort((a,b) => a.name.localeCompare(b.name)).map((provider, i) => (
>>>>>>> byron/distance-filter-redux
              <DropdownMenuItem
                key={i}
                text={provider["Organization Name"]}
                item={provider}
                // clickHandler={this.props.handleMenuItemClick}
              />
            ))}
          </DropdownMenu>
        })}
      </div>
    </div>
  );
}

export default connect(({ providerTypes, filterProviders }) => ({ providerTypes, filterProviders }), { toggleProviderVisibility })(Menu);
