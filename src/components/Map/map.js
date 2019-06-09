import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "./map.css";
import { point, transformTranslate, circle } from "@turf/turf";
import typeImages from "assets/images";
import distances from "assets/distances";
import _ from "lodash";
import {
  removeDistanceMarkers,
  addDistanceFilterLayer,
  addSourceToMap,
  addCircleLayerToMap,
  addPointSourceToMap,
  removeReferenceLocation,
  togglePinMarker
} from "./mapHelpers.js";
import {
  convertProvidersToGeoJSON, 
  createCenterMarker,
  createDistanceMarker,
  markerStyle,
  normalizeProviders,
  scrollToCard,
} from "./utilities.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoicmVmdWdlZXN3ZWxjb21lIiwiYSI6ImNqZ2ZkbDFiODQzZmgyd3JuNTVrd3JxbnAifQ.UY8Y52GQKwtVBXH2ssbvgw";

class Map extends Component {
  constructor(props) {
    super(props);
    this.map = null;
  }


  setSourceFeatures = (typeId, features) => {
    let { providerTypes } = this.props; 
    if(providerTypes.visible){
    this.findSourceInMap(typeId, this.map);
      this.map.getSource(typeId).setData({
        type: "FeatureCollection",
        features: features
      });
    }
  };


  findLayerInMap = (typeId, map) => {
    const { providersList } = this.props;
    const providerTypesById = _.keyBy(providersList, "typeId");
    if (!map.getLayer(typeId)) {
      map.addLayer({
        id: typeId,
        source: typeId,
        type: "symbol",
        layout: {
          "icon-image": typeId + "icon",
          "icon-size": 0.4,
          visibility: "visible"
        }
      });
    //   this.addClickHandlerToMapIdLayer(typeId);
    }
  };

  findSourceInMap = (typeId, map) => {
    const { providersList } = this.props;
    const providerTypesById = _.keyBy(providersList, "typeId");
    if (!map.getSource(typeId)) {
      map.addSource(typeId, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        }
      });
    }
  };

  geoJSONFeatures = typeId => {
    let { providerTypes, highlightedProviders, providers } = this.props;
    if(!providerTypes.visible.includes(typeId) && typeId != "highlightedProviders"){
      return []
    }
    const selectProviders =
      typeId === "highlightedProviders" ? highlightedProviders : providerTypes.byId[typeId].providers;

    const features = convertProvidersToGeoJSON(selectProviders);
    return features;
  };

  loadProviderTypeImage = images => {
    images.map(typeImage =>
      this.map.loadImage(typeImage.image, (error, image) => {
        if (error) throw error;
        this.map.addImage(`${typeImage.type}icon`, image);
      })
    );
  };

  componentDidMount() {
    const { mapCenter, coordinates } = this.props.search;
    const { providerTypes, setMapObject, initializeProviders, displayProviderInformation } = this.props;
    const map = new mapboxgl.Map({
      container: "map", // container id
      style: "mapbox://styles/refugeeswelcome/cjh9k11zz15ds2spbs4ld6y9o", // stylesheet location
      center: mapCenter,
      zoom: 11 // starting zoom
    });
    setMapObject(map);

    const allSymbolLayers = [...providerTypes.allIds, "highlightedProviders"]

    map.on("load", () => {
      this.removeLayersFromOldDataSet();
      const providerFeatures = map.querySourceFeatures("composite", {
        sourceLayer: "Migrant_Services_-_MSM_Final_1"
      });
      const normalizedProviders = normalizeProviders(providerFeatures);
      initializeProviders(normalizedProviders);


      for( let typeId in allSymbolLayers){
        this.findSourceInMap(typeId, this.map)
        this.findLayerInMap(typeId, this.map);
      };
  });

    this.map = map;
    this.loadProviderTypeImage(typeImages);

    const coordinateObject = {
      // initiating geocoder requires this as an object
      longitude: coordinates[0],
      latitude: coordinates[1]
    };

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      proximity: coordinateObject
    });

    const searchBox = geocoder.onAdd(map);
    searchBox.className += " msm-map-search-box";
    document.getElementById("nav-search").appendChild(searchBox);

    geocoder.on("result", ev => {
      // ev.result contains id, place_name, text
      let { geometry, id, text } = ev.result;
      this.props.setSearchCenterCoordinates(geometry.coordinates, id, text);
      this.addDistanceIndicator();
      togglePinMarker(true);
    });

    geocoder.on("clear", ev => {
      let center = [-71.066954, 42.359947];
      removeReferenceLocation(this.map);
      this.props.setSearchCenterCoordinates(center, 1, "");
    });

    // addSourceToMap(SOURCE_ID, map);
  }

  addDistanceIndicator = () => {
    //TODO: make this input from the distance filter
    const distanceFilterDistances = distances;
    const {
      color,
      options,
     } = markerStyle;
    const { search } = this.props;
    removeDistanceMarkers();
    addDistanceFilterLayer(distanceFilterDistances, this.map);

    const center = this.createMarker(createCenterMarker()).setLngLat(
      search.coordinates
    );
    const circles = distanceFilterDistances.map((radius, i) =>
      circle(search.coordinates, radius, {
        ...options,
        properties: { color: color[i], "stroke-width": radius }
      })
    );
    const labels = distanceFilterDistances.map((radius, i) => {
      const radiusOffset = transformTranslate(
        point(search.coordinates),
        radius,
        90,
        { units: "miles" }
      );
      const marker = this.createMarker(createDistanceMarker(radius, color[i]));
      return marker.setLngLat(radiusOffset.geometry.coordinates);
    });

    labels.map(label => label.addTo(this.map));
    center.addTo(this.map);
    this.map
      .getSource("distance-indicator-source")
      .setData({ type: "FeatureCollection", features: circles });
  };

  createMarker = element => new mapboxgl.Marker({ element });

  removeLayersFromOldDataSet = () => {
    const allLayers = this.map.getStyle().layers;
    for (let i = 100; i < 110; i++) {
      this.map.removeLayer(allLayers[i].id);
    }
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


  componentDidUpdate(prevProps) {
    const { highlightedProviders, providerTypes } = this.props;
    const allSymbolLayers = providerTypes.allIds.concat("highlightedProviders")
    console.log(allSymbolLayers)
    allSymbolLayers.forEach(typeId => {
      this.findSourceInMap(typeId, this.map)
      this.findLayerInMap(typeId, this.map)
      const features = this.geoJSONFeatures(typeId);
      this.setSourceFeatures(typeId, features);
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
