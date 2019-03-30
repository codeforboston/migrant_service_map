import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "./map.css";
import { point, transformTranslate, circle } from "@turf/turf";
import typeImages from "../../assets/images";

mapboxgl.accessToken =
  "pk.eyJ1IjoicmVmdWdlZXN3ZWxjb21lIiwiYSI6ImNqZ2ZkbDFiODQzZmgyd3JuNTVrd3JxbnAifQ.UY8Y52GQKwtVBXH2ssbvgw";

function featureToProvider({ id, geometry: { coordinates }, properties }) {
  return { id, coordinates, ...properties };
}

class Map extends Component {
  constructor(props) {
    super(props);
    this.map = null;
  }

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
    this.map.on("click", typeId, e => {
      let provider = featureToProvider(e.features[0]);
      this.props.displayProviderInformation(provider.id);
    });
  };

  updateSource = id => {
    let { providerTypes } = this.props;
    if (!this.map.getSource(id)) {
      this.addSourceToMap(id);
    }
    if (!this.map.getLayer(id)) {
      this.addLayerToMap(id);
    }
    const features = providerTypes.visible.includes(id)
      ? this.convertProvidersToGeoJSON(providerTypes.byId[id].providers)
      : [];
    this.map.getSource(id).setData({
      type: "FeatureCollection",
      features: features
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

    map.addControl(geocoder);

    geocoder.on("result", ev => {
      this.props.setSearchCenterCoordinates(ev.result.geometry.coordinates);
      this.addDistanceIndicator();
    });
  }

  addDistanceIndicator = () => {
    //TODO: make this input from the distance filter
    const distanceFilterDistances = [0.5, 1, 1.5];
    const { search } = this.props;

    this.removeDistanceMarkers();
    if (!this.map.getSource("distance-indicator-source")) {
      this.map.addSource("distance-indicator-source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        }
      });
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
    const colors = ["#007cbf", "#00AA46", "#71C780", "#D5EDDB"];
    const center = this.createCenterMarker().setLngLat(search.coordinates);
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
      const marker = this.createDistanceMarker(radius, colors[i]);
      return marker.setLngLat(radiusOffset.geometry.coordinates);
    });

    labels.map(label => label.addTo(this.map));
    center.addTo(this.map);
    this.map
      .getSource("distance-indicator-source")
      .setData({ type: "FeatureCollection", features: circles });
  };

  createDistanceMarker = (distance, color) => {
    const markerElement = document.createElement("div");
    markerElement.className = "distanceMarker";
    markerElement.id = "marker-" + distance + "-miles";
    markerElement.style.display = "block";
    markerElement.innerText = distance + (distance > 1 ? " miles" : " mile");
    markerElement.style.backgroundColor = color;
    return new mapboxgl.Marker({
      element: markerElement
    });
  };

  removeDistanceMarkers = () => {
    const distanceMarkers = Array.from(
      document.getElementsByClassName("distanceMarker")
    );
    return distanceMarkers.map(marker => marker.remove());
  };

  createCenterMarker = () => {
    const markerElement = document.createElement("div");
    markerElement.className = "searchCenterMarker";
    markerElement.id = "searchCenterMarker";
    markerElement.style.display = "block";
    markerElement.style.height = "20px";
    markerElement.style.width = "20px";
    markerElement.style.borderRadius = "10px";
    markerElement.style.backgroundColor = "#0f0";
    return new mapboxgl.Marker({
      element: markerElement
    });
  };
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
    const { providerTypes } = this.props;
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
