import React from "react";
import CheckBoxDropdown from "../Dropdowns/checkbox-dropdown";
import { Row, Column } from "simple-flexbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cardIconMappings } from "../../components/MenuDropdownItem/menu-dropdown-item.js";
import providerTypeToColor from "provider-type-to-color.json";
import { keyImages } from "../../assets/images.js";
import { SSL_OP_NO_TLSv1_1 } from "constants";

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
    const { onChange = () => { } } = this.props;
    onChange(undefined);
  };

  selectAllProviderTypes = event => {
    event.stopPropagation();
    const { onChange = () => { } } = this.props;
    const { providerTypes } = this.props;

    providerTypes.allIds.forEach(providerType => {
      onChange(providerType)
    });
  };

  setExpanded = expanded => {
    this.setState({
      expanded
    });
  };


  render() {
    const { expanded } = this.state;
    const { className, providerTypes } = this.props;
    let subheaderText = defaultSubheaderText;
    let selectOrClearCommand = providerTypes.visible.length > 0 ? "clear all" : "select all"

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
        // options={providerTypes.allIds.map
        options={providerTypes.allIds.sort((a, b) => {
          if (providerTypes.byId[a].name <= providerTypes.byId[b].name) { return -1; }
          if (providerTypes.byId[a].name > providerTypes.byId[b].name) { return +1; }

          return 0;
        }).map

          (id => ({
            id,
            display:
              <span>
                <FontAwesomeIcon
                  icon={cardIconMappings[providerTypes.byId[id].name]}
                  color={providerTypeToColor[providerTypes.byId[id].name]}
                />
                {' '}
                {providerTypes.byId[id].name}

              </span>

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
                onClick={providerTypes.visible.length > 0 ? this.clearProviderTypes : this.selectAllProviderTypes}
              >
                {selectOrClearCommand}
              </div>
            </Row>
          </>
        }
      />
    );
  }
}
