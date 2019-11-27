import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
 faQuestionCircle, faAlignCenter
} from "@fortawesome/free-solid-svg-icons";
import { Z_BLOCK } from 'zlib';
import "./top-bar.css";

const topBarItemClass = "top-bar-item";


class HelpIcon extends React.Component {
    render() {
      const { className, onSearchInputClick, questionMark } = this.props;
      return (
       
          <div
          className={className}
            id="nav-help"
            onClick={onSearchInputClick}>
             <FontAwesomeIcon
                  id={questionMark}
                  icon={faQuestionCircle}
                  color={"Purple"}
                />
          <h2 style={faAlignCenter} id={HelpIcon}>HELP</h2>
          </div>
    
      );
    }
  } 
export default HelpIcon;