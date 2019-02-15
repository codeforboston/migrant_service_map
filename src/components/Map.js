import React from "react";
import { connect } from "react-redux";
import mapboxgl from "mapbox-gl";
import { initializeProviders, toggleProviderVisibility } from "../actions";
import "../map.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import * as turf from "@turf/turf";

mapboxgl.accessToken =
  "pk.eyJ1IjoicmVmdWdlZXN3ZWxjb21lIiwiYSI6ImNqZ2ZkbDFiODQzZmgyd3JuNTVrd3JxbnAifQ.UY8Y52GQKwtVBXH2ssbvgw";

class Map extends React.Component {
  reflectProviderVisibility = type => {
    const visibility = type.visible ? "visible" : "none";
    this.map.setLayoutProperty(type.id, "visibility", visibility);
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

    map.on("load", () => {
      // get service providers info from mapbox
      const providerFeatures = map.querySourceFeatures("composite", {
        sourceLayer: "refugees-services"
      });

      const providers = Array.from(providerFeatures).map(
        ({ id, geometry: { coordinates }, properties }) => ({
          id,
          coordinates,
          ...properties
        })
      );
  
      this.props.initializeProviders(providers);

      this.addLayerToMap(this.filteredList(providerFeatures));
    });
  }

  handleMapClick(e) {
    let coordinates = e.features[0].geometry.coordinates.slice();

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    insertPopup(this.map, coordinates, e.features[0].properties);
  }

  filteredList = sourceObjArr => {
    const newList = sourceObjArr.filter(obj =>
      obj.properties.type.match("Community")
    );
    console.log(newList);
    return newList;
  };
  addLayerToMap = sourceObjArr => {
    this.map.loadImage(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cat_silhouette.svg/400px-Cat_silhouette.svg.png",
      (error, image) => {
        if (error) throw error;
        this.map.addImage("icon", image);
        this.map.addLayer({
          id: "providersLayer",
          source: {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: sourceObjArr
            }
          },
          type: "symbol",
          layout: {
            "icon-image": "icon",
            "icon-size": 0.2
          }
        });
      }
    );

    this.map.on("click", "providersLayer", e => this.handleMapClick(e));
  };

  highlightSomeIcons = (layerName, sourceObjArr) => {
    const myLayer = this.map.getLayer(layerName);
    //will need to set up a source to adjust what is on a layer.
  };

  componentDidUpdate() {
    this.props.providerTypes.forEach(this.reflectProviderVisibility);
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    return <div id="map" className="map" />;
  }
}

export default connect(
  ({ providerTypes }) => ({ providerTypes }),
  { initializeProviders, toggleProviderVisibility }
)(Map);
