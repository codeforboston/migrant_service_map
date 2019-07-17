import React from 'react';
import Expandable from "../Dropdowns/expandable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortNumericDown,
  faSortNumericUp,
} from "@fortawesome/free-solid-svg-icons";

import "./sort-dropdown.css";

const getSortIcon = (sortDirection) => {
  if (sortDirection === 'asc') {
    return faSortNumericUp;
  }
  return faSortNumericDown;
};

const SortDropdown = ({
  className,
  handleChange,
  changeDirection,
  header,
  incomingState,
  options,
  sortDirection,
}) => {
  let inputDiv = options.map((option, index) =>
    <div
      className={`radio-container ${option === incomingState ? "selected" : null}`}
      key={index}
      onClick={() => handleChange(option)}
    >
      <input
        id={option}
        type="radio"
        name={option}
        value={option}
        checked={option === incomingState}
        onChange={() => {}}
      />
      <label className="expandable-label" htmlFor={option}>
        {option.toString()}
      </label>
    </div>
    );
    let wrappedHeader = <h4>{header}</h4>;

    return (
    <div className="sort-container">
      <Expandable
        className={className}
        header={wrappedHeader}
        content={inputDiv}
        closeOnSelect={true}
      />
      <FontAwesomeIcon size="3x" icon={getSortIcon(sortDirection)}
        onClick={() => changeDirection()} style={{cursor: 'pointer'}}/>
    </div>
    )
};

export default SortDropdown;
