import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "./map.css";
import { point, transformTranslate, circle } from "@turf/turf";
import typeImages from "../../assets/images";
import {
  centerMarker,
  createDistanceMarker,
  removeDistanceMarkers,
  addDistanceFilterLayer,
  addSourceToMap,
  addCircleLayerToMap,
  addPointSourceToMap
} from "./mapHelpers.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoicmVmdWdlZXN3ZWxjb21lIiwiYSI6ImNqZ2ZkbDFiODQzZmgyd3JuNTVrd3JxbnAifQ.UY8Y52GQKwtVBXH2ssbvgw";

class Map extends Component {
  constructor(props) {
    super(props);
    this.map = null;
  }

  updateSource = id => {
    let { providerTypes } = this.props;
    if (!this.map.getSource(id)) {
      addSourceToMap(id, this.map);
    }
    if (!this.map.getLayer(id)) {
      this.addProviderTypeLayerToMap(id, this.map);
    }
    const features = providerTypes.visible.includes(id)
      ? this.convertProvidersToGeoJSON(providerTypes.byId[id].providers)
      : [];
    this.map.getSource(id).setData({
      type: "FeatureCollection",
      features: features
    });
  };


  updatePointSource = ( sourceName, idArray ) => {
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
    console.log(typeId);
    map.addLayer({
      id: typeId,
      source: typeId,
      type: "symbol",
      layout: {
        "icon-image": typeId + "icon",
        "icon-size": 0.1,
        visibility: "visible"
      }
    });
    map.on("click", typeId, e => {
      displayProviderInformation(e.features[0].properties.id); 
    });
  };

  convertProvidersToGeoJSON = providersTypesIds => {
    const { providers } = this.props;
    return providersTypesIds.map(id => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: providers.byId[id].coordinates
      },
      properties: providers.byId[id]
    }));
  };

  loadProviderTypeImage = images => {
    images.map(typeImage =>
      this.map.loadImage(typeImage.url, (error, image) => {
        if (error) throw error;
        this.map.addImage(`${typeImage.type}icon`, image);
      })
    );
  };

  componentDidMount() {
    const { mapCenter, coordinates } = this.props.search;
    const { providerTypes } = this.props;
    const map = new mapboxgl.Map({
      container: "map", // container id
      style: "mapbox://styles/refugeeswelcome/cjh9k11zz15ds2spbs4ld6y9o", // stylesheet location
      center: mapCenter,
      zoom: 11 // starting zoom
    });

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
        this.addProviderTypeLayerToMap(typeId, this.map, displayProviderInformation);
      })
      addPointSourceToMap("highlightedProviders", this.map);
      addCircleLayerToMap("highlightedProviders", "highlightedProviders", this.map)
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

    document.getElementById('nav-search').appendChild(geocoder.onAdd(map));

    geocoder.on("result", ev => {
      this.props.setSearchCenterCoordinates(ev.result.geometry.coordinates);
      this.addDistanceIndicator();
    });
  }

  addDistanceIndicator = () => {
    //TODO: make this input from the distance filter
    const distanceFilterDistances = [0.5, 1, 1.5];
    const { search } = this.props;

    removeDistanceMarkers();
    addDistanceFilterLayer(distanceFilterDistances, this.map);

    const colors = ["#007cbf", "#00AA46", "#71C780", "#D5EDDB"];
    const center = this.createMarker(centerMarker).setLngLat(search.coordinates);
    const options = { steps: 100, units: "miles" };
    const circles = distanceFilterDistances.map((radius, i) =>
      circle(search.coordinates, radius, {
        ...options,
        properties: { color: colors[i], "stroke-width": radius }
      })
    );
    const labels = distanceFilterDistances.map((radius, i) => {
      const radiusOffset = transformTranslate(point(search.coordinates), radius, 90, { units: "miles" });
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
          category: properties["Type of Service"], // better name to map to?
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
