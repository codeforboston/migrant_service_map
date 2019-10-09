import React from 'react'
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
      <div className={"type"} style={{fontStyle: 'italic'}}>{type}</div>
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
  const printPage = (
    <div className={"print"}>
      <div className={"category"}>
        {_.map(providers, toProviderDiv)}
      </div>
    </div>
  );
  printJSX(printPage);
}

function emailSavedProviders(providers) {
  const email = Array.map(providers, (provider) => {
    const {name, address, website, telephone, email} = provider;
    return [
      name, 
      `Address: ${address}`, 
      `Website: ${website}`,
      `Phone: ${telephone}`,
      `Email: ${email}`,
    ].join("\n")
    }).join("\n\n")

  const uriEncodedBody = encodeURIComponent(email)

  let myWindow;

  function openWin() {
    myWindow = window.open("mailto:?&body="+uriEncodedBody);
    setTimeout(closeWin, 3000)
  }

  // closeWin shuts new tab after 3 seconds if email is
  // opened in email application e.g. Outlook, Mail, and keeps new tab open if
  // redirected to browser email application e.g. Gmail

  function closeWin() {
    try {
      // Without try block, "if (myWindow.location)" would cause
      // cross site error after redirect
      if (myWindow.location.href) {
        myWindow.close()
      }
    }
    catch {
      return
    }
  }

  openWin()
}

const SavedProvidersList = ({
  savedProviders,
  saveProvider,
  searchCenter,
  highlightedProviders,
  displayProviderInformation,
  flyToProvider
}) => {
  return (
    <div className="saved-list">
      <div className="header-container">
        <header>
          <h3>Saved Providers</h3>
          <div>
            <button
              className="print-email-btn"
              onClick={() => printSavedProviders(savedProviders)}
            >Print</button>
            <button
              className="print-email-btn"
              onClick={() => emailSavedProviders(savedProviders)}
              target="_newtab"
            >Email</button>
          </div>
        </header>
        <div className="search-center">Showing proximity to {searchCenter}</div>
      </div>

      <Droppable
        droppableId="saved-items"
        direction="vertical"
        key="saved-items-drop-area"
      >
        {provided => {
          return (
            <div 
            className="saved-content-container"            
            ref={provided.innerRef} {...provided.droppableProps}>
              {savedProviders.map((provider, index) => (
                <Draggable
                  draggableId={provider.id}
                  key={provider.id}
                  index={index}
                >
                  {(provided, snapshot) => {
                    const {isDragging} = snapshot
                    return (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="saved-draggable"
                      onClick={() => displayProviderInformation(provider.id)}
                    >
                      <MenuDropdownItem
                        key={provider.id}
                        provider={provider}
                        providerTypeName={provider["Type of Service"]}
                        isSaved="saved"
                        toggleSavedStatus={() => saveProvider(provider.id)}
                        flyToProvider={()=> flyToProvider(provider.id)}
                        isHighlighted={highlightedProviders.includes(
                          provider.id
                        )}
                        inSavedMenu={true}
                        isDragging={isDragging}
                      />
                    </div>
                  )}}
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
