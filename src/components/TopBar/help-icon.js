import React, { Component } from 'react';
const topBarItemClass = "top-bar-item";
class HelpIcon extends React.Component {
    render() {
      const { className, onSearchInputClick } = this.props;
      return (
       <>
          <div
          className={className}
            id="nav-help"
            onClick={onSearchInputClick}
            
          />
          <span>
          <h2>Help</h2>
              </span>
        </>
      );
    }
  } 
export default HelpIcon;