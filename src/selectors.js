import * as turf from "@turf/turf";

export default function getProvidersByDistance( searchCenter, providers, distance = null ) {
    searchCenter = searchCenter || [-71.066954, 42.359947];
    
    var distances = providers.map(provider => {
      return {
        provider: provider,
        distance: turf.distance(
          turf.point(provider.coordinates),
          turf.point(searchCenter)
        )
      };
    });

    if (distance) { distances = distances.filter(el => el.distance < distance) }

    const closePlaces = distances
      .sort( (ela,elb) => ela.distance - elb.distance )
      .map(el => el.provider);

    console.log(closePlaces.length, "of", providers.length, "within", distance, "miles");


  return closePlaces;
}