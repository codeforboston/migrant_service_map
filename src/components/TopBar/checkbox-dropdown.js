import React from "react";
import Expandable from "./expandable";

export default class CheckBoxDropdown extends React.Component {
  render() {
    const { className, options, header, onChange = () => {} } = this.props;
    return (
      <Expandable
        className={className}
        header={header}
        content={options.map(({ label, value }, index) => (
          <React.Fragment key={index}>
            <input
              checked={false}
              type="checkbox"
              value={value}
              onChange={() => onChange(value)}
            />
          </React.Fragment>
        ))}
      />
    );
  }
}
