import React from "react";
import { connect } from "react-redux";
import {
  initializeVisaFilter,
  displayProviderInformation,
  selectProvider
} from "redux/actions";
import { getMapProviders } from "redux/selectors";
import Map from "./map";

const MapContainer = props => {
  return <Map {...props} />;
};

const mapStateToProps = state => {
  return {
    visibleProviders: getMapProviders(state),
    loadedProviderTypeIds: state.providerTypes.allIds,
    highlightedProviders: state.highlightedProviders,
    filters: state.filters,
    search: state.search,
    selectProviderId: state.selectProviderId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    initializeVisaFilter: visas => {
      dispatch(initializeVisaFilter(visas));
    },
    displayProviderInformation: id => {
      dispatch(displayProviderInformation(id));
    },
    selectProvider: id => {
      dispatch(selectProvider(id))
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapContainer);
