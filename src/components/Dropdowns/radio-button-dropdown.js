import React from "react";
import Expandable from "./expandable";

export default class RadioButtonDropdown extends React.Component {
  render() {
    const {
      className,
      options,
      header,
      selected,
      expanded,
      setExpanded,
      onChange = () => {}
    } = this.props;
    const inputDiv = options.map((option, index) => {
      const { value, text } = option;
      return (
        <div className="dropdown-input-wrapper" key={index}>
          <input
            id={text}
            type="radio"
            name={text}
            value={text}
            onChange={() => onChange(value, text)}
            checked={text === selected}
          />
          <label className="expandable-label" htmlFor={text}>
            {text}
          </label>
        </div>
      );
    });

    return (
      <Expandable
        className={className}
        header={header}
        content={inputDiv}
        expanded={expanded}
        setExpanded={setExpanded}
      />
    );
  }
}
