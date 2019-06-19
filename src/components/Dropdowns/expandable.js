import React from "react";
import "./expandable.css";
import ClickAwayDetector from "components/common/click-away-detector";

export default class Expandable extends React.Component {
  static defaultProps = {
    expanded: false,
    closeOnSelect: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      expanded: props.expanded,
      closeOnSelect: props.closeOnSelect
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.onToggleExpanded && (this.state.expanded !== prevState.expanded)) {
       this.props.onToggleExpanded(this.state.expanded);
    }
  }

  toggleExpanded = () => {
    const { expanded } = this.state;
    this.setState({ expanded: !expanded });
  };

  toggleExpandedOnSelect = () => {
    const { closeOnSelect } = this.state;
    if (closeOnSelect) {
      this.setState({ expanded: false });
    } 
  }

  render() {
    const { expanded } = this.state;
    const { className, content, footer, header, } = this.props;

    return (
      <ClickAwayDetector
        onClickAway={() => this.setState({ expanded: false })}
        className={"expandable-container"}
      >
        <div
          className={`expandable-content-wrapper ${className} ${
            expanded ? "expanded" : ""
          }`}
        >
          <div onClick={this.toggleExpanded} className="expandable-header">
            {header}
          </div>
          <div onClick={this.toggleExpandedOnSelect} className={`expanded-content ${expanded ? "expanded" : ""}`}>
            {content}
          </div>
          <div className={`expanded-content ${expanded ? "expanded" : ""}`}>
            {footer}
          </div>
        </div>
      </ClickAwayDetector>
    );
  }
}
