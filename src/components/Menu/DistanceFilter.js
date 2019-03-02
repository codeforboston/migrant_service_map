import React, { Component } from "react";
import { connect } from "react-redux";
import {
  clearDistanceFilter,
  changeDistanceFilter
} from "../../actions";

class DistanceFilter extends Component {
  render() {
    const distances = [1, 2, 5];
    return (
      <ul>
        within:
        {distances.map((el, i) => (
          <li key={i}>
            <div>
              <input
                type="radio"
                name={"distance"}
                id={el}
                value={el}
                onChange={e => {
                  this.props.changeDistanceFilter(el);
                }}
          
                checked={this.props.filters.distance === el}
              />  
              <label htmlFor={el}>{el} mile{el > 1 ? "s" : ""}
              </label>
            </div>
          </li>
        ))}
        <button onClick={this.props.clearDistanceFilter}>Clear filter</button>
      </ul>
    );
  }
}

export default connect(
  ({ providerTypes, filters }) => ({ providerTypes, filters }),
  { clearDistanceFilter, changeDistanceFilter }
)(DistanceFilter);
