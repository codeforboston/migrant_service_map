import iconColors from "../../assets/icon-colors";
import mapboxgl from "mapbox-gl";
import memoizeOne from 'memoize-one';
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

const normalizeProviders = providerFeatures => {
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
        typeId: formattedTypeId,
        "Type of Service": properties["Type of Service"], // as referenced in reducer helper function
        // Validated By
        website: properties.Website,
        color: iconColors.formattedTypeId
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

const getBoundingBox = (providersById, providerIds) => {
  const providers = lookupProviders(providersById, providerIds),
    lngs = providers.map(provider => provider.coordinates[0]),
    lats = providers.map(provider => provider.coordinates[1]);

  const maxLngs = lngs.reduce((a, b) => Math.max(a, b));
  const minLngs = lngs.reduce((a, b) => Math.min(a, b));
  const maxLats = lats.reduce((a, b) => Math.max(a, b));
  const minLats = lats.reduce((a, b) => Math.min(a, b));

  return mapboxgl.LngLatBounds.convert([
    [minLngs, minLats],
    [maxLngs, maxLats]
  ]);
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
  normalizeProviders,
  removeDistanceMarkers,
  getBoundingBox,
  lookupProviders,
  filterProviderIds,
  providersById
};
