import React, { Component } from "react";

class MenuVisaFilter extends Component {
  render() {
    const VISA_TYPES = ["visa1", "visa2", "visa3"];

    return (
      <ul>
        visa filters:
        {VISA_TYPES.map((visa, i) => (
          <li key={i}>
            <div>
              <input
                type="radio"
                name="visa"
                id={visa}
                value={visa}
                onChange={() => this.props.changeVisaFilter(visa)}
                checked={this.props.filters.visa === visa}
              />
              <label htmlFor={visa}>{visa}</label>
            </div>
          </li>
        ))}
        <button onClick={this.props.clearVisaFilter}>Clear visa filter</button>
      </ul>
    );
  }
}

export default MenuVisaFilter;
