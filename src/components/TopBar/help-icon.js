import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
 faQuestionCircle, faAlignCenter
} from "@fortawesome/free-solid-svg-icons";
import "./top-bar.css";


class HelpIcon extends Component {
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
          <h2 style={faAlignCenter} id={HelpIcon}>HELP</h2>
          
          </div>
    
      );
    }
  } 
export default HelpIcon;