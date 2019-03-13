import * as turf from "@turf/turf";

export function getProvidersByDistance( refLocation, providers, distance = null ) {
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

    if (distance) { distances = distances.filter(el => el.distance < distance) }

    const closePlaces = distances
      .sort( (ela,elb) => ela.distance - elb.distance )
      .map(el => el.provider);

    console.log(closePlaces.length, "of", providers.length, "within", distance, "miles");


  return closePlaces;
}


  
export function getProvidersByName(providers, name) {
   if (name && name.length) {
        providers = providers.filter(
            provider => provider.name.startsWith(name));
   }
   return providers;
 }
