import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "./map.css";
import { circle, point, transformTranslate } from "@turf/turf";
import typeImages from "assets/images";
import distances from "assets/distances";
import {
  convertProvidersToGeoJSON,
  createCenterMarker,
  createDistanceMarker,
  normalizeProviders,
  removeDistanceMarkers,
  getBoundingBox,
  filterProviderIds,
  providersById
} from "./utilities.js";

const SPECIAL_NO_RESULTS_ID = 'notfound.0';

mapboxgl.accessToken =
  "pk.eyJ1IjoicmVmdWdlZXN3ZWxjb21lIiwiYSI6ImNqZ2ZkbDFiODQzZmgyd3JuNTVrd3JxbnAifQ.UY8Y52GQKwtVBXH2ssbvgw";

const boundingBox = [
  -71.562762,
  42.154131, // Longitude,Latitude near Milford MA
  -70.647115,
  42.599752 // Longitude, Latitute near Gloucester MA
];

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
      marker: false,
      bbox: boundingBox
    });

    const searchBox = geocoder.onAdd(map);
    searchBox.className += " msm-map-search-box";
    document.getElementById("nav-search").appendChild(searchBox);

    geocoder.on('results', ev => {
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
        ev.features = [{ 
          id: SPECIAL_NO_RESULTS_ID,
          place_name: 'No search results',
        }];
      }
    });

    geocoder.on("result", ev => {
      // display service providers results tab
      const { selectTab } = this.props;
      selectTab(0)
      // ev.result contains id, place_name, text
      let { geometry, id, text } = ev.result;
      if (id === SPECIAL_NO_RESULTS_ID) {
        geocoder._clear();
        return;
      }
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
      this.clearLocationSearch();
    });
  }

  clearLocationSearch = () => {
    let center = [-71.066954, 42.359947];
    this.removeReferenceLocation(this.map);
    this.props.setSearchCenterCoordinates(center, 1, "");
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
          "icon-size": 0.4,
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "icon-padding": 10,
          visibility: "visible"
        }
      });
      this.addClickHandlerToMapIdLayer(typeId);
      this.addHoverHandlerToMapIdLayer(typeId);
    }
  };

  setSpecialLayerInMap = (property, layerName) => {
    if (!this.map.getLayer(layerName)) {
      this.map.addLayer({
        id: layerName,
        source: "displayData",
        type: "symbol",
        filter: ["==", property, layerName],
        layout: {
          "icon-image": layerName + "icon",
          "icon-size": 0.4,
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "icon-padding": 10,
          visibility: "visible"
        }
      });
    }
  };

  findClustersInMap = () => {
    this.map.addLayer({
      id: "clusterCircle",
      source: "displayData",
      type: "symbol",
      filter: ["has", "point_count"],
      layout: {
        "icon-image": "clustersicon",
        "icon-size": 0.5,
        "icon-allow-overlap": true,
        "icon-ignore-placement": true
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
        "text-size": 26,
        "text-offset": [0, -0.3],
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
        this.map.addImage(`${typeImage.type}icon`, image);
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
        displayProviderInformation(e.features[0].properties.id);
      } else if (!highlightedProviders.includes(e.features[0].properties.id)) {
        displayProviderInformation(e.features[0].properties.id);
      }
    });
  };

  addHoverHandlerToMapIdLayer = typeId => {
    let popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      className: "name-popup",
      offset: 20
    });

    this.map.on("mouseenter", typeId, e => {
      let popupCoordinates = e.features[0].geometry.coordinates.slice();
      let name = e.features[0].properties.name;

      popup
        .setLngLat(popupCoordinates)
        .setHTML(name)
        .addTo(this.map);
    });

    this.map.on("mouseleave", typeId, () => {
      popup.remove();
    });
  };

  geoJSONFeatures = () => {
    let { highlightedProviders, visibleProviders = [] } = this.props;
    let provider;
    for (provider of visibleProviders) {
      provider.highlighted = highlightedProviders.includes(provider.id)
        ? "highlighted"
        : "not-highlighted";
    }
    return convertProvidersToGeoJSON(visibleProviders);
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
    let userSearch = ![1, "default"].includes(
      this.props.search.currentLocation
    );

    if (distance || userSearch) {
      const centerMarker = createCenterMarker();
      const mapPin = new mapboxgl.Marker({ element: centerMarker })
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
    }

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
    providerIds =
      providerIds ||
      filterProviderIds(
        providersById(this.props.visibleProviders),
        this.props.highlightedProviders
      );
    if (providerIds.length > 0) {
      this.map.fitBounds(
        getBoundingBox(providersById(this.props.visibleProviders), providerIds),
        {
          // Left padding accounts for provider list UI.
          padding: { top: 100, bottom: 100, left: 450, right: 100 },
          duration: 2000,
          maxZoom: 13,
          linear: false
        }
      );
    }
  };

  /**
   * Zooms to fit when there are new providers not currently in view.
   *
   * TODO: This treats all selections the same. We may want to do different things depending
   * on how the provider was selected. For example, when selecting a provider from the list,
   * maybe we should zoom to that specific provider if not in view, but when deselecting
   * a distance filter, maybe we want to zoom to fit all selected providers. Handling these
   * cases is best done using more granular props passed to the map rather than having the map
   * track changes to highlighted props.
   */
  zoomToShowNewProviders = prevProps => {
    const prevIds = filterProviderIds(
        providersById(prevProps.visibleProviders),
        prevProps.highlightedProviders
      ),
      currIds = filterProviderIds(
        providersById(this.props.visibleProviders),
        this.props.highlightedProviders
      ),
      newIds = currIds.filter(id => !prevIds.includes(id));
    if (newIds.length === 0) {
      // The set of selected providers stayed the same or got smaller, no need to zoom.
      return;
    }
    const newFeatureBounds = getBoundingBox(
        providersById(this.props.visibleProviders),
        newIds
      ),
      mapBounds = this.map.getBounds();
    if (
      newFeatureBounds.getNorth() > mapBounds.getNorth() ||
      newFeatureBounds.getEast() > mapBounds.getEast() ||
      newFeatureBounds.getSouth() < mapBounds.getSouth() ||
      newFeatureBounds.getWest() < mapBounds.getWest()
    ) {
      this.zoomToFit(currIds);
    }
  };

  componentDidUpdate(prevProps) {
    if (this.state.loaded) {
      const features = this.geoJSONFeatures();
      this.setSourceFeatures(features);
      this.props.loadedProviderTypeIds.map(typeId =>
        this.findLayerInMap(typeId)
      );
      this.setSpecialLayerInMap("highlighted", "highlighted");
      this.updatePinAndDistanceIndicator(prevProps);
      this.zoomToShowNewProviders(prevProps);
      if (
        this.props.filters.distance &&
        this.props.filters.distance !== prevProps.filters.distance
      ) {
        this.map.flyTo({
          center: this.props.search.coordinates,
          zoom: this.zoomToDistance(this.props.filters.distance)
        });
      }
      if (
        this.props.search.flyToProviderKey !== prevProps.search.flyToProviderKey
      ) {
        const { flyToProviderId } = this.props.search;
        const { coordinates } = providersById(this.props.visibleProviders)[
          flyToProviderId
        ];
        this.map.flyTo({
          center: coordinates,
          zoom: 15
        });
      }
      if (this.props.search.zoomToFitKey !== prevProps.search.zoomToFitKey) {
        this.zoomToFit();
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
