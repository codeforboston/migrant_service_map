import React, { Component } from "react";
import { setPopUp } from '../PopUp.js'; 

export default class DropdownMenuItem extends Component {
  onItemClick = (item, event) => {
    event.preventDefault(); // Keeps the browser from reloading
    // setPopUp(item.properties);   
  };
  
  render() {
    let { text, item, clickHandler } = this.props;
    
    return (
      <>
        <a href="#target" 
          className="list-item" 
          onClick={() => clickHandler(item)}>  
          {text}
        </a>  
      </>
    );
  }
}



// {items.map((item, index) => 
//   <a href="#target" 
//       className="list-item" 
//       key={index} 
//       onClick={this.onItemClick}
//   >
//     {item.properties.name}
//   </a>)
// }