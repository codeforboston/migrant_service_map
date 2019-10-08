import React from "react";
import { connect } from "react-redux";
import {
  initializeProviders,
  initializeVisaFilter,
  setSearchCenterCoordinates,
  displayProviderInformation,
  setMapObject,
  selectTab
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
    initializeProviders: providers => {
      dispatch(initializeProviders(providers));
    },
    initializeVisaFilter: visas => {
      dispatch(initializeVisaFilter(visas));
    },
    displayProviderInformation: id => {
      dispatch(displayProviderInformation(id));
    },
    setMapObject: mapObject => {
      dispatch(setMapObject(mapObject));
    },
    setSearchCenterCoordinates: (coordinates, mapboxId, text) => {
      dispatch(setSearchCenterCoordinates(coordinates, mapboxId, text));
    },
    selectTab: index => {
      dispatch(selectTab(index));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapContainer);
