import React from "react";
import CheckBoxDropdown from "./checkbox-dropdown";

const defaultVisaStatusValue = "Current Visa Status";
export default class VisaStatusDropdown extends React.Component {
  state = { visaStatusValue: defaultVisaStatusValue };

  onCheckboxChanged = selectedValues => {
    if (selectedValues.length === 0) {
      this.setState({ visaStatusValue: defaultVisaStatusValue });
    } else if (selectedValues.length === 1) {
      this.setState({ visaStatusValue: selectedValues[0] });
    } else {
      this.setState({ visaStatusValue: selectedValues.length + " Selected" });
    }
  };

  render() {
    const { className, onChange = () => {} } = this.props;
    const { visaStatusValue } = this.state;
    return (
      <CheckBoxDropdown
        className={className}
        options={["visa status 1", "visa status 2"]}
        onChange={this.onCheckboxChanged}
        header={
          <>
            <h2>VISA STATUS</h2>
            <p>{visaStatusValue}</p>
          </>
        }
      />
    );
  }
}
