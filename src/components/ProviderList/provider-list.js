import React, { Component } from "react";
import { MenuDropdown, CollapsibleMenuDropdown, MenuDropdownItem } from "..";
import SortDropdown from "./sort-dropdown.js";

import "./provider-list.css";

class ProviderList extends Component {
  constructor(props) {
    super(props);
    this.listElementRef = React.createRef();
    this.lastHighlightedRef = React.createRef();
    this.state = {
      collapsedProviderTypes: [],
    }
  }

  toggleProviderType = (id) => {
    console.log('toggling provider type', id);
    let collapsed = this.state.collapsedProviderTypes;
    let updated = collapsed.includes(id) ? collapsed.filter(c => c !== id) : [id, ...collapsed];
    this.setState({ collapsedProviderTypes: updated });
  }

  componentDidUpdate(previousProps) {
    let newhlp = this.props.highlightedProviders;
    if (newhlp.length && newhlp[0] !== previousProps.highlightedProviders[0]) {
      // CSS 'scroll-behavior: smooth' animates the scroll when scrollTop is updated;
      // adding a delay avoids edge case of scroll-upward not taking 'open' height into account
      let timeoutID = setTimeout(
        () => this.listElementRef.current.scrollTop = this.lastHighlightedRef.current.offsetTop,
        60
      )
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
      zoomToFit
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
                  <CollapsibleMenuDropdown
                    key={providerType.id}
                    id={providerType.id}
                    text={providerType.name}
                    collapsed={this.state.collapsedProviderTypes.includes(providerType.id)}
                    handleToggle={() => {this.toggleProviderType(providerType.id)}}
                  >
                  <ul className="providers-sublist">
                  {!!providerType.providers.length &&  //if there is not providers MenuDropdown is not shown
                    providerType.providers.map(provider => (
                      <li
                        key={provider.id}
                        ref={ provider.id === highlightedProviders[0] ? this.lastHighlightedRef : null }
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
                          flyToProvider={()=> flyToProvider(provider.id)}
                        />
                      </li>
                    ))
                  }
                  </ul>
                  </CollapsibleMenuDropdown>
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
