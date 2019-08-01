import React, {Component} from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "./map.css";
import {circle, point, transformTranslate} from "@turf/turf";
import typeImages from "assets/images";
import distances from "assets/distances";
import iconColors from "assets/icon-colors";
import {
  convertProvidersToGeoJSON,
  createCenterMarker,
  createDistanceMarker,
  markerStyle,
  normalizeProviders,
  removeDistanceMarkers
} from "./utilities.js";

const PLACEHOLDER_VISA_TYPES = [
  "Temporary Agricultural Worker H-2A",
  "H-1B",
  "Permanent Resident Card (I-551)",
  "Advance Parole (I-512)",
  "Demo Type 1 (D1)",
  "Demo Type 2 (D2)",
  "Demo Type 3 (D3)",
  "Demo Type 4 (D4)",
  "Demo Type 5 (D5)",
  "Demo Type 6 (D6)"
];

mapboxgl.accessToken =
  "pk.eyJ1IjoicmVmdWdlZXN3ZWxjb21lIiwiYSI6ImNqZ2ZkbDFiODQzZmgyd3JuNTVrd3JxbnAifQ.UY8Y52GQKwtVBXH2ssbvgw";

class Map extends Component {
  constructor(props) {
    super(props);
    this.map = null;
    this.markerList = []; //need to keep track of marker handles ourselves -- cannot be queried from map
  }

