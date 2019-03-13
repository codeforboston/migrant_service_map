import React from "react";
import { connect } from "react-redux";
import mapboxgl from "mapbox-gl";
import {
  initializeProviders,
  toggleProviderVisibility,
  setSearchCenterCoordinates
} from "../actions";
import { getProvidersByDistance, getProvidersByName } from "../selectors";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "../map.css";
import * as turf from "@turf/turf";
import { insertPopup } from "./PopUp.js";
import { featureCollection, point, transformTranslate } from "@turf/turf";

//Fix this later
const longitude = -71.066954
const latitude = 42.359947

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
    if (type.providers && (filters.distance || filters.name)) {
      this.map.getSource(type.id).setData({
        type: "FeatureCollection",
        features: this.convertProvidersToGeoJSON(
          this.getFilteredProviders(type)
        )
      });
    } else {
      this.map.getSource(type.id).setData({
        type: "FeatureCollection",
        features: this.convertProvidersToGeoJSON(type.providers)
      });
    }
  };

  
  getFilteredProviders = (type) => {
    let { filters, search } = this.props;
    let providers = type.providers;
    if (filters.distance) {
      providers = getProvidersByDistance(search.coordinates, providers, filters.distance);
    }
    if (filters.name) {
      providers = getProvidersByName(providers, filters.name);
    } 
    return providers;
  }
  

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
      accessToken: mapboxgl.accessToken,
      proximity: {longitude, latitude}
    });

    //TODO: make this input from the distance filter
    const distanceFilterDistances = [0.5, 1, 2, 3];

    geocoder.on("result", function(ev) {
      const centerCoordinates = ev.result.geometry.coordinates;
      const distanceMarkers = Array.from(document.getElementsByClassName("distanceMarker")); 
      distanceMarkers.map(marker => marker.remove()); 
      if(!map.getSource("distance-indicator-source")){
      map.addSource("distance-indicator-source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        }
      });
      map.addLayer({
        id: "distance-indicator",
        type: "line",
        source: "distance-indicator-source",
        paint: {
          "line-color": ["get", "color"],
          "line-opacity": 0.8,
          "line-width": ["*", distanceFilterDistances[2], 3],
          "line-offset": 5
        }
      });
    };

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
      const colors = ["#007cbf", "#00AA46", "#71C780", "#D5EDDB"];
    

      const center = (color) => {
        return {
          type: "Feature", 
          properties: {
            "marker-color": "#0f0", 
            color: color
          },
          geometry: {
            type: "Point", 
            coordinates: ev.result.geometry.coordinates
          }
        }
      };
  
    
    const createDistanceMarker = (distance, color) => {
      const markerElement = document.createElement("div");
      markerElement.className = "distanceMarker"; 
      markerElement.id = "marker-" + distance + "-miles"; 
      markerElement.style.display = "block";
      markerElement.innerText = distance + " miles";
      markerElement.style.backgroundColor = color;
      

    return new mapboxgl.Marker({
      element: markerElement
    })
  }
   
      const options = { steps: 100, units: "miles" };
      const circles = distanceFilterDistances.map((radius, i) =>
        turf.circle(center(colors[i]), radius, options)
      );
      
      const labels = distanceFilterDistances.map((radius, i) => {
        const centerPoint = turf.point(centerCoordinates); 
        console.log(centerCoordinates, centerPoint);
        const radiusOffset = turf.transformTranslate(centerPoint, radius, 90, {units: "miles"});
        const marker = createDistanceMarker(radius, colors[i]); 
        return marker.setLngLat(radiusOffset.geometry.coordinates).addTo(map); 
      });
      
      
      map.getSource("single-point").setData(ev.result.geometry);
      map.getSource("distance-indicator-source").setData({type: "FeatureCollection", features: circles});

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
