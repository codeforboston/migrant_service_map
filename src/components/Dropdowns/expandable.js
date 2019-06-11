import React from "react";
import "./expandable.css";
import ClickAwayDetector from "components/common/click-away-detector";

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
    if (this.state.expanded !== prevState.expanded) {
      this.props.onToggleExpanded(this.state.expanded);
    }
  }

  toggleExpanded = () => {
    const { expanded } = this.state;
    this.setState({ expanded: !expanded });
  };

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
          <div className={`expanded-content ${expanded ? "expanded" : ""}`}>
            {content}
          </div>
          <div className={`expandable-footer`}>
            {footer}
          </div>
        </div>
      </ClickAwayDetector>
    );
  }
}
