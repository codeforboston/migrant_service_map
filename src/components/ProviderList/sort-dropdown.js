import React from "react";
import ReactTooltip from "react-tooltip";
import Expandable from "../Dropdowns/expandable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortNumericDown,
  faSortNumericUp,
  faSortAlphaUp,
  faSortAlphaDown
} from "@fortawesome/free-solid-svg-icons";
import { faCompass } from "@fortawesome/free-regular-svg-icons";
import "./sort-dropdown.css";

export default class SortDropdown extends React.Component {
  getSortIcon = (sortDirection, incomingState) => {
    if (incomingState === "Distance") {
      if (sortDirection === "asc") {
        return faSortNumericUp;
      }
      return faSortNumericDown;
    } else {
      if (sortDirection === "asc") {
        return faSortAlphaUp;
      }
      return faSortAlphaDown;
    }
  };

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  render() {
    const {
      className,
      handleChange,
      changeDirection,
      header,
      incomingState,
      options,
      sortDirection,
      zoomToFit
    } = this.props;

    let inputDiv = options.map((option, index) => (
      <div
        className={`radio-container ${
          option === incomingState ? "selected" : null
        }`}
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
    ));
    let wrappedHeader = (
      <h4>
        {header}: {incomingState}
      </h4>
    );

    return (
      <div className="sort-container">
        <Expandable
          className={className}
          header={wrappedHeader}
          content={inputDiv}
          closeOnSelect={true}
        />
        <FontAwesomeIcon
          size="2x"
          icon={this.getSortIcon(sortDirection, incomingState)}
          onClick={() => changeDirection()}
          className="sort-container-icon"
          data-tip="Change sort direction"
        />
        <FontAwesomeIcon
          size="2x"
          icon={faCompass}
          onClick={zoomToFit}
          className="sort-container-icon"
          data-tip="Zoom to fit"
        />
      </div>
    );
  }
}
