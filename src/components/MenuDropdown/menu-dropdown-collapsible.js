import React from "react";
import { Row } from "simple-flexbox";
import "./menu-dropdown.css";

let triangle = <svg height="16px" width="16px" xmlns="http://www.w3.org/2000/svg"><polygon fill="#8c45cf" points="0 0, 16 0, 8 14"/></svg>

class CollapsibleMenuDropdown extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { text, children, collapsed, handleToggle } = this.props;
    let domClasses=`dropdown-menu ${collapsed ? 'closed' : 'open'}`
    return (
      <>
        <Row
          className={domClasses}
          onClick={handleToggle}
        >
          <div>{text}</div>
          {triangle}
        </Row>
        {!collapsed && children}
      </>
    );
  }
}

export default CollapsibleMenuDropdown;
