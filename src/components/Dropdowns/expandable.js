import React from "react";
import "./expandable.css";

export default class Expandable extends React.Component {
  static defaultProps = {
    expanded: false
  };

  constructor(props) {
    super(props);
    this.state = {
      expanded: props.expanded
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.onToggleExpanded &&
      this.state.expanded !== prevState.expanded
    ) {
      this.props.onToggleExpanded(this.state.expanded);
    }
  }

  toggleExpanded = () => {
    this.setState(state => ({expanded: !state.expanded}));
  };

  closeOnSelect = () => {
    if (this.props.closeOnSelect) {
      this.setState({ expanded: false });
    }
  };

  render() {
    const { expanded } = this.state;
    const { className, content, footer, header } = this.props;

    return (
      <div
        className="expandable-container"
        onMouseEnter={() => this.setState({ expanded: true })}
        onMouseLeave={() => this.setState({ expanded: false })}
      >
        <div
          className={`expandable-content-wrapper ${className} ${
            expanded ? "expanded" : ""
          }`}
        >
          <div onClick={this.toggleExpanded} className="expandable-header">
            {header}
          </div>
          <div
            onClick={this.closeOnSelect}
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
}
