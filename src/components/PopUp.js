import mapboxgl from 'mapbox-gl'; 

export const setPopUp = ( name, website, bio, telephone, coordinates, map ) => {
    return new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML('<h4>' + name + '</h4><a href=' + website + '>' + website + '</a><br><br><i>' + bio + '</i><br><br><b>Telephone: </b>' + telephone)
    .addTo(map)
}