import React from "react";
import { connect } from "react-redux";
import DropdownMenu from "./DropdownMenu";
import DropdownMenuItem from "./DropdownMenuItem";
import DistanceFilter from "./DistanceFilter";
import MenuSearch from "./MenuSearch";
import { toggleProviderVisibility } from '../../actions';
import { getProvidersByDistance, getProvidersByName } from '../../selectors';

import './side-menu.css';

export function Menu({ providerTypes, filters, search, toggleProviderVisibility }) {
  return (
    <div className="side-menu">
      <div className="service-providers">
        <h3>Service Providers</h3> 
        <MenuSearch></MenuSearch> 
        <DistanceFilter/>
        {providerTypes.map(serviceType => {
          let providers = serviceType.providers;

          
          // if search center is set, sort by closest, otherwise alphabetical
          if (filters.distance) {
            providers = getProvidersByDistance(search.coordinates, providers, filters.distance);

          } 
          
          if (filters.name) {
            providers = getProvidersByName(providers, filters.name);

          }

          if (!filters.distance && !filters.name) {
            providers.sort((a,b) => a.name.localeCompare(b.name))
          }
        

          return <DropdownMenu key={serviceType.id} id={serviceType.id} text={serviceType.name} expanded={serviceType.visible} onToggle={toggleProviderVisibility}>
          {
            providers.length ?
              providers.map((provider, i) => (
              <DropdownMenuItem
                key={i}
                text={provider.name}
                item={provider}
                // clickHandler={this.props.handleMenuItemClick}
              />))
              : <div className="list-item"><i>no matching providers</i></div>
          }
          </DropdownMenu>
        })}
      </div>
    </div>
  );
}

export default connect(({ providerTypes, filters, search }) => ({ providerTypes, filters, search }), { toggleProviderVisibility })(Menu);
