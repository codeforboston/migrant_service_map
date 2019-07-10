import React from "react";
import { connect } from "react-redux";
import {
  saveProvider,
  displayProviderInformation,
  changeSortOrder,
  changeSortDirection
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
    incomingState: state.providers.sortMethod,
    sortDirection: state.providers.sortDirection,
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
    displayProviderInformation: id => {
      dispatch(displayProviderInformation(id))
    },
    changeSortOrder: value => {
      dispatch(changeSortOrder(value))
    },
    changeSortDirection: direction => {
      dispatch(changeSortDirection(direction))
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProviderListContainer);
