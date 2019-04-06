import React from "react";
import { MenuDropdownItem } from "..";
import "./saved-providers-list.css";
import { Droppable, Draggable } from "react-beautiful-dnd";

const SavedProvidersList = ({ savedProviders, saveProvider }) => (
  <div className="saved-providers-list-wrapper" style={{ height: "500px" }}>
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
                {provided => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <MenuDropdownItem
                      key={provider.id}
                      provider={provider}
                      providerTypeName={provider["Type of Service"]}
                      isSaved="saved"
                      toggleSavedStatus={() => saveProvider(provider.id)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
          </div>
        );
      }}
    </Droppable>
  </div>
);

export default SavedProvidersList;
