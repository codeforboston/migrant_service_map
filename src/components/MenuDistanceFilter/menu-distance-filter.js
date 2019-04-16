import React, { Component } from "react";
import "../ProviderList/provider-list.css";

class DistanceFilter extends Component {
  render() {
    const distances = [1, 2, 5];
    return (
      <div onClick={this.props.handleClick}>
        <div className="dropdown-list-header">
          <h2>Distance Filter</h2>
          <p id="menuDistanceStatus">Current distance</p>
        </div>
        <ul className="dropdown-list">
          {distances.map((el, i) => (
            <li className="dropdown-list-item" key={i}>
              <div>
                <input
                  type="radio"
                  name="distance"
                  id={el}
                  value={el}
                  onChange={() => {
                    this.props.changeDistanceFilter(el);
                  }}
                  checked={this.props.filters.distance === el}
                />
                <label htmlFor={el}>
                  {el} mile{el > 1 ? "s" : ""}
                </label>
              </div>
            </li>
          ))}
          <button
            className="dropdown-button"
            onClick={this.props.clearDistanceFilter}
          >
            Clear filter
          </button>
        </ul>
      </div>
    );
  }
}

export default DistanceFilter;
