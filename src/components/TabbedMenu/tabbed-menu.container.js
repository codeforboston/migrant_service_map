import React from "react";
import { connect } from "react-redux";
import { selectTab } from "../../redux/actions";
import TabbedMenu from './tabbed-menu';

const TabbedMenuContainer = props => {
  return <TabbedMenu {...props} />;
};

const mapStateToProps = state => {
  return {
    selectedTabIndex: state.search.selectedTabIndex
  };
};

const dispatchToProps = dispatch => {
  return {
    selectTab: index => {
      dispatch(selectTab(index));
    }
  }
};

export default connect(
  mapStateToProps,
  dispatchToProps
)(TabbedMenuContainer);
