import React from "react";
import { connect } from "react-redux";
import mapboxgl from "mapbox-gl";
import {
  initializeProviders,
  toggleProviderVisibility,
  setSearchCenterCoordinates
} from "../actions";
import getProvidersByDistance from "../selectors";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "../map.css";
import * as turf from "@turf/turf";
import { insertPopup } from "./PopUp.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoicmVmdWdlZXN3ZWxjb21lIiwiYSI6ImNqZ2ZkbDFiODQzZmgyd3JuNTVrd3JxbnAifQ.UY8Y52GQKwtVBXH2ssbvgw";

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      providerFeatures: []
    };
    this.map = "";
  }

  reflectLayerVisibility = type => {
    this.updateSource(type);
    const visibility = type.visible ? "visible" : "none";
    this.map.setLayoutProperty(type.id, "visibility", visibility);
  };

  addSourceToMap = typeId => {
    this.map.addSource(typeId, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: []
      }
    });
  };

  addLayerToMap = typeId => {
    this.map.addLayer({
      id: typeId,
      source: typeId,
      type: "symbol",
      layout: {
        "icon-image": typeId + "icon",
        "icon-size": 0.03,
        visibility: "visible"
      }
    });
    this.map.on("click", typeId, e => this.handleMapClick(e));
  };

  updateSource = type => {
    let { filters, search } = this.props; 

    if (!this.map.getSource(type.id)) {
      this.addSourceToMap(type.id);
    }
    if (!this.map.getLayer(type.id)) {
      this.addLayerToMap(type.id);
    }
    if (type.providers && filters.distance) {
      this.map.getSource(type.id).setData({
        type: "FeatureCollection",
        features: this.convertProvidersToGeoJSON(
          getProvidersByDistance(search.coordinates, type.providers, filters.distance)
        )
      });
    } else {
      this.map.getSource(type.id).setData({
        type: "FeatureCollection",
        features: this.convertProvidersToGeoJSON(type.providers)
      });
    }
  };

  convertProvidersToGeoJSON = providers => {
    return providers.map(provider => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: provider.coordinates
      },
      properties: provider
    }));
  };

  removeBufferCircles = layerName => {
    if (this.map.getLayer(layerName)) {
      this.map.removeLayer(layerName);
      this.map.removeSource(layerName);
    }
  };

  loadProviderTypeImage = (providerType, iconURL) => {
    this.map.loadImage(iconURL, (error, image) => {
      if (error) throw error;
      this.map.addImage(providerType + "icon", image);
    });
  };

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: "map", // container id
      style: "mapbox://styles/refugeeswelcome/cjh9k11zz15ds2spbs4ld6y9o", // stylesheet location
      center: [-71.066954, 42.359947], // starting position [lng, lat]
      zoom: 11 // starting zoom
    });

    this.map = map; // for passing map instance to click handlers

    var geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken
    });

    geocoder.on("result", ev => {
      this.props.setSearchCenterCoordinates(ev.result.geometry.coordinates);

      this.removeBufferCircles("circle-outline");
      this.removeBufferCircles("circle-outline-two");
      this.removeBufferCircles("circle-outline-three");
      this.removeBufferCircles("circle-outline-four");

      if (!map.getSource("single-point")) {
        map.addSource("single-point", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: []
          }
        });
        map.addLayer({
          id: "point",
          source: "single-point",
          type: "circle",
          paint: {
            "circle-radius": 10,
            "circle-color": "#007cbf"
          }
        });
      }

      map.getSource("single-point").setData(ev.result.geometry);

      var center = {
        type: "Feature",
        properties: {
          "marker-color": "#0f0"
        },
        geometry: {
          type: "Point",
          coordinates: ev.result.geometry.coordinates
        }
      };
      var radius = 0.5;
      var options = {
        steps: 100,
        units: "miles"
      };

      let circle = turf.circle(center, radius, options);

      map.addLayer({
        id: "circle-outline",
        type: "line",
        source: {
          type: "geojson",
          data: circle
        },
        paint: {
          "line-color": "#046328",
          "line-opacity": 0.8,
          "line-width": 10,
          "line-offset": 5
        },
        layout: {}
      });
      var radiusTwo = 1;
      var circleTwo = turf.circle(center, radiusTwo, options);
      map.addLayer({
        id: "circle-outline-two",
        type: "line",
        source: {
          type: "geojson",
          data: circleTwo
        },
        paint: {
          "line-color": "#00AA46",
          "line-opacity": 0.8,
          "line-width": 10,
          "line-offset": 5
        },
        layout: {}
      });
      var radiusThree = 3;
      var circleThree = turf.circle(center, radiusThree, options);
      map.addLayer({
        id: "circle-outline-three",
        type: "line",
        source: {
          type: "geojson",
          data: circleThree
        },
        paint: {
          "line-color": "#71C780",
          "line-opacity": 0.8,
          "line-width": 10,
          "line-offset": 5
        },
        layout: {}
      });
      var radiusFour = 5;
      var circleFour = turf.circle(center, radiusFour, options);
      map.addLayer({
        id: "circle-outline-four",
        type: "line",
        source: {
          type: "geojson",
          data: circleFour
        },
        paint: {
          "line-color": "#D5EDDB",
          "line-opacity": 0.8,
          "line-width": 10,
          "line-offset": 5
        },
        layout: {}
      });
    });

    map.addControl(geocoder);

    this.loadProviderTypeImage(
      "community-centers",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cat_silhouette.svg/400px-Cat_silhouette.svg.png"
    );

    this.loadProviderTypeImage(
      "cash/food-assistance",
      "https://upload.wikimedia.org/wikipedia/commons/b/b4/Webdings_x005f.png"
    );

    this.loadProviderTypeImage(
      "education",
      "https://upload.wikimedia.org/wikipedia/commons/b/b4/Webdings_x005f.png"
    );

    this.loadProviderTypeImage(
      "housing",
      "https://upload.wikimedia.org/wikipedia/commons/1/17/Webdings_x0042.png"
    );

    this.loadProviderTypeImage(
      "health",
      "https://upload.wikimedia.org/wikipedia/commons/b/b4/Webdings_x005f.png"
    );

    this.loadProviderTypeImage(
      "mental-health",
      "https://upload.wikimedia.org/wikipedia/commons/b/b4/Webdings_x005f.png"
    );

    this.loadProviderTypeImage(
      "legal",
      "https://upload.wikimedia.org/wikipedia/commons/b/b4/Webdings_x005f.png"
    );

    map.on("load", () => {
      // remove data layers created by mapbox
      const layers = map.getStyle().layers;
      for (let i = 100; i < 110; i++) {
        map.removeLayer(layers[i].id);
      }

      // get service providers info from mapbox from the new data
      const providerFeatures = map.querySourceFeatures("composite", {
        sourceLayer: "Migrant_Services_-_MSM_Final_1"
      });

      // prep map query result for redux
      const providers = Array.from(providerFeatures).map(
        ({ id, geometry: { coordinates }, properties }) => ({
          id,
          coordinates,
          address: properties["Address (#, Street Name, District/city, State, Zip Code)"],
          email: properties["Email:"],
          mission: properties["Mission:"],
          name: properties["Organization Name"],
          telephone: properties["Telephone:"],
          timestamp: properties.Timestamp,
          // Type of Service
          category: properties["Type of Service"], // better name to map to?
          "Type of Service": properties["Type of Service"], // as referenced in reducer helper function
          // Validated By
          website: properties.Website,
        })
      );
      // commit map query result to redux
      this.props.initializeProviders(providers);
    });
  }

  handleMapClick(e) {
    let coordinates = e.features[0].geometry.coordinates.slice();
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    insertPopup(this.map, coordinates, e.features[0].properties);
  }

  componentDidUpdate() {
    this.props.providerTypes.forEach(type => this.reflectLayerVisibility(type));
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    return <div id="map" className="map" />;
  }
}

export default connect(
  ({ providerTypes, filters, search }) => ({ providerTypes, filters, search }),
  { initializeProviders, toggleProviderVisibility, setSearchCenterCoordinates }
)(Map);
