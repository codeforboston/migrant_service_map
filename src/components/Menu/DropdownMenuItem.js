import React, { Component } from "react";

export default class DropdownMenuItem extends Component {
  onItemClick = event => {
    event.preventDefault(); // Keeps the browser from reloading
  };

  render() {
    let { text } = this.props;

    return (
      <a href="#" className="list-item" onClick={this.onItemClick}>
        {text}
      </a>
    );
  }
}
