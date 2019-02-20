import React from "react";
// import { setPopUp } from '../PopUp.js';

export default function DropdownMenuItem({ text, item, clickHandler }) {
  const onItemClick = (event) => {
    event.preventDefault(); // Keeps the browser from reloading
    // setPopUp(item.properties);
  };

  return (
    <div className="list-item">
      <a href="#target" onClick={onItemClick}>
        {text}
      </a>
    </div>
  );
}
