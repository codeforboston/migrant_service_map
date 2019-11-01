import React, { Component } from 'react';
// import circle_question from '../../assets/icons';

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
          //  logo={circle_question}
            
          />
        </>
        
      );
    }
  } 
 
export default HelpIcon;