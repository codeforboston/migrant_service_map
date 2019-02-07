import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import * as turf from "@turf/turf";

  setFilter = e => {
    let { filterDistance, searchCenter, providers } = this.props;
    const distance = e.target.value;
    const distances = providers.map(provider => {
      return {
        provider: provider,
        distance: turf.distance(
          turf.point(provider.geometry.coordinates),
          turf.point(searchCenter)
        )
      };
    });
    const closePlaces = distances
      .filter(el => el.distance < distance)
      .map(el => el.provider);

    console.log(closePlaces);

    filterDistance(closePlaces);

    this.setState({ distanceVisible: distance });
  };

  clearFilter = () => {
    let { filterDistance, providers } = this.props;
    filterDistance(providers);
  };
