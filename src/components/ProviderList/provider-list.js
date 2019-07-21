import React, { Component } from "react";
import { MenuDropdown, MenuDropdownItem } from "..";
import SortDropdown from "./sort-dropdown.js";

import "./provider-list.css";

class ProviderList extends Component {
  render() {
    const {
      providersList,
      savedProviders,
      saveProvider,
      incomingState,
      sortDirection,
      changeSortOrder,
      changeSortDirection,
      highlightedProviders,
      displayProviderInformation
    } = this.props;
    return (
      <div className="service-providers">
        {!providersList.length && (
          <div className={"tab-header"}>
            <h3 className={"header-text"}>No Matching Results</h3>
            <div className={"header-subtext"}>
              Use the filters in the top bar to adjust the number of results
            </div>
          </div>
        )}
        {!!providersList.length && (
          <>
            <SortDropdown
              className="sort-by"
              options={["Distance", "Name", "Provider Type"]}
              header="Sort By"
              handleChange={id => {
                changeSortOrder(id);
              }}
              changeDirection={() => {
                changeSortDirection(sortDirection === "desc" ? "asc" : "desc");
              }}
              sortDirection={sortDirection}
              group="sort"
              incomingState={incomingState}
            />
            {providersList.map(providerType => (
              <ul key={providerType.id} className="providers-list">
                {!!providerType.providers.length && ( //if there is not providers MenuDropdown is not shown
                  <MenuDropdown
                    key={providerType.id}
                    id={providerType.id}
                    text={providerType.name}
                  >
                    {providerType.providers.map(provider => (
                      <li
                        key={provider.id}
                        onClick={() => displayProviderInformation(provider.id)}
                      >
                        <MenuDropdownItem
                          key={provider.id}
                          provider={provider}
                          isHighlighted={highlightedProviders.includes(
                            provider.id
                          )}
                          isSaved={
                            savedProviders.includes(provider.id)
                              ? "saved"
                              : "unsaved"
                          }
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
    );
  }
}

export default ProviderList;
