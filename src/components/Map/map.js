import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "./map.css";
import { point, transformTranslate, circle } from "@turf/turf";
import typeImages from "assets/images";
import distances from "assets/distances";
import _ from "lodash";
import {
  centerMarker,
  createDistanceMarker,
  removeDistanceMarkers,
  addDistanceFilterLayer,
  addSourceToMap,
  addCircleLayerToMap,
  addPointSourceToMap,
  removeReferenceLocation,
  togglePinMarker
} from "./mapHelpers.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoicmVmdWdlZXN3ZWxjb21lIiwiYSI6ImNqZ2ZkbDFiODQzZmgyd3JuNTVrd3JxbnAifQ.UY8Y52GQKwtVBXH2ssbvgw";

class Map extends Component {
  constructor(props) {
    super(props);
    this.map = null;
  }

  updateSource = id => {
    const { providersList } = this.props;
    const providerTypesById = _.keyBy(providersList, "id");
    if (!this.map.getSource(id)) {
      addSourceToMap(id, this.map);
    }
    if (!this.map.getLayer(id)) {
      this.addProviderTypeLayerToMap(id, this.map);
    }

    const isVisible = providerTypesById[id] ? true : false;
    const features = isVisible ? this.convertProvidersToGeoJSON(
      providerTypesById[id].providers
    ) : [];
    this.map.getSource(id).setData({
      type: "FeatureCollection",
      features: features
    });
  };

  updatePointSource = (sourceName, idArray) => {
    const { providers } = this.props;
    if (!this.map.getSource(sourceName)) {
      addPointSourceToMap(sourceName, this.map);
    }
    if (!this.map.getLayer(sourceName)) {
      addCircleLayerToMap(sourceName, sourceName, this.map);
    }
    const newPoints = idArray.map(id => point(providers.byId[id].coordinates));
    this.map.getSource(sourceName).setData({
      type: "FeatureCollection",
      features: newPoints
    });
  };

  addProviderTypeLayerToMap = (typeId, map) => {
    let { displayProviderInformation } = this.props;
    map.addLayer({
      id: typeId,
      source: typeId,
      type: "symbol",
      layout: {
        "icon-image": typeId + "icon",
        "icon-size": 0.25,
        visibility: "visible"
      }
    });
    map.on("click", typeId, e => {
      const offsetTop = document.getElementById(
        `provider-${e.features[0].properties.id}`
      ).offsetTop;
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
    const { providerTypes, setMapObject } = this.props;
    const map = new mapboxgl.Map({
      container: "map", // container id
      style: "mapbox://styles/refugeeswelcome/cjh9k11zz15ds2spbs4ld6y9o", // stylesheet location
      center: mapCenter,
      zoom: 11 // starting zoom
    });
    setMapObject(map);

    map.on("load", () => {
      this.removeLayersFromOldDataSet();
      const providerFeatures = map.querySourceFeatures("composite", {
        sourceLayer: "Migrant_Services_-_MSM_Final_1"
      });
      const normalizedProviders = this.normalizeProviders(providerFeatures);
      this.props.initializeProviders(normalizedProviders);
      let { displayProviderInformation } = this.props;
      providerTypes.allIds.forEach(typeId => {
        addSourceToMap(typeId);
        this.addProviderTypeLayerToMap(
          typeId,
          this.map,
          displayProviderInformation
        );
      });
      addPointSourceToMap("highlightedProviders", this.map);
      addCircleLayerToMap(
        "highlightedProviders",
        "highlightedProviders",
        this.map
      );
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
    const { search } = this.props;
    removeDistanceMarkers();
    addDistanceFilterLayer(distanceFilterDistances, this.map);

    const colors = ["#007cbf", "#00AA46", "#71C780", "#D5EDDB"];
    const center = this.createMarker(centerMarker).setLngLat(
      search.coordinates
    );
    const options = { steps: 100, units: "miles" };
    const circles = distanceFilterDistances.map((radius, i) =>
      circle(search.coordinates, radius, {
        ...options,
        properties: { color: colors[i], "stroke-width": radius }
      })
    );
    const labels = distanceFilterDistances.map((radius, i) => {
      const radiusOffset = transformTranslate(
        point(search.coordinates),
        radius,
        90,
        { units: "miles" }
      );
      const marker = this.createMarker(createDistanceMarker(radius, colors[i]));
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

  normalizeProviders = providerFeatures => {
    const providerTypes = { byId: {}, allIds: [] };
    const providers = { byId: {}, allIds: [] };
    Array.from(providerFeatures).map(
      ({ id, geometry: { coordinates }, properties }, index) => {
        let formattedTypeId = properties["Type of Service"]
          .toLowerCase()
          .split(" ")
          .join("-");
        id = index;
        const typeExists = providerTypes.allIds.includes(formattedTypeId);
        if (formattedTypeId === "community-center") {
          // special case
          formattedTypeId = "community-centers";
        }
        if (typeExists) {
          providerTypes.byId[formattedTypeId] = {
            ...providerTypes.byId[formattedTypeId],
            id: formattedTypeId,
            name: properties["Type of Service"],
            providers: [...providerTypes.byId[formattedTypeId].providers, id]
          };
        } else {
          if (!providerTypes.allIds.includes(formattedTypeId)) {
            providerTypes.allIds.push(formattedTypeId);
          }
          providerTypes.byId[formattedTypeId] = {
            id: formattedTypeId,
            name: properties["Type of Service"],
            providers: [id]
          };
        }

        return (providers.byId[id] = {
          id,
          coordinates,
          address:
            properties[
              "Address (#, Street Name, District/city, State, Zip Code)"
            ],
          email: properties["Email:"],
          mission: properties["Mission:"],
          name: properties["Organization Name"],
          telephone: properties["Telephone:"],
          timestamp: properties.Timestamp,
          // Type of Service
          typeName: properties["Type of Service"], // synonym for next line
          "Type of Service": properties["Type of Service"], // as referenced in reducer helper function
          // Validated By
          website: properties.Website
        });
      }
    );
    // sorted by name
    providerTypes.allIds.map(id => {
      const providersByType = providerTypes.byId[id].providers;
      return providersByType.sort((a, b) =>
        providers.byId[a].name.localeCompare(providers.byId[b].name)
      );
    });
    // commit map query result to redux
    return { providerTypes, providers };
  };

  componentDidUpdate(prevProps) {
    const { highlightedProviders, providerTypes } = this.props;
    this.updatePointSource("highlightedProviders", highlightedProviders);
    providerTypes.allIds.forEach(id => {
      this.updateSource(id);
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
