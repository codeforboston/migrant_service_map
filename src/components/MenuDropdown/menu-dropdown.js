import React from "react";
import { Row } from "simple-flexbox";
import "./menu-dropdown.css";

export default function MenuDropdown({ text, children }) {
  return (
    <>
      <Row className="dropdown-menu">
        <span style={{ flexGrow: 1 }}>{text}</span>
      </Row>
      {children}
    </>
  );
}
