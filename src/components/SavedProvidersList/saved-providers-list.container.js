import React from "react";
import { connect } from "react-redux";
import { saveProvider } from "redux/actions";
import { getSavedProviders } from "redux/selectors.js";
import SavedProvidersList from "./saved-providers-list";

const SavedProvidersListContainer = props => {
  return <SavedProvidersList {...props} />;
};

const mapStateToProps = state => {
  return {
    searchCenter: state.search.currentLocation ? state.search.history[state.search.currentLocation].searchText : null,
    savedProviders: getSavedProviders(state),
    highlightedProviders: state.highlightedProviders
  };
};

const mapDispatchToProps = dispatch => {
  return {
    saveProvider: id => {
      dispatch(saveProvider(id));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SavedProvidersListContainer);
