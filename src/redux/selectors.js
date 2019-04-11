import { distance, point } from "@turf/turf";
import { createSelector } from "reselect";

const getProviderTypesIds = state => state.providerTypes.allIds;
const getProviderTypesById = state => state.providerTypes.byId;
const getProvidersById = state => state.providers.byId;
const getDistance = state => state.filters.distance;
const getSavedProvidersIds = state => state.providers.savedProviders;
const getHighlightedProvidersList = state => state.highlightedProviders;
const getSearchCoordinates = state => state.search.history[state.search.currentLocation].coordinates;

export const getProvidersSorted = createSelector(
  [
    getProviderTypesIds,
    getProviderTypesById,
    getProvidersById,
    getDistance,
    getSearchCoordinates
  ],
  (
    providerTypesIds,
    providerTypesById,
    providersById,
    distance,
    searchCoordinates
  ) => {
    const sortBy = "DISTANCE"; // TODO: remove after implementing alphabetical sort and tracking sort method in state
    if (sortBy === "DISTANCE") {
      const options = { units: "miles" };
      const refLocation = searchCoordinates;
      const providersList = providerTypesIds.map(typeId => ({
        id: typeId,
        name: providerTypesById[typeId].name,
        providers: getProvidersWithDistance(
          providerTypesById[typeId].providers, // array of id's
          providersById,
          refLocation,
          options
        )
      }));
      return providersList;
    } else {
      const providersList = providerTypesIds.map(typeId => ({
        id: typeId,
        name: providerTypesById[typeId].name,
        providers: providerTypesById[typeId].providers.map(
          id => providersById[id]
        )
      }));
      return providersList;
    }
  }
);

export const getSavedProviders = createSelector(
  [getSavedProvidersIds, getProvidersById, getSearchCoordinates],
  (savedProvidersIds, providersById, searchCoordinates) =>
    savedProvidersIds.map(id => {
      const provDistance = distance(
        // TODO use coordinates from search history when provider was saved
        point(providersById[id].coordinates),
        point(searchCoordinates),
        { units: "miles" }
      )
      return {
        ...providersById[id],
        distance: provDistance
      }
    })
);

export const getHighlightedProviders = createSelector(
  [getProvidersById, getHighlightedProvidersList],
  (providersById, highlightedProvidersList) => {
    return highlightedProvidersList.map(id => providersById[id]);
  }
);

function getProvidersWithDistance(
  providersArray,
  providersById,
  refLocation,
  options
) {
  var referencePoint = point(refLocation);
  var providers = providersArray.map( providerId => {
    let provider = providersById[providerId];
    // New object with the distance attached
    return {
      ...provider,
      distance: distance(point(provider.coordinates), referencePoint, options)
    }
  })
  return sortByDistance(providers)
}

function sortByDistance(providerArray) {
    // Sort the list by distance
    return providerArray.sort(
      (a, b) => a.distance - b.distance
    );
}