import React from "react";
import { connect } from "react-redux";
import {
  setHoveredProvider
} from "redux/actions";
import DropdownMenuItem from "./menu-dropdown-item";

const MenuDropdownItemContainer = props => {
  return <DropdownMenuItem {...props} />;
};

const mapDispatchToProps = dispatch => {
  return {
    setHovered: id => {
      dispatch(setHoveredProvider(id));
    }
  };
};

export default connect(
  null,
  mapDispatchToProps
)(MenuDropdownItemContainer);
