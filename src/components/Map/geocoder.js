import React, { Component } from "react";
import mapboxgl from "./mapbox-gl-wrapper";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

const SPECIAL_NO_RESULTS_ID = "notfound.0";

// Approximate bounding box of Massachusetts.
const boundingBox = [-73.56055, 41.158671, -69.80923, 42.994435];

export default class Geocoder extends Component {
  constructor(props) {
    super(props);

    this.geocoderContainerRef = React.createRef();
  }

  componentDidMount() {
    const geocoder = (this.geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      proximity: {
        longitude: this.props.searchProximityCoordinates[0],
        latitude: this.props.searchProximityCoordinates[1]
      },
      placeholder: "Location",
      marker: false,
      flyTo: false,
      bbox: boundingBox
    }));

    const searchBox = geocoder.onAdd(null);
    searchBox.className += " msm-map-search-box";
    this.geocoderContainerRef.current.appendChild(searchBox);

    geocoder.on("results", ev => {
      /* Fun hack to show "no results found" in the search box. This solution depends on the implementation of
       * this specific version of the geocoder.
       *
       * You can see that the response passed to the 'results' event is then used to set the dropdown result:
       * https://github.com/mapbox/mapbox-gl-geocoder/blob/d2db50aede1ef6777083435f2dc533d5e1846a7e/lib/index.js#L203
       *
       * Typeahead instances render suggestions via method getItemValue:
       * https://github.com/tristen/suggestions/blob/9328f1f3d21598c40014892e3e0329027dd2b538/src/suggestions.js#L221
       *
       * Geocoder overrides getItemValue to look at the "place_name" property:
       * https://github.com/mapbox/mapbox-gl-geocoder/blob/d2db50aede1ef6777083435f2dc533d5e1846a7e/lib/index.js#L103
       *
       * Geocoder API response object documentation:
       * https://docs.mapbox.com/api/search/#geocoding-response-object
       */
      if (!ev.features || !ev.features.length) {
        ev.features = [
          {
            id: SPECIAL_NO_RESULTS_ID,
            place_name: "No search results"
          }
        ];
      }
    });

    geocoder.on("result", ev => {
      // ev.result contains id, place_name, text
      const {
        geometry: { coordinates: searchCoordinates },
        id: mapboxId,
        text: searchText
      } = ev.result;

      if (mapboxId === SPECIAL_NO_RESULTS_ID) {
        geocoder._clear();
        return;
      }

      this.props.setSearchResult(searchCoordinates, mapboxId, searchText);
    });

    geocoder.on("clear", ev => {
      this.props.clearSearchResult();
    });
  }

  componentWillUnmount() {
    this.geocoder.onRemove();
  }

  render() {
    return <div ref={this.geocoderContainerRef} />;
  }
}
