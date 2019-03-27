import React from "react";
import { connect } from "react-redux";
import { unsaveProvider } from "../../redux/actions";
import { getSavedProviders } from "../../redux/selectors.js";
import SavedProvidersList from "./saved-providers-list";

const SavedProvidersListContainer = props => {
  return <SavedProvidersList {...props} />;
};

const mapStateToProps = state => {
  return {
    savedProviders: getSavedProviders(state),
    highlightedProviders: state.highlightedProviders
  };
};

const mapDispatchToProps = dispatch => {
  return {
    unsaveProvider: id => {
      dispatch(unsaveProvider(id));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SavedProvidersListContainer);
