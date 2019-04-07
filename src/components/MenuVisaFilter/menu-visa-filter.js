import React, { Component } from "react";
import "../Menu/menu.css";


class MenuVisaFilter extends Component {
  render() {
    const VISA_TYPES = ["visa1", "visa2", "visa3"];

    return (
      <li className="dropdown-list-container"  onClick={this.props.handleClick} >
      <div className="dropdown-list-header">
        <h2>Visa Status</h2>
        <p id="currentVisaStatus" >Current Visa Status</p>
        </div>
      <ul className="dropdown-list" >
        {VISA_TYPES.map((visa, i) => (
          <li className="dropdown-list-item" key={i}>
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
        <button className="dropdown-button" onClick={this.props.clearVisaFilter}>Clear visa filter</button>
      </ul>
      </li> 
    );
  }
}

export default MenuVisaFilter;
