import React from 'react';
import { connect } from 'react-redux';

import { displayProviderInformation } from '../actions';

import './provider-detail-list.css';

function ProviderDetailList({ highlightedProviders, displayProviderInformation }) {
  const renderProvider = provider => (
    <div key={provider.name} onClick={e => displayProviderInformation(provider)}>
      {provider.name}
    </div>
  );

  return <div id="provider-detail-list">{highlightedProviders.map(renderProvider)}</div>;
}

export default connect(
  ({ highlightedProviders }) => ({ highlightedProviders }),
  { displayProviderInformation }
)(ProviderDetailList);
