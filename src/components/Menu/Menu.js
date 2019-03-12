import React, { Component } from "react";
import { connect } from "react-redux";
import DropdownMenu from "./DropdownMenu";
import DropdownMenuItem from "./DropdownMenuItem";
import DistanceFilter from "./DistanceFilter";
import { toggleProviderVisibility } from "../../redux/actions";
import getProvidersByDistance, {
  getProvidersSorted
} from "../../redux/selectors";

import "./side-menu.css";

class Menu extends Component {
  debugger;
  render() {
    const {
      providersList,
      visibleTypes,
      toggleProviderVisibility
    } = this.props;
    return (
      <div className="side-menu">
        <div className="service-providers">
          {!providersList.length && <h3>LOADING ...</h3>}
          {!!providersList.length && (
            <>
              <h3>Service Providers</h3>
              <DistanceFilter />
              {providersList.map(providerType => {
                //let providerTypeId = providerTypes.byId[id];

                // if search center is set, sort by closest, otherwise alphabetical
                /*if (filters.distance) {
                       providerTypeId = providerTypeId.providers.map(providerId =>
                         getProvidersByDistance(
                           search.coordinates,
                           providers.byId[providerId],
                           filters.distance
                         )
                       );
                     }
                     */
                return (
                  <DropdownMenu
                    key={providerType.id}
                    id={providerType.id}
                    text={providerType.name}
                    expanded={visibleTypes.includes(providerType.id)}
                    onToggle={toggleProviderVisibility}
                  >
                    {providerType.providers.length ? (
                      providerType.providers.map(provider => {
                        return (
                          <DropdownMenuItem
                            key={provider.id}
                            text={provider.name}
                            item={provider}
                            // clickHandler={this.props.handleMenuItemClick}
                          />
                        );
                      })
                    ) : (
                      <div className="list-item">
                        <i>no matching providers</i>
                      </div>
                    )}
                  </DropdownMenu>
                );
              })}
            </>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    providersList: getProvidersSorted(state),
    visibleTypes: state.providerTypes.visible
  };
};

export default connect(
  mapStateToProps,
  { toggleProviderVisibility }
)(Menu);
