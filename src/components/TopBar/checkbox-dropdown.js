import React from "react";
import Expandable from "./expandable";

export default class CheckBoxDropdown extends React.Component {
  optionsMappings = {};

  constructor(props) {
    super(props);
    const { options = [] } = props;
    options.forEach(option => (this.optionsMappings[option] = false));
  }

  render() {
    const {
      className,
      options,
      header,
      expanded,
      //visibleTypes
      onChange = () => {}
    } = this.props;
    const inputDiv = options.map((option, index) => {
      // content={options.map(({ label, value }, index) => (
      // const isChecked = visibleTypes.indexOf(value) > -1 ;
      return (
        <div className="dropdown-input-wrapper" key={index}>
          <input
            id={option}
            // checked={ visibleTypes.indexOf(value) > -1 }
            type="checkbox"
            value={option}
            onChange={({ target: { checked } }) => {
              this.optionsMappings[option] = checked;
              onChange(
                option,
                options.filter(option => this.optionsMappings[option])
              );
            }}
          />
          <label className="expandable-label" htmlFor={option}>
            {option.toString()}
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
      />
    );
  }
}
