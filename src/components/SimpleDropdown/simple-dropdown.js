import React from "react";
import "../Menu/menu.css";

const SimpleDropdown = props => {
  let {
    items,
    heading,
    subHead,
    handleChange,
    incomingState,
    handleClick
  } = props;

  return (
    <div onClick={handleClick}>
      <div className="dropdown-list-header">
        <h2>{heading}</h2>
        <p>{subHead}</p>
      </div>
      <div className="dropdown-list">
        {items.map((item, i) => {
          return (
            <div className="dropdown-list-item" key={i}>
              <input
                type="checkBox"
                onChange={() => handleChange(item)}
                checked={incomingState.includes(item)}
              />
              <label>{item}</label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SimpleDropdown;
