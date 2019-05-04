import React from "react";
import { connect } from "react-redux";
import {
  saveProvider,
  changeSortOrder
} from "redux/actions";
import { getProvidersSorted } from "redux/selectors.js";
import ProviderList from "./provider-list";

const VISA_TYPES = ["visa1", "visa2", "visa3"];

const ProviderListContainer = props => {
  return <ProviderList {...props} />;
};

const mapStateToProps = state => {
  return {
    providersList: getProvidersSorted(state),
    savedProviders: state.providers.savedProviders,
    visaTypes: VISA_TYPES,
    highlightedProviders: state.highlightedProviders,
    filters: state.filters,
    providerTypes: state.providerTypes.allIds
  };
};

const mapDispatchToProps = dispatch => {
  return {
    saveProvider: id => {
      dispatch(saveProvider(id));
    },
    changeSortOrder: value => {
      dispatch(changeSortOrder(value))
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProviderListContainer);
