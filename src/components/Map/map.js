import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import * as turf from "@turf/turf";
import { insertPopup } from "../PopUp.js";
import typeImages from "../../assets/images";
import "./map.css";

//Fix this later
const longitude = -71.066954;
const latitude = 42.359947;

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
    //TODO DELETE IF AFTER FINISHING getProvidersSorted SELECTOR
    /*if (providerTypes && filters.distance) {
      this.map.getSource(id).setData({
        type: "FeatureCollection",
        features: this.convertProvidersToGeoJSON(
          getProvidersByDistance(
            search.coordinates,
            providerTypes.byId[id].providers,
            filters.distance
          )
        )
      });
    } else {*/
    this.map.getSource(id).setData({
      type: "FeatureCollection",
      features: this.convertProvidersToGeoJSON(providerTypes.byId[id].providers)
    });
    //}
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

  removeBufferCircles = layerName => {
    if (this.map.getLayer(layerName)) {
      this.map.removeLayer(layerName);
      this.map.removeSource(layerName);
    }
  };

  loadProviderTypeImage = images => {
    images.map(typeImage =>
      this.map.loadImage(typeImage.url, (error, image) => {
        if (error) throw error;
        this.map.addImage(`${typeImage.type}icon`, image);
      })
    );
  };

  addGeocoderLayers = (id, color, center, radius) => {
    const options = {
      steps: 100,
      units: "miles"
    };
    let circle = turf.circle(center, radius, options);
    this.map.addLayer({
      id: id,
      type: "line",
      source: {
        type: "geojson",
        data: circle
      },
      paint: {
        "line-color": color,
        "line-opacity": 0.8,
        "line-width": 10,
        "line-offset": 5
      },
      layout: {}
    });
  };

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: "map", // container id
      style: "mapbox://styles/refugeeswelcome/cjh9k11zz15ds2spbs4ld6y9o", // stylesheet location
      center: [-71.066954, 42.359947], // starting position [lng, lat]
      zoom: 11 // starting zoom
    });

    var geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      proximity: { longitude, latitude }
    });

    // TODO: make this input from the distance filter
    const distanceFilterDistances = [0.5, 1, 2, 3];

    geocoder.on("result", ev => {
      const centerCoordinates = ev.result.geometry.coordinates;
      const distanceMarkers = Array.from(
        document.getElementsByClassName("distanceMarker")
      );
      distanceMarkers.map(marker => marker.remove());
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
            "line-width": ["*", distanceFilterDistances[2], 3],
            "line-offset": 5
          }
        });
      }

      if (!this.map.getSource("single-point")) {
        this.map.addSource("single-point", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: []
          }
        });
        this.map.addLayer({
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

      const center = color => {
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
        };
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
        });
      };

      const options = { steps: 100, units: "miles" };
      const circles = distanceFilterDistances.map((radius, i) =>
        turf.circle(center(colors[i]), radius, options)
      );

      const labels = distanceFilterDistances.map((radius, i) => {
        const centerPoint = turf.point(centerCoordinates);
        console.log(centerCoordinates, centerPoint);
        const radiusOffset = turf.transformTranslate(centerPoint, radius, 90, {
          units: "miles"
        });
        const marker = createDistanceMarker(radius, colors[i]);
        return marker
          .setLngLat(radiusOffset.geometry.coordinates)
          .addTo(this.map);
      });

      this.map.getSource("single-point").setData(ev.result.geometry);
      this.map
        .getSource("distance-indicator-source")
        .setData({ type: "FeatureCollection", features: circles });
    });

    this.map.addControl(geocoder);

    this.loadProviderTypeImage(typeImages);

    this.map.on("load", () => {
      // remove data layers created by mapbox
      const layers = this.map.getStyle().layers;
      for (let i = 100; i < 110; i++) {
        this.map.removeLayer(layers[i].id);
      }

      // get service providers info from mapbox from the new data
      const providerFeatures = this.map.querySourceFeatures("composite", {
        sourceLayer: "Migrant_Services_-_MSM_Final_1"
      });

      const normalizedProviders = this.normalizeProviders(providerFeatures);
      this.props.initializeProviders(normalizedProviders);
    });
  }

  normalizeProviders = providerFeatures => {
    const providerTypes = { byId: {}, allIds: [] };
    const providers = { byId: {}, allIds: [] };
    Array.from(providerFeatures).map(
      ({ id, geometry: { coordinates }, properties }, index) => {
        id = index;
        let formattedTypeId = properties["Type of Service"]
          .toLowerCase()
          .split(" ")
          .join("-");
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

        providers.byId[id] = {
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
        };
        providers.allIds.push(id);
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

  handleMapClick(e) {
    let coordinates = e.features[0].geometry.coordinates.slice();
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    insertPopup(this.map, coordinates, e.features[0].properties);
  }

  reflectLayerVisibility = providerTypes => {
    providerTypes.allIds.forEach(id => {
      this.updateSource(id);
      const isVisible = providerTypes.visible.includes(id) ? "visible" : "none";
      return this.map.setLayoutProperty(id, "visibility", isVisible);
    });
  };

  componentDidUpdate(prevProps) {
    const { providerTypes } = this.props;
    if (prevProps.providerTypes.visible !== providerTypes.visible) {
      this.reflectLayerVisibility(providerTypes);
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
