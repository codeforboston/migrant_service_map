import React from "react";
import CheckBoxDropdown from "../Dropdowns/checkbox-dropdown";

const defaultSubheaderText = "Current Visa Status";
export default class VisaStatusDropdown extends React.Component {
  state = { subheaderText: defaultSubheaderText };

  onCheckboxChanged = (option, selectedValues) => {
    const { onChange } = this.props;
    onChange(option);
    if (selectedValues.length === 0) {
      this.setState({ subheaderText: defaultSubheaderText });
    } else if (selectedValues.length === 1) {
      this.setState({ subheaderText: selectedValues[0] });
    } else {
      this.setState({ subheaderText: selectedValues.length + " Selected" });
    }
  };

  render() {
    const { className, visaTypes } = this.props;
    const { subheaderText } = this.state;
    return (
      <CheckBoxDropdown
        className={className}
        options={visaTypes}
        onChange={this.onCheckboxChanged}
        header={
          <>
            <h2>VISA STATUS</h2>
            <p>{subheaderText}</p>
          </>
        }
        expanded={true}
      />
    );
  }
}
