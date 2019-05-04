import React, { Component } from "react";
import { MenuDropdown, MenuDropdownItem } from "..";
import SortDropdown from "../SortDropdown"

import "./provider-list.css";

class ProviderList extends Component {
  render() {
    const {
      providersList,
      savedProviders,
      saveProvider,
      highlightedProviders,
      displayProviderInformation
    } = this.props;
    return (
      <div className="service-providers">
        {!providersList.length && <h3>LOADING ...</h3>}
        {!!providersList.length && (
          <>
            <SortDropdown
              className="something"
              options={["Distance", "Name", "Provider Type"]}
              header="Sort order"
              handleChange={(id) =>
                console.log('id',id)
              }
              group="sort"
            />
            {providersList.map(providerType => (
              <ul key={providerType.id}>
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
