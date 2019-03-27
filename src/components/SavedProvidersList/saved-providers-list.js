import React from "react";
import { MenuDropdownItem } from "..";
import "./saved-providers-list.css";

const SavedProvidersList = ({ savedProviders, saveProvider }) => (
  <div className="saved-list">
    <h3>Saved Providers</h3>
    {savedProviders.map(provider => (
      <MenuDropdownItem
        key={provider.id}
        provider={provider}
        providerTypeName={provider["Type of Service"]}
        isSaved="saved"
        toggleSavedStatus={() => saveProvider(provider.id)}
      />
    ))}
  </div>
);

export default SavedProvidersList;
