import React from "react";
import RadioButtonDropdown from "../Dropdowns/radio-button-dropdown";
import distances from "assets/distances";
import { Row, Column } from "simple-flexbox";

const distanceText = (distance) => distance ? `${distance} mile${distance === 1 ? "" : "s"}` : 'None Selected';

export default class DistanceDropdown extends React.Component {
  state = { expanded: false };

  clearDistance = event => {
    event.stopPropagation();
    const { onClear = () => {} } = this.props;
    onClear();
    this.setState({ expanded: false });
  };

  render() {
    const { className, currentDistance, onChange } = this.props;
    const { expanded } = this.state;
    const options = distances.map(distance => {
      if (distance < 0) {
        // "null" clears the filter
        return { value: null, text: "None" };
      } else {
        return {
          value: distance,
          text: distanceText(distance),
        };
      }
    });
    return (
      <RadioButtonDropdown
        className={className}
        onChange={onChange}
        options={options}
        selected={currentDistance}
        expanded={expanded}
        setExpanded={(expanded) => this.setState({expanded})}
        header={
          <>
            <Row alignItems="center">
              <Column flexGrow={1}>
                <h2 style={{ flex: 1 }}>Distance</h2>
                <p>{distanceText(currentDistance)}</p>
              </Column>
              <div
                className="clear-icon-container"
                onClick={this.clearDistance}
              >
                clear
              </div>
            </Row>
          </>
        }
      />
    );
  }
}
