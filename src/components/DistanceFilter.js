import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import * as turf from "@turf/turf";

export default class DistanceFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      distanceVisible: []
    };
  }
 

  render() {
    let { filterDistance, clearFilter } = this.props; 
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
                onChange={e => filterDistance(e)}
                checked={this.state.distanceVisible === el}
              />
            <label htmlFor={el}>{el + " miles"}</label>
            </div>
          </li>
        ))}
        <button onClick={clearFilter}>Clear filter</button>
      </ul>
    );
  }
}
