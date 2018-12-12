import React from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import './index.css';
import { getCategories, getResourceObject } from './map-services.js';
import Menu from "./components/Menu";


mapboxgl.accessToken = 'pk.eyJ1IjoicmVmdWdlZXN3ZWxjb21lIiwiYSI6ImNqZ2ZkbDFiODQzZmgyd3JuNTVrd3JxbnAifQ.UY8Y52GQKwtVBXH2ssbvgw';


class Map extends React.Component {
    constructor(props){
        super(props); 
        this.state = {
            providers: [], 
            resourcesObject: {}, 
            categoriesList: []
        }
   }
  
    componentDidMount() {
        console.log('map comp loaded');
       
        let map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/refugeeswelcome/cjh9k11zz15ds2spbs4ld6y9o', // stylesheet location
            center: [-71.066954, 42.359947], // starting position [lng, lat]
            zoom: 11 // starting zoom
        });
        
    
        var geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken
        });

        map.addControl(geocoder);

        map.on('load', () => {
            const providers = map.querySourceFeatures('composite', {sourceLayer: 'refugees-services'});
            const categoriesList = getCategories(providers); 
            const resourcesObject = getResourceObject(providers); 
            this.setState({providers: providers,
                    categoriesList: categoriesList, 
                    resourcesObject: resourcesObject});

        map.on('click', (e) => this.popUp(e, map)); 

        map.addSource('single-point', {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": []
            }
        });
        // map.addSource('single-point', {
        //     "type": "geojson",
        //     "data": {
        //         "type": "FeatureCollection",
        //         "features": []
        //     }
        // });
        map.addLayer({
            "id": "point",
            "source": "single-point",
            "type": "circle",
            "paint": {
                "circle-radius": 10,
                "circle-color": "#007cbf"
            }
        });

        geocoder.on('result', function (ev) {
            map.removeLayer('circle-outline');
            map.removeLayer('circle-outline-two');
            map.removeLayer('circle-outline-three');
            map.removeLayer('circle-outline-four');
            map.getSource('single-point').setData(ev.result.geometry);
            var center = {
                "type": "Feature",
                "properties": {
                    "marker-color": "#0f0"
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": ev.result.geometry.coordinates
                }
            };
            var radius = .5;
            var options = {
                steps: 100,
                units: 'miles'
            };
            var circle = MapboxGeocoder.turf.circle(center, radius, options);
            map.addLayer({
                "id": "circle-outline",
                "type": "line",
                "source": {
                    "type": "geojson",
                    "data": circle
                },
                "paint": {
                    "line-color": "#046328",
                    "line-opacity": 0.8,
                    "line-width": 10,
                    "line-offset": 5
                },
                "layout": {}
            });
            var radiusTwo = 1;
            var circleTwo = MapboxGeocoder.turf.circle(center, radiusTwo, options);
            map.addLayer({
                "id": "circle-outline-two",
                "type": "line",
                "source": {
                    "type": "geojson",
                    "data": circleTwo
                },
                "paint": {
                    "line-color": "#00AA46",
                    "line-opacity": 0.8,
                    "line-width": 10,
                    "line-offset": 5
                },
                "layout": {}
            });
            var radiusThree = 3;
            var circleThree = MapboxGeocoder.turf.circle(center, radiusThree, options);
            map.addLayer({
                "id": "circle-outline-three",
                "type": "line",
                "source": {
                    "type": "geojson",
                    "data": circleThree
                },
                "paint": {
                    "line-color": "#71C780",
                    "line-opacity": 0.8,
                    "line-width": 10,
                    "line-offset": 5
                },
                "layout": {}
            });
            var radiusFour = 5;
            var circleFour = MapboxGeocoder.turf.circle(center, radiusFour, options);
            map.addLayer({
                "id": "circle-outline-four",
                "type": "line",
                "source": {
                    "type": "geojson",
                    "data": circleFour
                },
                "paint": {
                    "line-color": "#D5EDDB",
                    "line-opacity": 0.8,
                    "line-width": 10,
                    "line-offset": 5
                },
                "layout": {}
            });
        });
    });  
};

popUp = (e) => {
    // var coordinates = e.features[0].geometry.coordinates.slice();
    // var name = e.features[0].properties.name;
    // var website = e.features[0].properties.website;
    // var bio = e.features[0].properties.bio;
    // var telephone = e.features[0].properties.telephone;
    // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    //     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    // }
    
    // new mapboxgl.Popup()
    //     .setLngLat(coordinates)
        // .setHTML('<h4>' + name + '</h4><a href=' + website + '>' + website + '</a><br><br><i>' + bio + '</i><br><br><b>Telephone: </b>' + telephone)
        // .addTo(map);
}; 


    componentWillUnmount() {
        this.map.remove();
    }



    render(){
        return (
        <div className='map-container' >
            <Menu categoriesList={this.state.categoriesList}
                  resourcesObject={this.state.resourcesObject} />
            <div id='map'
                className='map'
                ref={el => this.mapContainer = el}
                >
            </div> 
        </div>
        )
    };
}; 

export default Map;