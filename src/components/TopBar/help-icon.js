import React, { Component } from 'react';
// import "./mapbox-gl-geocoder.css";

class HelpIcon extends React.Component {
    render() {
      const { className, onSearchInputClick } = this.props;
      return (
       <>
          <div
            className={className}
            id="nav-help"
            // onClick={onSearchInputClick}
          
          />
        </>
      );
    }
  }
 
export default HelpIcon;