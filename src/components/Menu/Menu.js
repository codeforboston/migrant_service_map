import React from "react";
import { connect } from "react-redux";

import DropdownMenu from "./DropdownMenu";
import DropdownMenuItem from "./DropdownMenuItem";
import { toggleProviderVisibility } from '../../actions';

export function Menu({ providerTypes, toggleProviderVisibility }) {
  return (
    <div className="side-menu">
      {providerTypes.map(serviceType => (
        <DropdownMenu key={serviceType.id} id={serviceType.id} text={serviceType.name} expanded={serviceType.visible} onToggle={toggleProviderVisibility}>
          {serviceType.providers.sort((a,b) => a.name.localeCompare(b.name)).map((provider, i) => (
            <DropdownMenuItem
              key={i}
              text={provider.name}
              item={provider}
              // clickHandler={this.props.handleMenuItemClick}
            />
          ))}
        </DropdownMenu>
      ))}
    </div>
  );
}

export default connect(({ providerTypes }) => ({ providerTypes }), { toggleProviderVisibility })(Menu);
