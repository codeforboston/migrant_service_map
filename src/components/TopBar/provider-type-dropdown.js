import React from "react";
import CheckBoxDropdown from "../Dropdowns/checkbox-dropdown";
import { Row, Column } from "simple-flexbox";

const defaultSubheaderText = "Not Selected";
export default class ProviderTypeDropdown extends React.Component {
  state = {
    expanded: false
  };

  onCheckboxChanged = (changedOption, selectedValues) => {
    const { onChange } = this.props;
    onChange(changedOption);
  };

  clearProviderTypes = event => {
    event.stopPropagation();
    const { onChange = () => {} } = this.props;
    onChange(undefined);
    this.setExpanded(false);
  };

  setExpanded = expanded => {
    this.setState({
      expanded
    });
  };


  render() {
    const {expanded} = this.state;
    const { className, providerTypes } = this.props;
    let subheaderText = defaultSubheaderText;

    if (providerTypes.visible.length === 1) {
      const selectedProviderType =
        providerTypes.byId[providerTypes.visible[0]].name;
      subheaderText = selectedProviderType;
    } else {
      subheaderText = providerTypes.visible.length + " Selected";
    }

    return (
      <CheckBoxDropdown
        className={className}
        options={providerTypes.allIds.map(id => ({
          id,
          display: providerTypes.byId[id].name
        }))}
        expanded={expanded}
        setExpanded={this.setExpanded}
        onChange={this.onCheckboxChanged}
        visibleTypes={providerTypes.visible}
        header={
          <>
            <Row alignItems="center">
              <Column flexGrow={1}>
                <h2 style={{ flex: 1 }}>PROVIDER TYPE</h2>
                <p>{subheaderText}</p>
              </Column>
              <div
                className="clear-icon-container"
                onClick={this.clearProviderTypes}
              >
                clear all
              </div>
            </Row>
          </>
        }
      />
    );
  }
}
