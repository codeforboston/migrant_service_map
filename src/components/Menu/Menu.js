import React from "react";
import { connect } from "react-redux";

import DropdownMenu from "./DropdownMenu";
import DropdownMenuItem from "./DropdownMenuItem";
import DistanceFilter from "./DistanceFilter";
import { toggleProviderVisibility } from '../../actions';

import './side-menu.css';

export function Menu({ providerTypes, toggleProviderVisibility }) {
  return (
    <div className="side-menu">
      <div className="service-providers">
        <h3>Service Providers</h3>
        <DistanceFilter/>
        {providerTypes.map(serviceType => (
          <DropdownMenu key={serviceType.id} id={serviceType.id} text={serviceType["Organization Name"]} expanded={serviceType.visible} onToggle={toggleProviderVisibility}>
            {serviceType.providers.sort((a,b) => a["Organization Name"].localeCompare(b["Organization Name"])).map((provider, i) => (
              <DropdownMenuItem
                key={i}
                text={provider["Organization Name"]}
                item={provider}
                // clickHandler={this.props.handleMenuItemClick}
              />
            ))}
          </DropdownMenu>
        ))}
      </div>
    </div>
  );
}

export default connect(({ providerTypes }) => ({ providerTypes }), { toggleProviderVisibility })(Menu);
