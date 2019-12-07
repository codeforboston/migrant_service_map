import React, { Component } from "react";
import { MenuDropdown, MenuDropdownItem } from "..";
import SortDropdown from "./sort-dropdown.js";

import "./provider-list.css";

class ProviderList extends Component {
  constructor(props) {
    super(props);
    this.listElementRef = React.createRef();
    this.lastHighlightedRef = React.createRef();
    this.state = {
      collapsedProviderTypes: [],
      lastHighlightedViaSidebar: null, // providers not highlighted via map-click do not trigger scroll
    }
  }

  toggleProviderType = (id) => {
    let collapsed = this.state.collapsedProviderTypes;
    let updated = collapsed.includes(id) ? collapsed.filter(c => c !== id) : [id, ...collapsed];
    this.setState({ collapsedProviderTypes: updated });
  }

  // if highlightedProviders has changed,
  // we want to scroll providers list to most recent one
  componentDidUpdate(previousProps) {
    let nowHighlighted = this.props.highlightedProviders;
    let wasHighlightedViaSidebar = (nowHighlighted[0] === this.state.lastHighlightedViaSidebar);
    let wasHighlightedAlready = previousProps.highlightedProviders.includes(nowHighlighted[0]);

    // only scroll if the change in highlightedProviders
    // comes from clicking a map icon to add a new provider
    if (
      nowHighlighted.length
      && !wasHighlightedViaSidebar
      && !wasHighlightedAlready
    ) {

      // expand provider type first if necessary
      let providerType;
      for(providerType of this.props.providersList) {
        let providerTypeProviders = providerType.providers.map(p => p.id);
        let typeIsCollapsed = this.state.collapsedProviderTypes.includes(providerType.id);
        if (typeIsCollapsed && providerTypeProviders.includes(nowHighlighted[0])) { this.toggleProviderType(providerType.id); }
      }

      // add a small delay when updating scrollTop 
      // (avoids 'open' height not being taken into account 
      //  when target item is earlier than visible section of list)
      setTimeout( () => {
        this.listElementRef.current.scrollTop = this.lastHighlightedRef.current.offsetTop - 8;
        // NOTE: setting property "scroll-behavior: smooth" in the CSS
        // lets the browser take care of the animation on scrollTop update
        },
        60
      );

    }
  }


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
      displayProviderInformation,
      flyToProvider,
      zoomToFit,
      selectProvider
    } = this.props;

    let handleProviderClick = (id) => {
      this.setState({ lastHighlightedViaSidebar: id });
      displayProviderInformation(id);
      selectProvider(id);
    };

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
              header={"sorted by "}
              handleChange={id => {
                changeSortOrder(id);
              }}
              changeDirection={() => {
                changeSortDirection(sortDirection === "desc" ? "asc" : "desc");
              }}
              sortDirection={sortDirection}
              group="sort"
              incomingState={incomingState}
              zoomToFit={zoomToFit}
            />
            <ul className="providers-list" ref={this.listElementRef}>
              {providersList.map(providerType => (
                <li key={providerType.id}>
                {!!providerType.providers.length && ( //if there is not providers MenuDropdown is not shown
                  <MenuDropdown
                    key={providerType.id}
                    id={providerType.id}
                    text={providerType.name}
                    collapsed={this.state.collapsedProviderTypes.includes(providerType.id)}
                    collapsible={providersList.length > 1}
                    handleToggle={() => {this.toggleProviderType(providerType.id)}}
                  >
                    <ul className="providers-sublist">
                      {!!providerType.providers.length && //if there is not providers MenuDropdown is not shown
                        providerType.providers.map(provider => (
                          <li
                            key={provider.id}
                            ref={
                              provider.id === highlightedProviders[0]
                                ? this.lastHighlightedRef
                                : null
                            }
                            onClick={() =>
                              handleProviderClick(provider.id)
                            }
                            className="search-item-container"
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
                              toggleSavedStatus={() =>
                                saveProvider(provider.id)
                              }
                              flyToProvider={() => flyToProvider(provider.id)}
                            />
                          </li>
                        ))}
                    </ul>
                  </MenuDropdown>
                )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  }
}

export default ProviderList;
