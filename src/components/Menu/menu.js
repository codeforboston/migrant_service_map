import React, { Component } from "react";
import {
  MenuDistanceFilter,
  MenuVisaFilter,
  MenuDropdown,
  MenuDropdownItem
} from "..";

import "./menu.css";

class Menu extends Component {
  render() {
    const {
      providersList,
      savedProviders,
      visibleTypes,
      saveProvider,
      filters,
      toggleProviderVisibility,
      clearDistanceFilter,
      changeDistanceFilter,
      clearVisaFilter,
      changeVisaFilter,
      highlightedProviders,
      displayProviderInformation
    } = this.props;
    return (
      <div className="">
        <div className="service-providers">
          {!providersList.length && <h3>LOADING ...</h3>}
          {!!providersList.length && (
            <>
              <MenuDistanceFilter
                filters={filters}
                clearDistanceFilter={clearDistanceFilter}
                changeDistanceFilter={changeDistanceFilter}
              />
              <MenuVisaFilter filters={filters} clearVisaFilter={clearVisaFilter} changeVisaFilter={changeVisaFilter} />
              {providersList.map(providerType => (
                <ul key={providerType.id}>
                  {!!providerType.providers.length && ( //if there is not providers MenuDropdown is not shown
                    <MenuDropdown
                      key={providerType.id}
                      id={providerType.id}
                      text={providerType.name}
                      expanded={visibleTypes.includes(providerType.id)}
                      onToggle={toggleProviderVisibility}
                    >
                      {providerType.providers.map(provider => (
                        <li key={provider.id} onClick={() => displayProviderInformation(provider.id)}>
                          <MenuDropdownItem
                            key={provider.id}
                            provider={provider}
                            providerTypeName={providerType.name}
                            isHighlighted={highlightedProviders.includes(provider.id)}
                            isSaved={savedProviders.includes(provider.id) ? "saved" : "unsaved"}
                            toggleSavedStatus={() => saveProvider(provider.id)}
                          />
                        </li>
                      ))}
                    </MenuDropdown>
                  )}
                </ul>
              ))}
            </>
          )}
        </div>
      </div>
    );
  }
}

export default Menu;
