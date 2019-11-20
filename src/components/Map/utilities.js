import mapboxgl from "./mapbox-gl-wrapper";
import memoizeOne from "memoize-one";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faMapMarker } from "@fortawesome/free-solid-svg-icons";
import ReactDOM from "react-dom";
import React from "react";

const convertProvidersToGeoJSON = providers => {
  return providers.map(provider => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: provider.coordinates
    },
    properties: provider
  }));
};

const createCenterMarker = () => {
  const centerMarker = document.createElement("div");
  ReactDOM.render(
    <span className="fa-layers fa-fw">
      <FontAwesomeIcon
        icon={faMapMarker}
        size="2x"
        inverse
        transform="shrink-6"
      />
      <FontAwesomeIcon icon={faMapMarkerAlt} size="2x" color="#8c45cf" />
    </span>,
    centerMarker
  );
  return centerMarker;
};

const createDistanceMarker = distance => {
  const markerElement = document.createElement("div");
  markerElement.className = "distance-marker";
  markerElement.id = "marker-" + distance + "-miles";
  markerElement.innerText = distance + (distance > 1 ? " miles" : " mile");
  return markerElement;
};

const removeDistanceMarkers = markerArray => {
  // const distanceMarkers = Array.from(document.getElementsByClassName("distanceMarker"));
  return markerArray.map(marker => marker.remove());
};

const getProviderBoundingBox = (providersById, providerIds) => {
  return getBoundingBox(
    lookupProviders(providersById, providerIds).map(
      provider => provider.coordinates
    )
  );
};

const getBoundingBox = allCoordinates => {
  const bounds = new mapboxgl.LngLatBounds();
  allCoordinates.forEach(c => bounds.extend(c));
  return bounds;
};

/** Looks up all providers in the given map with an id in the given array. */
const lookupProviders = (providersById, ids) =>
  filterProviderIds(providersById, ids).map(id => providersById[id]);

/** Filters the given ids down to just those that appear in the map from id's to providers. */
const filterProviderIds = (providersById, ids) =>
  ids.filter(id => providersById.hasOwnProperty(id));

/** Converts an array of providers to a map from id to provider */
const providersById = memoizeOne(providers => {
  const byId = {};
  providers.map(provider => (byId[provider.id] = provider));
  return byId;
});

export {
  convertProvidersToGeoJSON,
  createCenterMarker,
  createDistanceMarker,
  removeDistanceMarkers,
  getProviderBoundingBox,
  getBoundingBox,
  lookupProviders,
  filterProviderIds,
  providersById
};
