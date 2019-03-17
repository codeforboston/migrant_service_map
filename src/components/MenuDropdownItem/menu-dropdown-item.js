import React from "react";
import { DetailsPane } from "..";

export default class DropdownMenuItem extends React.Component {
  state = { expanded: false };

  onItemClick = () => {
    this.setState({ expanded: !this.state.expanded });
    // setPopUp(item.properties);
  };

  render() {
    let { text, item, children } = this.props;

    return (
      <div className="list-item">
        <a href="#target" onClick={this.onItemClick}>
          {text}
        </a>
        {this.state.expanded ? (
          <>
            <DetailsPane provider={item} />
            {children}
          </>
        ) : null}
      </div>
    );
  }
}
