import React from 'react';
import './provider-detail-list.css';

function ProviderDetailList({ highlightedProviders, byId, displayProviderInformation }) {
  const renderProvider = provider => (
    <div key={provider.name} onClick={e => displayProviderInformation(provider.id)}>
      {provider.name}
    </div>
  );

  return <div id="provider-detail-list">{highlightedProviders.map(id => renderProvider(byId[id]))}</div>;
}

export default ProviderDetailList;
