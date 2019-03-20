import React from "react";
import { connect } from "react-redux";
import { displayProviderInformation } from '../../redux/actions';
import ProviderDetailList from "./provider-detail-list";

const ProviderDetailListContainer = props => {
    return <ProviderDetailList {...props} />;
  };
  
  export default connect(
    ({ providers }) => ({ highlightedProviders: providers.highlightedProviders, byId: providers.byId }),
  { displayProviderInformation }
  )(ProviderDetailListContainer);