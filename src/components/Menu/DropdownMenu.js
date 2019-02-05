import React from "react";
import classNames from 'classnames';
import { Row } from "simple-flexbox";

export default function DropdownMenu({ id, onToggle, text, expanded, children }) {
  const onMenuClicked = (event)  => {
    event.preventDefault(); // Keep the browser from reloading
    onToggle(id);
  };

  return (
    <>
      <Row onClick={onMenuClicked} className={classNames(["dropdown-menu", { expanded }])}>
        <span style={{ flexGrow: 1 }}>{text}</span>
        <div>{expanded ? "^" : "v"}</div>
      </Row>
      {expanded && children}
    </>
  );
}
