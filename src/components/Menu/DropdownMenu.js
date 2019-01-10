import React from "react";
import { Row } from "simple-flexbox";

export default function DropdownMenu({ id, onToggle, text, expanded, children }) {
  const onMenuClicked = (event)  => {
    event.preventDefault(); // Keep the browser from reloading
    onToggle(id);
  };

  return (
    <>
      <a href="#target" onClick={onMenuClicked}>
        <Row>
          <span style={{ flexGrow: 1 }}>{text}</span>
          <div>{expanded ? "v" : ">"}</div>
        </Row>
      </a>
      {expanded && children}
    </>
  );
}
