import React, { Component } from "react";
import mapboxgl from "./mapbox-gl-wrapper";
import "./map.css";
import { circle, point, transformTranslate } from "@turf/turf";
import typeImages from "assets/images";
import distances from "assets/distances";
import {
  convertProvidersToGeoJSON,
  createCenterMarker,
  createDistanceMarker,
  removeDistanceMarkers,
  getProviderBoundingBox,
  filterProviderIds,
  providersById,
  getBoundingBox
} from "./utilities.js";
import { AnimatedMarker } from "../AnimatedMarker/animated-marker.js";

const zoomPadding = { top: 100, bottom: 100, left: 450, right: 100 };

// The map has a zoom level between 0 (zoomed entirely out)
// and 22 (zoomed entirely in). Zoom level is configured as integers but
// the map can zoom to decimal values. The effective zoom level is
// Math.floor(map.getZoom()).
const MAX_CLUSTERED_ZOOM = 14,
  MIN_UNCLUSTERED_ZOOM = 15;

class Map extends Component {
  constructor(props) {
    super(props);
    this.map = null;
    this.markerList = []; //need to keep track of marker handles ourselves -- cannot be queried from map
    this.mapRef = React.createRef();
    this.state = {
      loaded: false
    };
  }

  onMapLoaded = () => {
    // Initialize static sources and layers. Layers for provider icons are
    // added as they're enabled in the UI. Layers are drawn in the order they
    // are added to the map.
    this.setSingleSourceInMap();
    this.addDistanceIndicatorLayer();
    this.findClustersInMap();

    this.loadProviderTypeImage(typeImages);
    this.setState({ loaded: true });
  };

  componentDidMount() {
    const { mapCenter } = this.props.search;
    const map = new mapboxgl.Map({
      container: this.mapRef.current,
      style: "mapbox://styles/refugeeswelcome/cjxmgxala1t5b1dtea37lbi2p", // stylesheet location
      center: mapCenter,
      zoom: 11 // starting zoom
    });
    map.addControl(new mapboxgl.NavigationControl());
    map.on("load", this.onMapLoaded);

    this.map = map;
  }

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
        clusterMaxZoom: MAX_CLUSTERED_ZOOM,
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
    this.map.on("click", clusterName, e => {
      let features = this.map.queryRenderedFeatures(e.point, {
        layers: [clusterName]
      });

      let clusterId = features[0].properties.cluster_id;
      this.map
        .getSource("displayData")
        .getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;

          const mapZoom = this.map.getZoom();
          this.map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: mapZoom >= zoom ? mapZoom + 1 : zoom
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

  markRecentSelection(prevProps, mapBounds) {
    let { visibleProviders, highlightedProviders } = this.props;
    const newSelection = highlightedProviders.find(
      providerId => !prevProps.highlightedProviders.includes(providerId)
    );
    if (!newSelection) {
      return;
    }
    const provider = visibleProviders.find(
      provider => provider.id === newSelection
    );
    const marker = new AnimatedMarker(provider);
    marker.addTo(this.map, mapBounds);
  }

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
    let userSearch = this.props.search.currentLocation !== "default";

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
      zoom: this.getZoomForDistance(zoom)
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
        getProviderBoundingBox(
          providersById(this.props.visibleProviders),
          providerIds
        ),
        {
          // Left padding accounts for provider list UI.
          padding: zoomPadding,
          duration: 2000,
          maxZoom: MIN_UNCLUSTERED_ZOOM,
          linear: false
        }
      );
    }
  };

  getPaddedMapBounds() {
    const width = this.mapRef.current.clientWidth,
      height = this.mapRef.current.clientHeight,
      leftX = zoomPadding.left,
      topY = zoomPadding.top,
      rightX = width - zoomPadding.right,
      bottomY = height - zoomPadding.bottom;
    return getBoundingBox([
      this.map.unproject([leftX, topY]),
      this.map.unproject([rightX, topY]),
      this.map.unproject([rightX, bottomY]),
      this.map.unproject([leftX, bottomY])
    ]);
  }

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
  zoomToShowNewProviders = (prevProps, mapBounds) => {
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
    const newFeatureBounds = getProviderBoundingBox(
      providersById(this.props.visibleProviders),
      newIds
    );
    if (
      newFeatureBounds.getNorth() > mapBounds.getNorth() ||
      newFeatureBounds.getEast() > mapBounds.getEast() ||
      newFeatureBounds.getSouth() < mapBounds.getSouth() ||
      newFeatureBounds.getWest() < mapBounds.getWest()
    ) {
      this.zoomToFit(currIds);
    }
  };

  getZoomForDistance = distance => {
    let resolution = window.screen.height;
    let latitude = this.props.search.coordinates[1];
    let milesPerPixel = (distance * 8) / resolution;
    return (
      Math.log2(
        (24901 * Math.cos((latitude * Math.PI) / 180)) / milesPerPixel
      ) - 8
    );
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
      const mapBounds = this.getPaddedMapBounds();
      this.markRecentSelection(prevProps, mapBounds);
      this.zoomToShowNewProviders(prevProps, mapBounds);
      if (
        this.props.filters.distance &&
        this.props.filters.distance !== prevProps.filters.distance
      ) {
        this.map.flyTo({
          center: this.props.search.coordinates,
          zoom: this.getZoomForDistance(this.props.filters.distance)
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
          zoom: MIN_UNCLUSTERED_ZOOM
        });
      }
      if (this.props.search.zoomToFitKey !== prevProps.search.zoomToFitKey) {
        this.zoomToFit();
      }
      if (this.props.search.searchKey !== prevProps.search.searchKey) {
        this.map.flyTo({
          center: this.props.search.coordinates,
          zoom: this.getZoomForDistance(this.props.filters.distance || 1.5)
        });
      }
    }
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    return <div className="map" ref={this.mapRef} />;
  }
}

export default Map;