  componentDidMount() {
    const { mapCenter, coordinates } = this.props.search;
    const { providerTypes, initializeProviders, initializeVisaFilter } = this.props;
    const map = new mapboxgl.Map({
      container: "map", // container id
      style: "mapbox://styles/refugeeswelcome/cjh9k11zz15ds2spbs4ld6y9o", // stylesheet location
      center: mapCenter,
      zoom: 11 // starting zoom
    });
    // setMapObject(map);
    map.addControl(new mapboxgl.NavigationControl());
    map.on("load", () => {
      initializeVisaFilter(PLACEHOLDER_VISA_TYPES);

      this.removeLayersFromOldDataSet();
      const providerFeatures = map.querySourceFeatures("composite", {
        sourceLayer: "Migrant_Services_-_MSM_Final_1"
      });
      const normalizedProviders = normalizeProviders(providerFeatures);
      initializeProviders(normalizedProviders);


      const allSymbolLayers = [...providerTypes.allIds, "highlightedProviders"];
      allSymbolLayers.forEach(typeId => {

        this.findLayerInMap(typeId);
        this.findClustersInMap();
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
      this.addDistanceIndicatorLayer();
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
    let milesPerPixel = distance * 8 / resolution;
    return Math.log2(24901 * Math.cos(latitude * Math.PI / 180) / milesPerPixel) - 8;
  }

  removeLayersFromOldDataSet = () => {
    const allLayers = this.map.getStyle().layers;
    for (let i = 100; i < 110; i++) {
      this.map.removeLayer(allLayers[i].id);
    }
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
        filter: ["all", ["!=", "has", "point_count"],["==", "typeId", typeId]],
        layout: {
          "icon-image": typeId + "icon",
          "icon-size": 0.3,
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "icon-padding": 10,
          visibility: "visible"
        },
        paint: {
          "icon-color": ['get', 'color'],
          "icon-halo-color": "white",
          "icon-halo-width": .5,
          "icon-halo-blur": 1,
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
        "circle-opacity": .35
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
          'visibility': 'visible'
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

  addClusterClickHandlerToMapLayer = (clusterName) => {
    this.map.on('click', clusterName, function (e) {
      let mapView = this;
      let features = mapView.queryRenderedFeatures(e.point, {layers: [clusterName]});

          let clusterId = features[0].properties.cluster_id;
          mapView.getSource("displayData").getClusterExpansionZoom(clusterId, function (err, zoom) {
              if (err)
                  return;

              mapView.easeTo({
                             center: features[0].geometry.coordinates,
                             zoom: zoom
                         });
          });
      });
  };

  addClickHandlerToMapIdLayer = typeId => {
    let {displayProviderInformation, highlightedProviders} = this.props;
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

        const scrollInterval = setInterval(function () {
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
    let {providersList, highlightedProviders} = this.props;
    let forGeoConvert = [];
    providersList.forEach(typeId => {
      typeId.providers.forEach(provider => {
        provider.color = highlightedProviders.includes(provider.id)
          ? "rgb(255,195,26)"
          : iconColors[provider.typeId];
        forGeoConvert.push(provider);
      });
    });
    return convertProvidersToGeoJSON(forGeoConvert);
  };

  getBoundingBox = (providerIds) => {
    let lngs = [], lats = [];
    for (let a in providerIds) {
      lngs.push(this.props.providers.byId[providerIds[a]].coordinates[0]);
      lats.push(this.props.providers.byId[providerIds[a]].coordinates[1]);
      }

    const maxLngs = lngs.reduce((a, b) => Math.max(a, b));
    const minLngs = lngs.reduce((a, b) => Math.min(a, b));
    const maxLats = lats.reduce((a, b) => Math.max(a, b));
    const minLats = lats.reduce((a, b) => Math.min(a, b));

    const boundsBox = [[minLngs, minLats], [maxLngs, maxLats]];
    return boundsBox;

  }


  updatePinAndDistanceIndicator = (prevProps) => {
    const distance = this.props.filters.distance;
    const searchCoordinates = this.props.search.coordinates;
    if (distance === prevProps.filters.distance
      && searchCoordinates === prevProps.search.coordinates) {
      // Do not render if the relevant props have not changed. This includes
      // the first render of this component, so the marker is not shown until
      // the user starts interacting with the app.
      return;
    }
    // If no distance filter is set, display all distance indicators.
    const distanceIndicatorRadii = distance ? [distance] : distances;
    const {color, options} = markerStyle;
    removeDistanceMarkers(this.markerList);
    this.addDistanceIndicatorLayer();

    const centerMarker = createCenterMarker();

    const mapPin = new mapboxgl.Marker({element: centerMarker});
    this.markerList.push(mapPin);
    mapPin.setLngLat(searchCoordinates);

    const circles = distanceIndicatorRadii.map((radius, i) =>
      circle(searchCoordinates, radius, {
        ...options,
        properties: { color: color[i], "stroke-width": radius }
      })
    );
    const labels = distanceIndicatorRadii.map((radius, i) => {
      const radiusOffset = transformTranslate(
        point(searchCoordinates),
        radius,
        90,
        {units: "miles"}
      );
      const distanceMarker = createDistanceMarker(radius, color[i]);
      const marker = new mapboxgl.Marker({element: distanceMarker});
      this.markerList.push(marker);
      return marker.setLngLat(radiusOffset.geometry.coordinates);
    });

    labels.map(label => label.addTo(this.map));
    mapPin.addTo(this.map);
    this.map
    .getSource("distance-indicator-source")
    .setData({type: "FeatureCollection", features: circles});
  };

  removeReferenceLocation = map => {
    removeDistanceMarkers(this.markerList);
    map.removeLayer("distance-indicator");
    map.removeSource("distance-indicator-source");

    map.flyTo({
      center: [-71.066954, 42.359947],
      zoom: 12
    });
  };

  addDistanceIndicatorLayer = () => {
    removeDistanceMarkers(this.markerList);
    if (!this.map.getSource("distance-indicator-source")) {
      this.map.addSource("distance-indicator-source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        }
      });
    }
    if (!this.map.getLayer("distance-indicator")) {
      this.map.addLayer({
        id: "distance-indicator",
        type: "line",
        source: "distance-indicator-source",
        paint: {
          "line-color": ["get", "color"],
          "line-opacity": 0.8,
          "line-width": ["*", 1, 3],
          "line-offset": 5
        }
      });
    }
  };

  zoomToFit = (providerIds) => {
    if(providerIds.length > 1){
      const visibleIcons = this.getBoundingBox(providerIds);
      this.map.fitBounds(visibleIcons, {
        padding: {top: 200, bottom: 200, left: 200, right: 200},
        duration: 2000,
        maxZoom: 13,
        linear: false,
      });
    }
  }

  componentDidUpdate(prevProps) {
    this.setSingleSourceInMap();
    const features = this.geoJSONFeatures();
    this.setSourceFeatures(features);
    this.props.providerTypes.allIds.map(typeId => this.findLayerInMap(typeId));
    this.updatePinAndDistanceIndicator(prevProps);
    this.zoomToFit(this.props.highlightedProviders);
    if (this.props.filters.distance && this.props.filters.distance !== prevProps.filters.distance) {
      this.map.flyTo({
        center: this.props.search.coordinates,
        zoom: this.zoomToDistance(this.props.filters.distance)
      });
    }
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    return <div id="map" className="map"/>;
  }
}

export default Map;
