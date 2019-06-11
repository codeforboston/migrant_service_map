import React from "react";
import CheckBoxDropdown from "../Dropdowns/checkbox-dropdown";

const defaultSubheaderText = "Not Selected";
export default class ProviderTypeDropdown extends React.Component {
  state = { subheaderText: defaultSubheaderText };

  onCheckboxChanged = (changedOption, selectedValues) => {
    const { onChange, providerTypes } = this.props;
    onChange(changedOption);
    if (selectedValues.length === 0) {
      this.setState({ subheaderText: defaultSubheaderText });
    } else if (selectedValues.length === 1) {
      const selectedProviderType =
        providerTypes.byId[selectedValues[0].id].name;
      this.setState({ subheaderText: selectedProviderType });
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
        options={providerTypes.allIds.map(id => ({
          id,
          display: providerTypes.byId[id].name
        }))}
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
