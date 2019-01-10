import React from "react";
import { connect } from 'react-redux';
import mapboxgl from "mapbox-gl";
import { initializeProviders, toggleProviderVisibility } from '../actions';
// import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
// import { insertPopup, Popup } from "./PopUp.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoicmVmdWdlZXN3ZWxjb21lIiwiYSI6ImNqZ2ZkbDFiODQzZmgyd3JuNTVrd3JxbnAifQ.UY8Y52GQKwtVBXH2ssbvgw";

class Map extends React.Component {
  reflectProviderVisibility = (type) => {
    const visibility = type.visible ? 'visible' : 'none';
    this.map.setLayoutProperty(type.id, 'visibility', visibility);
  }

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: "map", // container id
      style: "mapbox://styles/refugeeswelcome/cjh9k11zz15ds2spbs4ld6y9o", // stylesheet location
      center: [-71.066954, 42.359947], // starting position [lng, lat]
      zoom: 11 // starting zoom
    });

    this.map = map; // for passing map instance to click handlers

    // var geocoder = new MapboxGeocoder({
    //   accessToken: mapboxgl.accessToken
    // });
    // map.addControl(geocoder);

    map.on("load", () => {
      // get service providers info from mapbox
      const providerFeatures = map.querySourceFeatures("composite", {
        sourceLayer: "refugees-services"
      });

      const providers = Array.from(providerFeatures)
        .map(({ id, geometry: { coordinates }, properties }) => ({ id, coordinates, ...properties }));

      this.props.initializeProviders(providers);
    });
  }

  componentDidUpdate() {
    this.props.providerTypes.forEach(this.reflectProviderVisibility);
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    return (
      <div id="map" className="map" />
    );
  }
}

export default connect(({ providerTypes }) => ({ providerTypes }), { initializeProviders, toggleProviderVisibility })(Map);

/*     // map.addSource('single-point', {
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
            });*/
