import React, { Component } from "react";
import { connect } from "react-redux";
import DropdownMenu from "./DropdownMenu";
import DropdownMenuItem from "./DropdownMenuItem";
import { SaveButton } from "../PopUp";
import DistanceFilter from "./DistanceFilter";
import getProvidersByDistance, {
  getProvidersSorted
} from "../../redux/selectors";
import { toggleProviderVisibility, saveProvider, unsaveProvider } from '../../redux/actions';

import "./side-menu.css";

class Menu extends Component {
  debugger;
  render() {
    const {
      providersList,
      savedProviders,
      visibleTypes,
      saveProvider,
      unsaveProvider,
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
                          >
                            <SaveButton
                              isSaved={savedProviders.includes(provider.id)}
                              toggleSavedStatus={ () => 
                                savedProviders.includes(provider.id) ? unsaveProvider(provider.id) : saveProvider(provider.id) }
                            />
                          </DropdownMenuItem>
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
    savedProviders: state.providers.savedProviders,
    visibleTypes: state.providerTypes.visible
  };
};

export default connect(
  mapStateToProps,
  { toggleProviderVisibility, saveProvider, unsaveProvider }
)(Menu);
