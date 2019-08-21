import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "./map.css";
import { circle, point, transformTranslate } from "@turf/turf";
import typeImages from "assets/images";
import distances from "assets/distances";
import iconColors from "assets/icon-colors";
import {
  convertProvidersToGeoJSON,
  createCenterMarker,
  createDistanceMarker,
  normalizeProviders,
  removeDistanceMarkers,
  getBoundingBox
} from "./utilities.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoicmVmdWdlZXN3ZWxjb21lIiwiYSI6ImNqZ2ZkbDFiODQzZmgyd3JuNTVrd3JxbnAifQ.UY8Y52GQKwtVBXH2ssbvgw";

class Map extends Component {
  constructor(props) {
    super(props);
    this.map = null;
    this.markerList = []; //need to keep track of marker handles ourselves -- cannot be queried from map
    this.state = {
      loaded: false
    };
  }

  onMapLoaded = () => {
    const { initializeProviders } = this.props;

    // Initialize static sources and layers. Layers for provider icons are
    // added as they're enabled in the UI. Layers are drawn in the order they
    // are added to the map.
    this.setSingleSourceInMap();
    this.addDistanceIndicatorLayer();
    this.findClustersInMap();

    // Pull data from Mapbox style and initialize application state
    const providerFeatures = this.map.querySourceFeatures("composite", {
      sourceLayer: "Migrant_Services_-_MSM_Final_1"
    });
    const normalizedProviders = normalizeProviders(providerFeatures);
    initializeProviders(normalizedProviders);

    this.loadProviderTypeImage(typeImages);
    this.setState({ loaded: true });
  };

  componentDidMount() {
    const { mapCenter, coordinates } = this.props.search;
    const map = new mapboxgl.Map({
      container: "map", // container id
      style: "mapbox://styles/refugeeswelcome/cjxmgxala1t5b1dtea37lbi2p", // stylesheet location
      center: mapCenter,
      zoom: 11 // starting zoom
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.on("load", this.onMapLoaded);

    this.map = map;

    const coordinateObject = {
      // initiating geocoder requires this as an object
      longitude: coordinates[0],
      latitude: coordinates[1]
    };

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      proximity: coordinateObject,
      placeholder: "Location",
      marker: false
    });

    const searchBox = geocoder.onAdd(map);
    searchBox.className += " msm-map-search-box";
    document.getElementById("nav-search").appendChild(searchBox);

    geocoder.on("result", ev => {
      // ev.result contains id, place_name, text
      let { geometry, id, text } = ev.result;
      let zoom;
      if (!this.props.filters.distance) {
        zoom = this.zoomToDistance(1.5);
      } else {
        zoom = this.zoomToDistance(this.props.filters.distance);
      }

      this.props.setSearchCenterCoordinates(geometry.coordinates, id, text);
      map.flyTo({
        center: geometry.coordinates,
        zoom: zoom
      });
    });

    geocoder.on("clear", ev => {
      let center = [-71.066954, 42.359947];
      this.removeReferenceLocation(this.map);
      this.props.setSearchCenterCoordinates(center, 1, "");
    });
  }

  zoomToDistance = distance => {
    let resolution = window.screen.height;
    let latitude = this.props.search.coordinates[1];
    let milesPerPixel = (distance * 8) / resolution;
    return (
      Math.log2(
        (24901 * Math.cos((latitude * Math.PI) / 180)) / milesPerPixel
      ) - 8
    );
  };

  setSourceFeatures = features => {
    this.setSingleSourceInMap(); // checks source exists, adds if not
    this.map.getSource("displayData").setData({
      type: "FeatureCollection",
      features: features
    });
  };

  findLayerInMap = typeId => {
    if (!this.map.getLayer(typeId)) {
      this.map.addLayer({
        id: typeId,
        source: "displayData",
        type: "symbol",
        filter: ["all", ["!=", "has", "point_count"], ["==", "typeId", typeId]],
        layout: {
          "icon-image": typeId + "icon",
          "icon-size": 0.3,
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "icon-padding": 10,
          visibility: "visible"
        },
        paint: {
          "icon-color": ["get", "color"],
          "icon-halo-color": "white",
          "icon-halo-width": 0.5,
          "icon-halo-blur": 1
        }
      });

      this.addClickHandlerToMapIdLayer(typeId);
    }
  };

