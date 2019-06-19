import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "./map.css";
import { point, transformTranslate, circle } from "@turf/turf";
import typeImages from "assets/images";
import distances from "assets/distances";
import _ from "lodash";
import {
  convertProvidersToGeoJSON,
  createCenterMarker,
  createDistanceMarker,
  markerStyle,
  normalizeProviders,
  removeDistanceMarkers,
  scrollToCard,
} from "./utilities.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoicmVmdWdlZXN3ZWxjb21lIiwiYSI6ImNqZ2ZkbDFiODQzZmgyd3JuNTVrd3JxbnAifQ.UY8Y52GQKwtVBXH2ssbvgw";

class Map extends Component {
  constructor(props) {
    super(props);
    this.map = null;
  }

  componentDidMount() {
    const { mapCenter, coordinates } = this.props.search;
    const { providerTypes, setMapObject, initializeProviders, displayProviderInformation } = this.props;
    const map = new mapboxgl.Map({
      container: "map", // container id
      style: "mapbox://styles/refugeeswelcome/cjh9k11zz15ds2spbs4ld6y9o", // stylesheet location
      center: mapCenter,
      zoom: 11 // starting zoom
    });
    // setMapObject(map);

    map.on("load", () => {
      this.removeLayersFromOldDataSet();
      const providerFeatures = map.querySourceFeatures("composite", {
        sourceLayer: "Migrant_Services_-_MSM_Final_1"
      });
      const normalizedProviders = normalizeProviders(providerFeatures);
      initializeProviders(normalizedProviders);

      const allSymbolLayers = [...providerTypes.allIds, "highlightedProviders"];
      allSymbolLayers.forEach(typeId => {
        this.findSourceInMap(typeId);
        this.findLayerInMap(typeId);
      });
      this.loadProviderTypeImage(typeImages);
    });

    this.map = map;

    const coordinateObject = {
      // initiating geocoder requires this as an object
      longitude: coordinates[0],
      latitude: coordinates[1]
    };

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      proximity: coordinateObject,
      placeholder: "Location"
    });

    const searchBox = geocoder.onAdd(map);
    searchBox.className += " msm-map-search-box";
    document.getElementById("nav-search").appendChild(searchBox);

    geocoder.on("result", ev => {
      // ev.result contains id, place_name, text
      let { geometry, id, text } = ev.result;
      this.props.setSearchCenterCoordinates(geometry.coordinates, id, text);
      this.addDistanceIndicator();
      this.togglePinMarker(true);
    });

    geocoder.on("clear", ev => {
      let center = [-71.066954, 42.359947];
      this.removeReferenceLocation(this.map);
      this.togglePinMarker(false);
      this.props.setSearchCenterCoordinates(center, 1, "");
    });
  }

  removeLayersFromOldDataSet = () => {
    const allLayers = this.map.getStyle().layers;
    for (let i = 100; i < 110; i++) {
      this.map.removeLayer(allLayers[i].id);
    }
  };

  setSourceFeatures = (typeId, features) => {
    let { providerTypes } = this.props;
    if (providerTypes.visible.includes(typeId) || typeId == "highlightedProviders") {
      this.findSourceInMap(typeId);
        this.map.getSource(typeId).setData({
        type: "FeatureCollection",
        features: features
      });
    }
  };

  findLayerInMap = (typeId) => {
    // const { providersList } = this.props;
    // // const providerTypesById = _.keyBy(providersList, "typeId");
    if (!this.map.getLayer(typeId)) {
      this.map.addLayer({
        id: typeId,
        source: typeId,
        type: "symbol",
        layout: {
          "icon-image": typeId + "icon",
          "icon-size": 0.4,
          visibility: "visible"
        }
      });
      this.addClickHandlerToMapIdLayer(typeId);
    }
  };

  findSourceInMap = (typeId) => {
    // const { providersList } = this.props;
    // const providerTypesById = _.keyBy(providersList, "typeId");
    if (!this.map.getSource(typeId)) {
      this.map.addSource(typeId, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        }
      });
    }
  };

  loadProviderTypeImage = images => {
    images.map(typeImage =>
      this.map.loadImage(typeImage.image, (error, image) => {
        if (error) throw error;
        this.map.addImage(`${typeImage.type}icon`, image);
      })
    );
  };

  addClickHandlerToMapIdLayer = typeId => {
    let { displayProviderInformation, highlightedProviders } = this.props;
    this.map.on("click", typeId, e => {
      if (typeId !== "highlightedProviders") {
        const offsetTop = document.getElementById(`provider-${e.features[0].properties.id}`).offsetTop;
        const cardOffset = 50;

        const panel = document.getElementsByClassName("panels")[0];
        const toScrollTo = offsetTop - cardOffset;
        const steps = 15;
        const scrollStep = (toScrollTo - panel.scrollTop) / steps;
        let stepCount = 0;

        const scrollInterval = setInterval(function() {
          if (stepCount < steps) {
            panel.scrollBy(0, scrollStep);
            stepCount++;
          } else {
            panel.scrollTop = toScrollTo;
            clearInterval(scrollInterval);
          }
        }, 15);
        displayProviderInformation(e.features[0].properties.id);
      } else if (!highlightedProviders.includes(e.features[0].properties.id)) {
        displayProviderInformation(e.features[0].properties.id);
      }
    });
  };

  geoJSONFeatures = typeId => {
    let { providerTypes, highlightedProviders, providers } = this.props;
    if (!providerTypes.visible.includes(typeId) && typeId != "highlightedProviders") {
      return [];
    }
    let selectProviders; 
    if (typeId == "highlightedProviders"){
      selectProviders = highlightedProviders.map(id => providers.byId[id])
    }
    if (providerTypes.allIds.includes(typeId)){
      selectProviders = providerTypes.byId[typeId].providers.map(id => providers.byId[id])
    }
    const features = convertProvidersToGeoJSON(selectProviders);
    return features
  };
  

  addDistanceIndicator = () => {
    //TODO: make this input from the distance filter
    const distanceFilterDistances = distances;
    const { color, options } = markerStyle;
    const { search } = this.props;
    removeDistanceMarkers();
    this.addDistanceFilterLayer(distanceFilterDistances, this.map);

    const centerMarker = createCenterMarker();

    const mapPin = new mapboxgl.Marker({ centerMarker });
    mapPin.setLngLat(search.coordinates);

    const circles = distanceFilterDistances.map((radius, i) =>
      circle(search.coordinates, radius, {
        ...options,
        properties: { color: color[i], "stroke-width": radius }
      })
    );
    const labels = distanceFilterDistances.map((radius, i) => {
      const radiusOffset = transformTranslate(point(search.coordinates), radius, 90, { units: "miles" });
      const distanceMarker = createDistanceMarker((radius, color[i]));
      const marker = new mapboxgl.Marker({ distanceMarker });
      return marker.setLngLat(radiusOffset.geometry.coordinates);
    });

    labels.map(label => label.addTo(this.map));
    mapPin.addTo(this.map);
    this.map.getSource("distance-indicator-source").setData({ type: "FeatureCollection", features: circles });
  };

  togglePinMarker = show => {
    // mapPin.style.visibility = show ? '' : 'hidden';
  };

  removeReferenceLocation = map => {
    removeDistanceMarkers();
    this.togglePinMarker(false);
    map.removeLayer("distance-indicator");
    map.removeSource("distance-indicator-source");

    map.flyTo({
      center: [-71.066954, 42.359947],
      zoom: 12
    });
  };

  addDistanceFilterLayer = distanceFilterDistances => {
    console.log("add distance filter layer");
    removeDistanceMarkers();
    this.findSourceInMap("distance-indicator-source");
    if (!this.map.getLayer("distance-indicator")) {
      this.map.addLayer({
        id: "distance-indicator",
        type: "line",
        source: "distance-indicator-source",
        paint: {
          "line-color": ["get", "color"],
          "line-opacity": 0.8,
          "line-width": ["*", distanceFilterDistances[0], 3],
          "line-offset": 5
        }
      });
    }
  };


  componentDidUpdate(prevProps) {
    const { providerTypes } = this.props;
    const allSymbolLayers = [...providerTypes.allIds, "highlightedProviders"];
    allSymbolLayers.forEach(typeId => {
      this.findSourceInMap(typeId);
      const features = this.geoJSONFeatures(typeId);
      this.setSourceFeatures(typeId, features);
      this.findLayerInMap(typeId);
    });
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    return <div id="map" className="map" />;
  }
}

export default Map;
