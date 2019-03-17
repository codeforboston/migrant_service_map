import React from "react";
import { connect } from "react-redux";
import { initializeProviders } from "../../redux/actions";
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
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapContainer);
