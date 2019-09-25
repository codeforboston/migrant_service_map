import React from 'react'
import { MenuDropdownItem } from "..";
import { printJSX } from "util/printJSX";
import "./saved-providers-list.css";
import { Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactTooltip from "react-tooltip";
import {
  faPrint,
  faEnvelope
} from "@fortawesome/free-solid-svg-icons";

export default class SavedProvidersList extends React.Component {
  state = {}

  toProviderDiv = provider => {
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

  printSavedProviders = providers => {
    const byTypeName = _.groupBy(providers, provider => provider.typeName);
    const printPage = (
      <div className={"print"}>
        {_.map(byTypeName, (providers, typeName) => {
          return (
            <div className={"category"} key={typeName}>
              <div className={"header"}>{typeName}</div>
              {_.map(providers, this.toProviderDiv)}
            </div>
          );
        })}
      </div>
    );
    printJSX(printPage);
  }

  emailSavedProviders = providers => {
    const byTypeName = _.groupBy(providers, provider => provider.typeName);
    let emailBodyString = ''
    const newLine = "\n"
    _.forEach(byTypeName, (providers, typeName) => {
      let providerString = ''
      providerString += (typeName + ':' + newLine)
      providers.forEach((provider) => {
        providerString = providerString += (
          newLine + provider.name + newLine +
          "Address: " + provider.address + newLine +
          "Website: " + provider.website + newLine +
          "Phone: " + provider.telephone + newLine +
          "Email: " + provider.email + newLine)
        })
      emailBodyString += (providerString + newLine)
    })
    const uriEncodedBody = encodeURIComponent(emailBodyString)

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

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  render() {
    const {
      savedProviders,
      saveProvider,
      searchCenter,
      highlightedProviders,
      displayProviderInformation,
      flyToProvider
    } = this.props
      return (
        <div className="saved-list">
          <div className="header-container">
            <header>
              <h3>SAVED PROVIDERS</h3>
              <div>
                <FontAwesomeIcon
                  size="2x"
                  icon={faPrint}
                  onClick={() => this.printSavedProviders(savedProviders)}
                  className="print-icon"
                  data-tip="Print"
                />
                <FontAwesomeIcon
                  size="2x"
                  icon={faEnvelope}
                  onClick={() => this.emailSavedProviders(savedProviders)}
                  className="email-icon"
                  data-tip="Email"
                />
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
                      {provided => (
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
  }
