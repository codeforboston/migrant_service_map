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
      //visibleTypes
      onChange = () => {}
    } = this.props;
    const inputDiv = options.map((value, index) => {
      // content={options.map(({ label, value }, index) => (
      // const isChecked = visibleTypes.indexOf(value) > -1 ;
      return (
        <div className="checkbox-container" key={index}>
          <input
            id={value}
            // checked={ visibleTypes.indexOf(value) > -1 }
            type="checkbox"
            value={value}
            onChange={({ target: { checked } }) => {
              this.optionsMappings[value] = checked;
              onChange(
                options.filter(option => this.optionsMappings[option])
              );
            }}
          />
          <label className="expandable-label" htmlFor={value}>
            {value.toString()}
          </label>
        </div>
      );
    });

    return (
      <Expandable className={className} header={header} content={inputDiv} />
    );
  }
}
