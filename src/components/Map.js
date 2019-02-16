import React from "react";
import { connect } from "react-redux";
import mapboxgl from "mapbox-gl";
import {
  initializeProviders,
  toggleProviderVisibility,
  setSearchCenter
} from "../actions";
import getProvidersByDistance from "../selectors";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "../map.css";
import * as turf from "@turf/turf";
import { insertPopup } from "./PopUp.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoicmVmdWdlZXN3ZWxjb21lIiwiYSI6ImNqZ2ZkbDFiODQzZmgyd3JuNTVrd3JxbnAifQ.UY8Y52GQKwtVBXH2ssbvgw";

// TODO
// make source function
// make layer function
// turn providers back into features to inject in the map

// Steps
// create all sources
// create all layers
// to change things .setData on the sources

// Future dreams
// user can see their provider saves on a separate layer

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      providerFeatures: []
    };
    this.map = "";
  }

  reflectProviderVisibility = type => {
    console.log("reflectviz", type);
    this.updateSource(type);
    const visibility = type.visible ? "visible" : "none";
    this.map.setLayoutProperty(type.id, "visibility", visibility);
  };

  addSourceToMap = typeId => {
    console.log("adding source: " + typeId);
    this.map.addSource(typeId, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: []
      }
    });
  };

  addLayerToMap = typeId => {
    console.log("adding layer " + typeId);
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
    if (!this.map.getSource(type.id)) {
      this.addSourceToMap(type.id);
    }
    if (!this.map.getLayer(type.id)) {
      this.addLayerToMap(type.id);
    }

    this.map.getSource(type.id).setData({
      type: "FeatureCollection",
      features: this.convertProvidersToGeoJSON(type.providers)
    });
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

    geocoder.on("result", function(ev) {
      console.log(ev.result.geometry.coordinates);

      this.props.setSearchCenter(ev.result.geometry.coordinates);

      if (map.getLayer("circle-outline")) {
        map.removeLayer("circle-outline");
        map.removeSource("circle-outline");
      }
      if (map.getLayer("circle-outline-two")) {
        map.removeLayer("circle-outline-two");
        map.removeSource("circle-outline-two");
      }
      if (map.getLayer("circle-outline-three")) {
        map.removeLayer("circle-outline-three");
        map.removeSource("circle-outline-three");
      }
      if (map.getLayer("circle-outline-four")) {
        map.removeLayer("circle-outline-four");
        map.removeSource("circle-outline-four");
      }
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

    map.loadImage(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cat_silhouette.svg/400px-Cat_silhouette.svg.png",
      function(error, image) {
        if (error) throw error;
        map.addImage("community-centersicon", image);
      }
    );

    map.loadImage(
      "https://upload.wikimedia.org/wikipedia/commons/b/b4/Webdings_x005f.png",
      function(error, image) {
        if (error) throw error;
        map.addImage("educationicon", image);
      }
    );
    map.loadImage(
      "https://upload.wikimedia.org/wikipedia/commons/1/17/Webdings_x0042.png",
      function(error, image) {
        if (error) throw error;
        map.addImage("housingicon", image);
      }
    );

    map.loadImage(
      "https://upload.wikimedia.org/wikipedia/commons/b/b4/Webdings_x005f.png",
      function(error, image) {
        if (error) throw error;
        map.addImage("healthicon", image);
      }
    );
    map.loadImage(
      "https://upload.wikimedia.org/wikipedia/commons/b/b4/Webdings_x005f.png",
      function(error, image) {
        if (error) throw error;
        map.addImage("mental-healthicon", image);
      }
    );

    map.loadImage(
      "https://upload.wikimedia.org/wikipedia/commons/b/b4/Webdings_x005f.png",
      function(error, image) {
        if (error) throw error;
        map.addImage("legalicon", image);
      }
    );

    map.loadImage(
      "https://upload.wikimedia.org/wikipedia/commons/b/b4/Webdings_x005f.png",
      function(error, image) {
        if (error) throw error;
        map.addImage("job-placementicon", image);
      }
    );

    map.loadImage(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cat_silhouette.svg/400px-Cat_silhouette.svg.png",
      function(error, image) {
        if (error) throw error;
        map.addImage("resettlementicon", image);
      }
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
          ...properties
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
    console.log(this.props.providerTypes);
    this.props.providerTypes.forEach(type =>
      this.reflectProviderVisibility(type)
    );
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    return <div id="map" className="map" />;
  }
}

export default connect(
  ({ providerTypes, filterProviders }) => ({ providerTypes, filterProviders }),
  { initializeProviders, toggleProviderVisibility, setSearchCenter }
)(Map);
