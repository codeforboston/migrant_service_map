import React from "react";
import { MenuDropdownItem } from "..";
import "./saved-providers-list.css";

const SavedProvidersList = ({ highlightedProviders, savedProviders, unsaveProvider }) => (
  <div className="saved-list">
    <h3>Saved Providers</h3>
    {savedProviders.map(provider => (
      <MenuDropdownItem key={provider.id} text={provider.name} item={provider}
        expanded={highlightedProviders.includes(provider.id)}>
        <RemoveButton
          className="remove-button"
          color="#FB3322"
          handleClick={() => unsaveProvider(provider.id)}
        />
      </MenuDropdownItem>
    ))}
  </div>
);

const RemoveButton = ({ className, color, handleClick }) => (
  <div className={className} onClick={handleClick}>
    <svg height="16px" width="16px">
      <path d="M1,1 L15,15" stroke={color} strokeWidth="4px" />
      <path d="M1,15 L15,1" stroke={color} strokeWidth="4px" />
    </svg>
    remove&nbsp;
  </div>
);

export default SavedProvidersList;
