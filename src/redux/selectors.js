import { distance, point } from "@turf/turf";
import { createSelector } from "reselect";

const getProviderTypesIds = state => state.providerTypes.allIds;
const getProviderTypesById = state => state.providerTypes.byId;
const getProvidersById = state => state.providers.byId;
const getDistance = state => state.filters.distance;
const getSavedProvidersIds = state => state.providers.savedProviders;
const getHighlightedProvidersList = state => state.highlightedProviders;
const getSearchCoordinates = state => state.search.coordinates;

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
    if (distance) {
      const options = { units: "miles" };
      const refLocation = searchCoordinates;
      return sortedByDistance(
        providerTypesIds,
        providerTypesById,
        providersById,
        distance,
        refLocation,
        options
      );
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
  [getSavedProvidersIds, getProvidersById],
  (savedProvidersIds, providersById) =>
    savedProvidersIds.map(id => providersById[id])
);

export const getHighlightedProviders = createSelector(
  [getProvidersById, getHighlightedProvidersList],
  (providersById, highlightedProvidersList) => {
    return highlightedProvidersList.map(id => providersById[id]);
  }
);

function sortedByDistance(
  providerTypesIds,
  providerTypesById,
  providersById,
  filterDistance,
  refLocation,
  options
) {
  let providersList = [];
  providerTypesIds.map(typeId => {
    let providerArray = [];
    providerTypesById[typeId].providers.forEach(provId => {
      const provDistance = distance(
        point(providersById[provId].coordinates),
        point(refLocation),
        options
      );
      if (provDistance < filterDistance) {
        providerArray.push({
          // New object with the distance attached
          ...providersById[provId],
          distance: provDistance
        });
      }
    });
    // Sort the list by distance
    const sortedProviders = providerArray.sort(
      (a, b) => a.distance - b.distance
    );
    providersList.push({
      id: typeId,
      name: providerTypesById[typeId].name,
      providers: sortedProviders
    });
  });
  return providersList;
}
