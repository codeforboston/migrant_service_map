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
      changeSortOrder,
      highlightedProviders,
      displayProviderInformation
    } = this.props;
    return (
      <div className="service-providers">
        {!providersList.length && (
          <>
            <h4>NO MATCHING RESULTS</h4>
            <p>
              Use the filters in the top bar to adjust the number of results
            </p>
          </>
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
