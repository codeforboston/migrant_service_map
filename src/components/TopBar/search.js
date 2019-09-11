import React from "react";
import "./search.css";

export default class Search extends React.Component {
  render() {
    const { className, onSearchInputClick } = this.props;
    return (
      <>
        <div
          className={className}
          id="nav-search"
          onClick={onSearchInputClick}
        />
      </>
    );
  }
}
