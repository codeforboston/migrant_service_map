import React from "react";
import "./provider-detail-list.css";

function ProviderDetailList({
  highlightedProviders,
  displayProviderInformation
}) {
  const renderProvider = provider => {
    debugger;
    return (
      <div
        key={provider.id}
        onClick={e => displayProviderInformation(provider.id)}
      >
        {provider.name}
      </div>
    );
  };

  return (
    <div id="provider-detail-list">
      {highlightedProviders.map(provider => renderProvider(provider))}
    </div>
  );
}

export default ProviderDetailList;
