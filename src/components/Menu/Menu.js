import React, { Component, Fragment } from "react";
import { SaveButton } from "../PopUp";
import { MenuDistanceFilter, MenuDropdown, MenuDropdownItem } from "..";

import "./menu.css";

class Menu extends Component {
  render() {
    const {
      providersList,
      savedProviders,
      visibleTypes,
      saveProvider,
      filters,
      unsaveProvider,
      toggleProviderVisibility,
      clearDistanceFilter,
      changeDistanceFilter
    } = this.props;
    return (
      <div className="side-menu">
        <div className="service-providers">
          {!providersList.length && <h3>LOADING ...</h3>}
          {!!providersList.length && (
            <>
              <h3>Service Providers</h3>
              <MenuDistanceFilter
                filters={filters}
                clearDistanceFilter={clearDistanceFilter}
                changeDistanceFilter={changeDistanceFilter}
              />
              {providersList.map(providerType => (
                <Fragment key={providerType.id}>
                  {!!providerType.providers.length && ( //if there is not providers MenuDropdown is not shown
                    <MenuDropdown
                      key={providerType.id}
                      id={providerType.id}
                      text={providerType.name}
                      expanded={visibleTypes.includes(providerType.id)}
                      onToggle={toggleProviderVisibility}
                    >
                      {providerType.providers.map(provider => (
                        <MenuDropdownItem
                          key={provider.id}
                          text={provider.name}
                          item={provider}
                          // clickHandler={this.props.handleMenuItemClick}
                        >
                          <SaveButton
                            isSaved={savedProviders.includes(provider.id)}
                            toggleSavedStatus={() =>
                              savedProviders.includes(provider.id)
                                ? unsaveProvider(provider.id)
                                : saveProvider(provider.id)
                            }
                          />
                        </MenuDropdownItem>
                      ))}
                    </MenuDropdown>
                  )}
                </Fragment>
              ))}
            </>
          )}
        </div>
      </div>
    );
  }
}

export default Menu;
