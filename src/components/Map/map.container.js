import React from "react";
import { connect } from "react-redux";
import {
  initializeVisaFilter,
  displayProviderInformation,
  setMapObject,
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
    search: state.search
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
    setMapObject: mapObject => {
      dispatch(setMapObject(mapObject));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapContainer);
