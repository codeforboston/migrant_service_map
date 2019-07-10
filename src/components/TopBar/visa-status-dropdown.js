import React from "react";
import CheckBoxDropdown from "../Dropdowns/checkbox-dropdown";

const defaultSubheaderText = "Current Visa Status";
export default class VisaStatusDropdown extends React.Component {
  state = {
    subheaderText: defaultSubheaderText,
    viewAllOptions: false
  };

  onCheckboxChanged = (option, selectedValues) => {
    const { onChange } = this.props;
    onChange(option);
    if (selectedValues.length === 0) {
      this.setState({ subheaderText: defaultSubheaderText });
    } else if (selectedValues.length === 1) {
      this.setState({ subheaderText: selectedValues[0].display });
    } else {
      this.setState({ subheaderText: selectedValues.length + " Selected" });
    }
  };

  onSeeMore = () => {
    this.setState({
      viewAllOptions: true
    });
  };

  onSeeLess = expanded => {
    if (!expanded) {
      this.setState({
        viewAllOptions: false
      });
    }
  };

  render() {
    const { className, visaTypes } = this.props;
    const { subheaderText, viewAllOptions } = this.state;

    const preferredVisaTypes = viewAllOptions
      ? visaTypes
      : visaTypes.slice(0, 1);
    const footer = <div onClick={this.onSeeMore}>See More</div>;
    return (
      <CheckBoxDropdown
        className={className}
        options={preferredVisaTypes.map(visaType => ({
          id: visaType,
          display: visaType
        }))}
        onChange={this.onCheckboxChanged}
        header={
          <>
            <h2>VISA STATUS</h2>
            <p>{subheaderText}</p>
          </>
        }
        footer={viewAllOptions ? null : footer}
        onToggleExpanded={this.onSeeLess}
        expanded={true}
      />
    );
  }
}
