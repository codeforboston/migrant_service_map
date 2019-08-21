import React from "react";
import CheckBoxDropdown from "../Dropdowns/checkbox-dropdown";
import { Row } from "simple-flexbox";

const defaultSubheaderText = "Not Selected";
export default class ProviderTypeDropdown extends React.Component {
  onCheckboxChanged = (changedOption, selectedValues) => {
    const { onChange, providerTypes } = this.props;
    onChange(changedOption);
  };

  clearProviderTypes = (event) => {
    event.stopPropagation();
    const { onChange = () => {} } = this.props;
    onChange(undefined);
  };

  render() {
    const { className, providerTypes } = this.props;
    let subheaderText = defaultSubheaderText;

    if (providerTypes.visible.length === 1) {
      const selectedProviderType =
        providerTypes.byId[providerTypes.visible[0]].name;
      subheaderText = selectedProviderType;
    } else {
      subheaderText = providerTypes.visible.length + " Selected"
    }

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
            <Row alignItems="center">
            <h2 style={{flex: 1 }}>PROVIDER TYPE</h2>
            <div onClick={this.clearProviderTypes}>clear all</div>
            </Row>
            <p>{subheaderText}</p>
          </>
        }
      />
    );
  }
}
