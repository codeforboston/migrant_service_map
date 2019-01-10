import React from "react";
// import { setPopUp } from '../PopUp.js';

export default function DropdownMenuItem({ text, item, clickHandler }) {
  const onItemClick = (event) => {
    event.preventDefault(); // Keeps the browser from reloading
    // setPopUp(item.properties);
  };

  return (
    <a href="#target" className="list-item" onClick={onItemClick}>
      {text}
    </a>
  );
}
