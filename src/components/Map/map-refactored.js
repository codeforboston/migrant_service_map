import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "./map.css";
import { point, transformTranslate, circle } from "@turf/turf";
import typeImages from "assets/images";
import distances from "assets/distances";
import { normalizeProviders } from "./map-utilities.js";
import _ from "lodash";

mapboxgl.accessToken =
  "pk.eyJ1IjoicmVmdWdlZXN3ZWxjb21lIiwiYSI6ImNqZ2ZkbDFiODQzZmgyd3JuNTVrd3JxbnAifQ.UY8Y52GQKwtVBXH2ssbvgw";

class Map extends Component {
  constructor(props) {
    super(props);
    this.map = null;
  }

  componentDidMount() {
    const { mapCenter, coordinates } = this.props.search;
    const { providerTypes, /* setMapObject, */ initializeProviders } = this.props;

    const map = new mapboxgl.Map({
      container: "map", // container id
      style: "mapbox://styles/refugeeswelcome/cjh9k11zz15ds2spbs4ld6y9o", // stylesheet location
      center: mapCenter,
      zoom: 11 // starting zoom
    });
    // setMapObject(map);

    map.on("load", () => {
      console.log("map load");
      this.removeLayersFromOldDataSet(); //TODO remove these layers from mapbox so we don't have to do it here
      const providerFeatures = map.querySourceFeatures("composite", {
        sourceLayer: "Migrant_Services_-_MSM_Final_1"
      });
      const normalizedProviders = normalizeProviders(providerFeatures);
      initializeProviders(normalizedProviders);

      console.log("highProv work")
      this.findSourceInMap("highlightedProviders", this.map);
      this.findLayerInMap("highlightedProviders", this.map);

      // for( let typeId in providerTypes.allIds){
      //   this.findSourceInMap(typeId, this.map)
      //   this.findLayerInMap(typeId, this.map);
      // };
  
      this.loadProviderTypeImage(typeImages);
    });

    this.map = map;


    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      proximity: {
        longitude: coordinates[0],
        latitude: coordinates[1]
      }
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
      this.removeReferenceLocation();
      this.togglePinMarker(false);
      this.props.setSearchCenterCoordinates(center, 1, "");
    });
  }

  loadProviderTypeImage = images => {
    images.map(typeImage =>
      this.map.loadImage(typeImage.image, (error, image) => {
        if (error) throw error;
        this.map.addImage(`${typeImage.type}icon`, image);
      })
    );
  };

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

  findSourceInMap = (typeId, map) => {
    if (!map.getSource(typeId)) {
      map.addSource(typeId, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        }
      });
    }
    return this.map.getSource(typeId);
  };

  findLayerInMap = (typeId, map) => {
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
      this.addClickHandlerToMapIdLayer(typeId);
    }
    return map.getLayer(typeId); 
  };

  
  geoJSONFeatures = typeId => {
    let { providerTypes, highlightedProviders, providers } = this.props;
    if(!providerTypes.visible.includes(typeId) && typeId != "highlightedProviders"){
      return []
    }
    const selectProviders =
      typeId === "highlightedProviders" ? highlightedProviders : providerTypes.byId[typeId].providers;

    const features = this.convertProvidersToGeoJSON(selectProviders);
    return features;
  };

  convertProvidersToGeoJSON = providerIdArray => {
    let { providers } = this.props; 
    return providerIdArray.map(id => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: providers.byId[id].coordinates
      },
      properties: providers.byId[id]
    }));
  };


  addDistanceIndicator = () => {
    //TODO: make this input from the distance filter
    const distanceFilterDistances = distances;
    const { search } = this.props;
    this.removeDistanceMarkers();
    this.addDistanceFilterLayer(distanceFilterDistances);
    const colors = ["#007cbf", "#00AA46", "#71C780", "#D5EDDB"];
    const centerMarker = this.createCenterMarker();
    const center = new mapboxgl.Marker({ centerMarker }).setLngLat(search.coordinates); //needs purpling
    const options = { steps: 100, units: "miles" };
    const circles = distanceFilterDistances.map((radius, i) =>
      circle(search.coordinates, radius, {
        ...options,
        properties: { color: colors[i], "stroke-width": radius }
      })
    );
    const labels = distanceFilterDistances.map((radius, i) => {
      const distanceMarker = this.createDistanceMarker(radius, colors[i]);
      const marker = new mapboxgl.Marker({ distanceMarker });
      const radiusOffset = transformTranslate(point(search.coordinates), radius, 90, { units: "miles" });
      return marker.setLngLat(radiusOffset.geometry.coordinates);
    });

    labels.map(label => label.addTo(this.map));
    center.addTo(this.map);
    this.setSourceFeatures("distance-indicator-source", circles);
  };

  removeLayersFromOldDataSet = () => {
    const allLayers = this.map.getStyle().layers;
    for (let i = 100; i < 110; i++) {
      this.map.removeLayer(allLayers[i].id);
    }
  };

  removeDistanceMarkers = () => {
    const distanceMarkers = Array.from(document.getElementsByClassName("distanceMarker"));
    return distanceMarkers.map(marker => marker.remove());
  };

  togglePinMarker = show => {
    const centerMarkerContainers = Array.from(document.getElementsByClassName("map-pin-container"));
    centerMarkerContainers.map(pin => {
      return (pin.visibility = show ? "" : "hidden");
    });
  };

  removeReferenceLocation = () => {
    this.removeDistanceMarkers();
    this.togglePinMarker(false);
    this.map.removeLayer("distance-indicator");
    this.map.removeSource("distance-indicator-source");
    this.map.flyTo({
      center: [-71.066954, 42.359947],
      zoom: 12
    });
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

  addDistanceFilterLayer = distanceFilterDistances => {
    console.log("add distance filter layer");
    this.removeDistanceMarkers();
    this.findSourceInMap("distance-indicator-source", this.map);
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

  createCenterMarker = () => {
    const centerMarker = document.createElement("div");
    const centerMarkerContainer = document.createElement("div");
    const mapPin = document.createElement("div");
    const pinHole = document.createElement("div");
    mapPin.className = "map-pin";
    pinHole.className = "pin-hole";
    centerMarker.className = "map-pin-container";
    centerMarker.style.visibility = "hidden";
    centerMarkerContainer.appendChild(mapPin);
    centerMarkerContainer.appendChild(pinHole);
    centerMarker.appendChild(centerMarkerContainer);
    return centerMarker;
  };

  createDistanceMarker = (distance, color) => {
    const markerElement = document.createElement("div");
    markerElement.className = "distanceMarker";
    markerElement.id = "marker-" + distance + "-miles";
    markerElement.style.display = "block";
    markerElement.innerText = distance + (distance > 1 ? " miles" : " mile");
    markerElement.style.backgroundColor = color;
    markerElement.style.height = "12px";
    markerElement.style.width = "12px";
    markerElement.style.borderRadius = "100%";
    markerElement.style.transform = "rotate(90)";
    return markerElement;
  };

  componentDidUpdate(prevProps) {
    const { providerTypes, providersList, highlightedProviders, providers } = this.props;

    const highlightedProvidersFeatures = this.geoJSONFeatures("highlightedProviders");
    this.setSourceFeatures("highlightedProviders", highlightedProvidersFeatures);

    providerTypes.allIds.forEach(typeId => {
      this.findSourceInMap(typeId, this.map)
      this.findLayerInMap(typeId, this.map);
      const features = this.geoJSONFeatures(typeId);
      this.setSourceFeatures(typeId, features);
    });
    // debugger
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    return <div id="map" className="map" />;
  }
}

export default Map;
