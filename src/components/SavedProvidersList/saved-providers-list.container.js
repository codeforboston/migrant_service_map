import React from "react";
import { connect } from "react-redux";
import { saveProvider } from "../../redux/actions";
import { getSavedProviders } from "../../redux/selectors.js";
import SavedProvidersList from "./saved-providers-list";

const SavedProvidersListContainer = props => {
  return <SavedProvidersList {...props} />;
};

const mapStateToProps = state => {
  return {
    savedProviders: getSavedProviders(state)
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
