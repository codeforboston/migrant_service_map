import React from "react";
import { MenuDropdownItem } from "..";
import "./saved-providers-list.css";

const SavedProvidersList = ({ savedProviders, saveProvider }) => (
  <div className="">
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
