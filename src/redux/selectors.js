import * as turf from "@turf/turf";
import { createSelector } from "reselect";

const getProviderTypesIds = state => state.providerTypes.allIds;
const getProviderTypesById = state => state.providerTypes.byId;
const getProvidersById = state => state.providers.byId;
const getDistance = state => state.filters.distance;

export const getProvidersSorted = createSelector(
  [getProviderTypesIds, getProviderTypesById, getProvidersById, getDistance],
  (providerTypesIds, providerTypesById, providersById, distance) => {
    if (distance) {
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

export default function getProvidersByDistance(
  refLocation,
  providers,
  distance = null
) {
  debugger;
  refLocation = refLocation || [-71.066954, 42.359947];

  var distances = providers.map(provider => {
    return {
      provider: provider,
      distance: turf.distance(
        turf.point(provider.coordinates),
        turf.point(refLocation)
      )
    };
  });

  if (distance) {
    distances = distances.filter(el => el.distance < distance);
  }

  const closePlaces = distances
    .sort((ela, elb) => ela.distance - elb.distance)
    .map(el => el.provider); //WHY?
  console.log(
    closePlaces.length,
    "of",
    providers.length,
    "within",
    distance,
    "miles"
  );

  return closePlaces;
}
