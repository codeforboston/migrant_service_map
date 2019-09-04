import React from "react";
import "./expandable.css";

export default function Expandable({
  className,
  content,
  footer,
  header,
  expanded = false,
  setExpanded,
  onSelect = () => {}
}) {
  return (
    <div
      className="expandable-container"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div
        className={`expandable-content-wrapper ${className} ${
          expanded ? "expanded" : ""
        }`}
      >
        <div
          onClick={() => setExpanded(!expanded)}
          className="expandable-header"
        >
          {header}
        </div>
        <div
          onClick={onSelect}
          className={`expanded-content ${expanded ? "expanded" : ""}`}
        >
          {content}
        </div>
        <div className={`expanded-content ${expanded ? "expanded" : ""}`}>
          {footer}
        </div>
      </div>
    </div>
  );
}