  findClustersInMap = () => {
    this.map.addLayer({
      id: "clusterCircle",
      source: "displayData",
      type: "circle",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": "black",
        "circle-radius": 30,
        "circle-opacity": 0.35
      }
    });

    let clusterName = "cluster";
    this.map.addLayer({
      id: clusterName,
      source: "displayData",
      type: "symbol",
      filter: ["has", "point_count"],
      layout: {
        "icon-size": 0.4,
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 36,
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
        visibility: "visible"
      },
      paint: {
        "text-color": "black",
        "text-halo-color": "#ffffff",
        "text-halo-width": 2
      }
    });

    this.addClusterClickHandlerToMapLayer(clusterName);
  };

  setSingleSourceInMap = () => {
    if (!this.map.getSource("displayData")) {
      this.map.addSource("displayData", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        },
        cluster: true,
        clusterMaxZoom: 80, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
      });
    }
  };

  loadProviderTypeImage = images => {
    images.map(typeImage =>
      this.map.loadImage(typeImage.image, (error, image) => {
        if (error) throw error;
        this.map.addImage(`${typeImage.type}icon`, image, { sdf: true });
      })
    );
  };

  addClusterClickHandlerToMapLayer = clusterName => {
    this.map.on("click", clusterName, function(e) {
      let mapView = this;
      let features = mapView.queryRenderedFeatures(e.point, {
        layers: [clusterName]
      });

      let clusterId = features[0].properties.cluster_id;
      mapView
        .getSource("displayData")
        .getClusterExpansionZoom(clusterId, function(err, zoom) {
          if (err) return;

          mapView.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom
          });
        });
    });
  };

  addClickHandlerToMapIdLayer = typeId => {
    let { displayProviderInformation, highlightedProviders } = this.props;
    this.map.on("click", typeId, e => {
      const providerElement = document.getElementById(
        `provider-${e.features[0].properties.id}`
      );
      if (typeId !== "highlightedProviders" && providerElement) {
        const offsetTop = providerElement.offsetTop;
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

  geoJSONFeatures = () => {
    let { providersList, highlightedProviders, search, providers } = this.props;
    const showSavedProviders = search.selectedTabIndex === 1;
    const savedProviderIds = providers.savedProviders;

    let forGeoConvert = [];
    providersList.forEach(typeId => {
      typeId.providers.forEach(provider => {
        provider.color = highlightedProviders.includes(provider.id)
          ? "rgb(255,195,26)"
          : iconColors[provider.typeId];

        if (!showSavedProviders || savedProviderIds.includes(provider.id)) {
          // Show only saved providers if the saved provider tab is selected, otherwise show everything.
          forGeoConvert.push(provider);
        }
      });
    });
    return convertProvidersToGeoJSON(forGeoConvert);
  };

  updatePinAndDistanceIndicator = prevProps => {
    const distance = this.props.filters.distance;
    const searchCoordinates = this.props.search.coordinates;
    if (
      distance === prevProps.filters.distance &&
      searchCoordinates === prevProps.search.coordinates
    ) {
      // Do not render if the relevant props have not changed. This includes
      // the first render of this component, so the marker is not shown until
      // the user starts interacting with the app.
      return;
    }
    this.updateZoom(this.props.filters.distance);
    removeDistanceMarkers(this.markerList);
    this.addDistanceIndicatorLayer();
    // If no distance filter is set, display all distance indicators.
    let distanceIndicatorRadii = distance ? [distance] : distances.sort();
    let userSearch = ![1, "default"].includes(this.props.search.currentLocation)

    if (distance || userSearch) {
      const centerMarker = createCenterMarker();
      const mapPin = new mapboxgl.Marker({element: centerMarker})
      .setLngLat(searchCoordinates)
      .addTo(this.map);
      this.markerList.push(mapPin);

      // Create distance labels drawn from smallest to largest
      const labels = distanceIndicatorRadii.map((radius, i) => {
        const radiusOffset = transformTranslate(
          point(searchCoordinates),
          radius,
          90,
          { units: "miles" }
        );
        const distanceMarker = createDistanceMarker(radius);
        const marker = new mapboxgl.Marker({ element: distanceMarker });
        this.markerList.push(marker);
        return marker.setLngLat(radiusOffset.geometry.coordinates);
      });
      labels.map(label => label.addTo(this.map));
    } else {
      distanceIndicatorRadii = [];
    };

    // Create concentric circles, drawn from largest to smallest, with the
    // largest circle having a different fill color than the others.
    const innerColor = "hsla(317, 100%, 84%, .1)";
    const outerColor = "hsla(317, 100%, 84%, .15)";
    const circles = distanceIndicatorRadii
      .slice()
      .reverse()
      .map((radius, i) =>
        circle(searchCoordinates, radius, {
          steps: 100,
          units: "miles",
          properties: { color: i === 0 ? outerColor : innerColor }
        })
      );

    this.map
      .getSource("distance-indicator-source")
      .setData({ type: "FeatureCollection", features: circles });
  };

  updateZoom = distance => {
    const zoom = distance ? distance : 1.5;
    this.map.easeTo({
      center: this.props.search.coordinates,
      zoom: this.zoomToDistance(zoom)
    });
  };

  removeReferenceLocation = map => {
    removeDistanceMarkers(this.markerList);
    map.getSource("distance-indicator-source").setData({
      type: "FeatureCollection",
      features: []
    });

    map.flyTo({
      center: [-71.066954, 42.359947],
      zoom: 12
    });
  };

  addDistanceIndicatorLayer = () => {
    if (!this.map.getSource("distance-indicator-source")) {
      this.map.addSource("distance-indicator-source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        }
      });
    }
    if (!this.map.getLayer("distance-indicator-fill")) {
      this.map.addLayer({
        id: "distance-indicator-fill",
        type: "fill",
        source: "distance-indicator-source",
        paint: {
          "fill-color": ["get", "color"]
        }
      });
    }
    if (!this.map.getLayer("distance-indicator-stroke")) {
      this.map.addLayer({
        id: "distance-indicator-stroke",
        type: "line",
        source: "distance-indicator-source",
        paint: {
          "line-color": "#D561B5",
          "line-width": 2
        }
      });
    }
  };

  zoomToFit = providerIds => {
    if (providerIds.length > 1) {
      const visibleIcons = getBoundingBox(this.props.providers, providerIds);
      this.map.fitBounds(visibleIcons, {
        padding: { top: 200, bottom: 200, left: 200, right: 200 },
        duration: 2000,
        maxZoom: 13,
        linear: false
      });
    }
  };

  componentDidUpdate(prevProps) {
    if (this.state.loaded) {
      const features = this.geoJSONFeatures();
      this.setSourceFeatures(features);
      this.props.providerTypes.allIds.map(typeId =>
        this.findLayerInMap(typeId)
      );
      this.updatePinAndDistanceIndicator(prevProps);
      this.zoomToFit(this.props.highlightedProviders);
      if (
        this.props.filters.distance &&
        this.props.filters.distance !== prevProps.filters.distance
      ) {
        this.map.flyTo({
          center: this.props.search.coordinates,
          zoom: this.zoomToDistance(this.props.filters.distance)
        });
      }
      if (this.props.search.flyToProviderId !== prevProps.search.flyToProviderId) {
        const {flyToProviderId} = this.props.search;
        const {coordinates} = this.props.providers.byId[flyToProviderId];
        this.map.flyTo({
          center: coordinates,
          zoom: 15
        });
      }
    }
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    return <div id="map" className="map" />;
  }
}

export default Map;
