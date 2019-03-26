import React from "react";
import { connect } from "react-redux";
import {
  toggleProviderVisibility,
  saveProvider,
  unsaveProvider,
  clearDistanceFilter,
  changeDistanceFilter
} from "../../redux/actions";
import { getProvidersSorted } from "../../redux/selectors.js";
import Menu from "./menu";

const MenuContainer = props => {
  return <Menu {...props} />;
};

const mapStateToProps = state => {
  return {
    providersList: getProvidersSorted(state),
    highlightedProviders: state.highlightedProviders,
    savedProviders: state.providers.savedProviders,
    visibleTypes: state.providerTypes.visible,
    filters: state.filters
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleProviderVisibility: providerType => {
      dispatch(toggleProviderVisibility(providerType));
    },
    saveProvider: id => {
      dispatch(saveProvider(id));
    },
    unsaveProvider: id => {
      dispatch(unsaveProvider(id));
    },
    clearDistanceFilter: () => {
      dispatch(clearDistanceFilter());
    },
    changeDistanceFilter: distance => {
      dispatch(changeDistanceFilter(distance));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuContainer);
