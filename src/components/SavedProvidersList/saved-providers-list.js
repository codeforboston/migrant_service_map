import React from "react";
import { MenuDropdownItem } from "..";
import { printJSX } from "../../util/printJSX";
import "./saved-providers-list.css";

function printableSavedProvider(provider) {
  const {
    id,
    address,
    email,
    mission,
    name,
    telephone,
    category,
    "Type of Service": type,
    website
  } = provider;
  return (
    <div className="printedProvider" key={id}>
      <div className="name">{name}</div>
      <div className="address">{address}</div>
      <div className="email">{email}</div>
      <div className="telephone">{telephone}</div>
      <div className="website">{website}</div>
      <div className="type">{type}</div>
      <div className="category">{category}</div>
      <div className="mission">{mission}</div>
    </div>
  );
}

const SavedProvidersList = ({ savedProviders, saveProvider, searchCenter }) => (
// const SavedProvidersList = ({ savedProviders, saveProvider }) => (
  <div className="saved-list">
    <h3>Saved Providers</h3>
    <input
      type="button"
      value="Print"
      onClick={() => printJSX(savedProviders.map(printableSavedProvider))}
    />
    <div className="search-center">Proximity to {searchCenter}</div>
    
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
