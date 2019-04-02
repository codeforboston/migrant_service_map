import React from "react";
import { connect } from "react-redux";
import {
  initializeProviders,
  setSearchCenterCoordinates,
  displayProviderInformation
} from "../../redux/actions";
import { getProvidersSorted } from "../../redux/selectors";
import Map from "./map";

const MapContainer = props => {
  return <Map {...props} />;
};

const mapStateToProps = state => {
  return {
    providersList: getProvidersSorted(state),
    providerTypes: state.providerTypes,
    providers: state.providers,
    highlightedProviders: state.highlightedProviders, 
    filters: state.filters,
    search: state.search
  };
};

const mapDispatchToProps = dispatch => {
  return {
    initializeProviders: providers => {
      dispatch(initializeProviders(providers));
    },
    displayProviderInformation: id => {
      dispatch(displayProviderInformation(id));
    },
    setSearchCenterCoordinates: coordinates => {
      dispatch(setSearchCenterCoordinates(coordinates));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapContainer);
