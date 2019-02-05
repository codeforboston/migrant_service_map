import React, { Component } from "react";

export default class DistanceFilter extends Component {
  constructor(props) {
    super(props);
  }
 

  render() {
    let { clearFilter, changeFilterDistance, distanceVisible } = this.props; 
    const distances = [1, 2, 5];
    return (
      <ul>
        {distances.map((el, i) => (
          <li key={i}>
            <div>
              <input
                type="radio"
                name={"distance"}
                id={el}
                value={el}
                onChange={e => changeFilterDistance(e)}
                checked={ distanceVisible.toString() === el.toString() }
              />
            <label htmlFor={el}>{el} miles</label>
            </div>
          </li>
        ))}
        <button onClick={clearFilter}>Clear filter</button>
      </ul>
    );
  }
}
