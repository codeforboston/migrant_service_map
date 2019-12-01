import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
 faQuestionCircle
} from "@fortawesome/free-solid-svg-icons";
import "./top-bar.css";

let helpWindowReference = null;

class HelpIcon extends Component {
    constructor() {
      super();
      this.helpUrl = "/help/help-guide.html";
      this.handleClick = () => {
        if (helpWindowReference == null || helpWindowReference.closed) {
          helpWindowReference= window.open(this.helpUrl);
        } else {
          helpWindowReference.focus();
        }
      }
    }

    render() {
      const { className } = this.props;
      return (
       
          <div
            className={className}
            id="nav-help"
            onClick={this.handleClick}>
             <FontAwesomeIcon
                  icon={faQuestionCircle}
                  color={"Purple"}
                />
          <h2>HELP</h2>
          
          </div>
    
      );
    }
  } 
export default HelpIcon;