import React from "react";
import { Row } from "simple-flexbox";
import "./menu-dropdown.css";

let triangle = <svg height="16px" width="16px" xmlns="http://www.w3.org/2000/svg"><polygon fill="#8c45cf" points="0 0, 16 0, 8 14"/></svg>

export default function MenuDropdown({
  text,
  children,
  collapsed,
  collapsible,
  handleToggle
}) {
  return (
    <>
      <Row
        className={`dropdown-menu ${(collapsible && collapsed) ? 'closed' : 'open'}`}
        onClick={collapsible ? handleToggle : null}
      >
        <div>{text}</div>
        {collapsible && triangle}
      </Row>
      {(!collapsible || !collapsed) && children}
    </>
  );
}
