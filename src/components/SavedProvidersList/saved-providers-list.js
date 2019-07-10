import React from "react";
import { MenuDropdownItem } from "..";
import { printJSX } from "util/printJSX";
import "./saved-providers-list.css";
import { Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";

function toProviderDiv(provider) {
  const {
    id,
    address,
    email,
    mission,
    name,
    telephone,
    "Type of Service": type,
    website
  } = provider;
  return (
    <div className={"provider"} key={id}>
      <div className={"name"}>{name}</div>
      <div className={"type"}>{type}</div>
      <div className={"details"}>
        <div className={"address"}>{address}</div>
        <div className={"email"}>{email}</div>
        <div className={"telephone"}>{telephone}</div>
        <div className={"website"} >
          <a href={website}>{website}</a>
        </div>
        <div className={"mission"}>{mission}</div>
      </div>
    </div>
  );
}

function printSavedProviders(providers) {
  const byTypeName = _.groupBy(providers, provider => provider.typeName);
  const printPage = (
    <div className={"print"}>
      {_.map(byTypeName, (providers, typeName) => {
        return (
          <div className={"category"} key={typeName}>
            <div className={"header"}>{typeName}</div>
            {_.map(providers, toProviderDiv)}
          </div>
        );
      })}
    </div>
  );
  printJSX(printPage);
}

const SavedProvidersList = ({
  savedProviders,
  saveProvider,
  searchCenter,
  highlightedProviders,
  displayProviderInformation
}) => {
  const getItemStyle = (isDragging, draggableStyle) => ({
    // some style overrides so that draggable items don't inherit unwanted styling
    ...draggableStyle,
    userSelect: "none",
    padding: "0 !important",
    margin: "0 !important",
    top: "0 !important",
    left: "0 !important"
  });

  return (
    <div className="saved-list">
      <header>
        <h3>Saved Providers</h3>
        <input
          type="button"
          value="Print"
          onClick={() => printSavedProviders(savedProviders)}
        />
      </header>
      <div className="search-center">Showing proximity to {searchCenter}</div>

      <Droppable
        droppableId="saved-items"
        direction="vertical"
        key="saved-items-drop-area"
      >
        {provided => {
          return (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {savedProviders.map((provider, index) => (
                <Draggable
                  draggableId={provider.id}
                  key={provider.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <MenuDropdownItem
                        key={provider.id}
                        provider={provider}
                        providerTypeName={provider["Type of Service"]}
                        isSaved="saved"
                        toggleSavedStatus={() => saveProvider(provider.id)}
                        isHighlighted={highlightedProviders.includes(
                          provider.id
                        )}
                        toggleHighlight={() =>
                          displayProviderInformation(provider.id)
                        }
                        inSavedMenu={true}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
};

export default SavedProvidersList;
