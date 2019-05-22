import React from "react";
import RadioButtonDropdown from "./radio-button-dropdown";

const defaultDistance = "None Selected";
export default class DistanceDropdown extends React.Component {
  state = { distance: defaultDistance };

  onRadioButtonChanged = (miles, text) => {
    const { onChange = () => {} } = this.props;
    onChange(miles);
    this.setState({ distance: text });
  };

  render() {
    const { className } = this.props;
    const { distance } = this.state;
    return (
      <RadioButtonDropdown
        className={className}
        onChange={this.onRadioButtonChanged}
        options={[
          { value: 1, text: "1 mile" },
          { value: 3, text: "3 miles" },
          { value: 5, text: "5 miles" }
        ]}
        header={
          <>
            <h2>Distance</h2>
            <p>{distance}</p>
          </>
        }
      />
    );
  }
}
