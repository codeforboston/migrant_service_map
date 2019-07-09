import React from "react";
import { connect } from "react-redux";
import {
  toggleProviderVisibility,
  saveProvider,
  clearDistanceFilter,
  changeDistanceFilter,
  changeVisaFilter,
  clearVisaFilter,
  displayProviderInformation,
  selectTab
} from "redux/actions";
import { getProvidersSorted } from "redux/selectors";
import TopBar from "./top-bar";

const VISA_TYPES = [
  "Temporary Agricultural Worker H-2A",
  "H-1B",
  "Permanent Resident Card (I-551)",
  "Advance Parole (I-512)",
  "Demo Type 1 (D1)",
  "Demo Type 2 (D2)",
  "Demo Type 3 (D3)",
  "Demo Type 4 (D4)",
  "Demo Type 5 (D5)",
  "Demo Type 6 (D6)"
];

const TopBarContainer = props => {
  return <TopBar {...props} />;
};

const mapStateToProps = state => {
  return {
    providersList: getProvidersSorted(state),
    savedProviders: state.providers.savedProviders,
    visaTypes: VISA_TYPES,
    highlightedProviders: state.highlightedProviders,
    visibleTypes: state.providerTypes.visible,
    filters: state.filters,
    providerTypes: state.providerTypes,
    mapObject: state.mapObject
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
    clearDistanceFilter: () => {
      dispatch(clearDistanceFilter());
    },
    changeDistanceFilter: distance => {
      dispatch(changeDistanceFilter(distance));
    },
    clearVisaFilter: () => {
      dispatch(clearVisaFilter());
    },
    changeVisaFilter: visa => {
      dispatch(changeVisaFilter(visa));
    },
    displayProviderInformation: id => {
      dispatch(displayProviderInformation(id));
    },
    selectTab: index => {
      dispatch(selectTab(index));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopBarContainer);
