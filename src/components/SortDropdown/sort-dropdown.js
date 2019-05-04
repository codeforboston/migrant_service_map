import React from 'react';
import Expandable from "../TopBar/expandable";

import "./sort-dropdown.css"

const SortDropdown = ({ className, options, group, header, handleChange }) => {
    let inputDiv = options.map((option, index) =>
        <div
            className="checkbox-container"
            key={index}
            >
            <input
                id={option}
                type="radio"
                name={group}
                value={option}
                onClick={() => handleChange(option)}
            />
            <label className="expandable-label" htmlFor={option} >
                {option.toString()}
            </label>
        </div>
    );

    return (
    <Expandable
        className={className}
        header={header}
        content={inputDiv}
    />
    )
}

export default SortDropdown;