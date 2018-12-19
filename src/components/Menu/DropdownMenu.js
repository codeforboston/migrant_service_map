import React from "react";
import { Row } from "simple-flexbox";

export default class DropdownMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };
  }

  onMenuClicked = event => {
    event.preventDefault(); // Keep the browser from reloading
    let { expanded } = this.state;
    expanded = !expanded;
    this.setState({ expanded });
  };

  render() {
    const { text } = this.props;
    const { expanded } = this.state;

    return (
      <>
        <a href="#" className="DropdownMenu" onClick={this.onMenuClicked}>
          <Row>
            <span style={{ flexGrow: 1 }}>{text}</span>
            <div>{expanded ? "v" : ">"}</div>
          </Row>
        </a>
        {expanded && this.props.children}
      </>
    );
  }
}
