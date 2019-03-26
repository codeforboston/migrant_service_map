import React from "react";
import classNames from "classnames";
import { Row } from "simple-flexbox";
import "./menu-dropdown.css";

export default function MenuDropdown({
  id,
  onToggle,
  text,
  expanded,
  children
}) {
  const onMenuClicked = () => {
    onToggle(id);
  };

  return (
    <>
      <Row
        onClick={onMenuClicked}
        className={classNames(["dropdown-menu", { expanded }])}
      >
        <span style={{ flexGrow: 1 }}>{text}</span>
        <div>{expanded ? "^" : "v"}</div>
      </Row>
      {expanded && children}
    </>
  );
}
