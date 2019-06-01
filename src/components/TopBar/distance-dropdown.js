import React from "react";
import RadioButtonDropdown from "../Dropdowns/radio-button-dropdown";
import distances from "assets/distances";

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
    const options = distances.map(distance => {
      return { value: distance, text: `${distance} miles`}
    })
    return (
      <RadioButtonDropdown
        className={className}
        onChange={this.onRadioButtonChanged}
        options={options}
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
