import React from "react";
import { connect } from "react-redux";
import Geocoder from "./geocoder";
import { setSearchResult, clearSearchResult } from "redux/actions";

const GeocoderContainer = props => {
  return <Geocoder {...props} />;
};

const mapStateToProps = state => {
  return {
    searchProximityCoordinates: state.search.coordinates,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setSearchResult: (searchCoordinates, mapboxId, searchText) => {
      dispatch(setSearchResult(searchCoordinates, mapboxId, searchText));
    },
    clearSearchResult: () => {
      dispatch(clearSearchResult());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GeocoderContainer);
