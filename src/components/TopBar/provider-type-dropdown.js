import React from "react";
import CheckBoxDropdown from "./checkbox-dropdown";

const defaultSubheaderText = "Not Selected";
export default class ProviderTypeDropdown extends React.Component {
  state = { subheaderText: defaultSubheaderText };

  onCheckboxChanged = (changedOption, selectedValues) => {
    const { onChange } = this.props;
    onChange(changedOption);
    if (selectedValues.length === 0) {
      this.setState({ subheaderText: defaultSubheaderText });
    } else if (selectedValues.length === 1) {
      this.setState({ subheaderText: selectedValues[0] });
    } else {
      this.setState({ subheaderText: selectedValues.length + " Selected" });
    }
  };

  render() {
    const { className, providerTypes } = this.props;
    const { subheaderText } = this.state;

    return (
      <CheckBoxDropdown
        className={className}
        options={providerTypes.allIds}
        onChange={this.onCheckboxChanged}
        visibleTypes={providerTypes.visible}
        header={
          <>
            <h2>PROVIDER TYPE</h2>
            <p>{subheaderText}</p>
          </>
        }
      />
    );
  }
}
