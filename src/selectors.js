import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import * as turf from "@turf/turf";

export default function getProvidersByDistance( providers, distance ) {

    const searchCenter = [-71.066954, 42.359947];
    const distances = providers.map(provider => {
      return {
        provider: provider,
        distance: turf.distance(
          turf.point(provider.coordinates),
          turf.point(searchCenter)
        )
      };
    });

    const closePlaces = distances
      .filter(el => el.distance < distance)
      .map(el => el.provider);

    console.log(closePlaces.length, "of", providers.length, "within", distance, "miles");

  // clearFilter = () => {
  //   let { filterDistance, providers } = this.props;
  //   filterDistance(providers);
  // };

  return closePlaces;
}