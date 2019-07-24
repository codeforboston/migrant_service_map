import React from 'react';
import Expandable from "../Dropdowns/expandable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortNumericDown,
  faSortNumericUp,
  faSortAlphaUp,
  faSortAlphaDown
} from "@fortawesome/free-solid-svg-icons";

import "./sort-dropdown.css";

const getSortIcon = (sortDirection, incomingState) => {
  if (incomingState === 'Distance') {
    if (sortDirection === 'asc') {
      return faSortNumericUp;
    }
    return faSortNumericDown;
  } else {
    if (sortDirection === 'asc') {
      return faSortAlphaUp;
    }
    return faSortAlphaDown;
  }
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
    let wrappedHeader = <h4>{header}: {incomingState}</h4>;

    return (
    <div className="sort-container">
      <Expandable
        className={className}
        header={wrappedHeader}
        content={inputDiv}
        closeOnSelect={true}
      />
      <FontAwesomeIcon size="3x" icon={getSortIcon(sortDirection, incomingState)}
        onClick={() => changeDirection()} style={{cursor: 'pointer'}}/>
    </div>
    )
};

export default SortDropdown;
