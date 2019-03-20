import React from "react";
import { connect } from "react-redux";
import { initializeProviders, displayProviderInformation } from "../../redux/actions";
import Map from "./map";

const MapContainer = props => {
  return <Map {...props} />;
};

const mapStateToProps = state => {
  return {
    providerTypes: state.providerTypes,
    providers: state.providers,
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
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapContainer);
