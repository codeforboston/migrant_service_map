import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
 faQuestionCircle
} from "@fortawesome/free-solid-svg-icons";

const topBarItemClass = "top-bar-item";


class HelpIcon extends React.Component {
    render() {
      const { className, onSearchInputClick } = this.props;
      return (
       
          <div
          className={className}
            id="nav-help"
            onClick={onSearchInputClick}>
             <FontAwesomeIcon
                  icon={faQuestionCircle}
                  color={"Purple"}
                />
          <h2 style={{  }}>HELP</h2>
          </div>
    
      );
    }
  } 
export default HelpIcon;