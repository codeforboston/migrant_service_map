import React from "react";
import { connect } from "react-redux";
import { displayProviderInformation } from "../../redux/actions";
import ProviderDetailList from "./provider-detail-list";
import { getHighlightedProviders } from "../../redux/selectors";

const ProviderDetailListContainer = props => {
  return <ProviderDetailList {...props} />;
};

export default connect(
  state => ({ highlightedProviders: getHighlightedProviders(state) }),
  { displayProviderInformation }
)(ProviderDetailListContainer);
