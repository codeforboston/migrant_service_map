import React from "react";
import "./expandable.css";

export default class Expandable extends React.Component {
  state = { expanded: false };

  toggleExpanded = () => {
    const { expanded } = this.state;
    this.setState({ expanded: !expanded });
  };

  render() {
    const { expanded } = this.state;
    const { className, content, header } = this.props;

    return (
      <div className={`expandable-container`}>
        <div
          className={`expandable-content-wrapper ${className} ${
            expanded ? "expanded" : ""
          }`}
        >
          <div onClick={this.toggleExpanded} className="expandable-header">{header}</div>
          <div className={`expanded-content ${expanded ? "expanded" : ""}`}>
            {content}
          </div>
        </div>
      </div>
    );
  }
}
