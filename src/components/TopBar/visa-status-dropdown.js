import React from "react";
import CheckBoxDropdown from "../Dropdowns/checkbox-dropdown";

const defaultSubheaderText = "Current Visa Status";
const numberOptionsBeforeViewmore = 3
export default class VisaStatusDropdown extends React.Component {
  state = {
    viewAllOptions: false,
    expanded: false
  };

  onCheckboxChanged = (option, selectedValues) => {
    const { onChange } = this.props;
    onChange(option);
  };

  onSeeMore = () => {
    this.setState({
      viewAllOptions: true
    });
  };

  setExpanded = expanded => {
    this.setState({
      viewAllOptions: !expanded ? false : this.state.viewAllOptions,
      expanded
    });
  };

  render() {
    let { className, visaTypes } = this.props;
    const { viewAllOptions, expanded } = this.state;
    let subheaderText = defaultSubheaderText;

    if (visaTypes.visible.length === 1) {
      subheaderText = visaTypes.visible[0];
    } else {
      subheaderText = visaTypes.visible.length + " Selected";
    }

    const preferredVisaTypes = viewAllOptions ? visaTypes.allVisas : visaTypes.allVisas.slice(0, numberOptionsBeforeViewmore)
    const footer = <div onClick={this.onSeeMore}>See More</div>;
    const footerShown = visaTypes.allVisas.length > numberOptionsBeforeViewmore ? (viewAllOptions ? null : footer) : null;
    return (
      <CheckBoxDropdown
        className={className}
        options={preferredVisaTypes.map(visaType => ({
          id: visaType,
          display: visaType
        }))}
        onChange={this.onCheckboxChanged}
        visibleTypes={visaTypes.visible}
        header={
          <>
            <h2>VISA STATUS</h2>
            <p>{subheaderText}</p>
          </>
        }
        footer={footerShown}
        expanded={expanded}
        setExpanded={this.setExpanded}
      />
    );
  }
}
