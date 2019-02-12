import React from "react";
import { connect } from "react-redux";
import mapboxgl from "mapbox-gl";
import { initializeProviders, toggleProviderVisibility } from "../actions";
import getProvidersByDistance from "../selectors";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
// import { insertPopup, Popup } from "./PopUp.js";

import "../map.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoicmVmdWdlZXN3ZWxjb21lIiwiYSI6ImNqZ2ZkbDFiODQzZmgyd3JuNTVrd3JxbnAifQ.UY8Y52GQKwtVBXH2ssbvgw";

// TODO
// make source function
// make layer function
// turn providers back into features to inject in the map

// Steps
// create all sources
// create all layers
// to change things .setData on the sources

// Future dreams
// user can see their provider saves on a separate layer

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      providerFeatures: [], 
      searchCenter: [-71.066954, 42.359947]
    };
    this.map = "";
  }

  reflectProviderVisibility = type => {
    const distance = this.props.filterProviders.distance;
    const visibility = type.visible ? "visible" : "none";

    if ( type.visible && distance) {
      // distance filter has a non-null value
      this.updateSource(
        type.id,
        getProvidersByDistance(this.state.searchCenter, type.providers, distance)
      ); // type.providers, distance) )
      this.map.setLayoutProperty(type.id, 'visibility', 'none');
      this.map.setLayoutProperty(type.id+"filtered", "visibility", "visible");
        
      //   this.map.getSource("filteredFeatures").setData({
      //     type: "FeatureCollection",
      //     features: this.props.filteredProviders // getProvidersByDistance(type.providers, distance)
      //   });
    } else {
      this.map.setLayoutProperty(type.id, "visibility", visibility);
      if (this.map.getLayer(type.id+"filtered")) {
        this.map.setLayoutProperty(type.id+"filtered", "visibility", visibility);
      }
    }
  };

  addSourceToMap = (typeId ) => {
    this.map.addSource(typeId, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: []
      }
    });
  };

  updateSource = (typeId, filteredProviders) => {
    console.log("newsymbollayer with", filteredProviders);
    if ( !this.map.getSource(typeId) ) {
      this.addSourceToMap( typeId )
      this.addLayerToMap( typeId )
    }
    this.map.getSource(typeId).setData({
      type: "FeatureCollection",
      features: this.convertProvidersToGeoJSON(filteredProviders)
    });
  };
  
  addLayerToMap = typeId => {
    this.map.addLayer({
      id: typeId + "filtered",
      source: typeId,
      type: "symbol",
      layout: {
        "icon-image": "cat",
        "icon-size": 0.05
      }
    });
  };

  convertProvidersToGeoJSON = providers => {
    console.log("convertProviders did run")
    const geojsonProvs = providers.map(provider => ({
      geometry: {
        type: "Point",
        coordinates: provider.coordinates
      },
      type: "Feature",
      properties: provider.properties
    }));
    console.log(geojsonProvs);
    return geojsonProvs;
  };

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: "map", // container id
      style: "mapbox://styles/refugeeswelcome/cjh9k11zz15ds2spbs4ld6y9o", // stylesheet location
      center: [-71.066954, 42.359947], // starting position [lng, lat]
      zoom: 11 // starting zoom
    });

    this.map = map; // for passing map instance to click handlers

    var geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken
    });
    map.addControl(geocoder);

    geocoder.on("result", ev => {
        console.log(ev.result.geometry.coordinates);
        this.setState({searchCenter: ev.result.geometry.coordinates});
    }
); 


    map.loadImage(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cat_silhouette.svg/400px-Cat_silhouette.svg.png",
      function(error, image) {
        if (error) throw error;
        map.addImage("cat", image);
      }
    );
    map.on("load", () => {
      // get service providers info from mapbox
      const providerFeatures = map.querySourceFeatures("composite", {
        sourceLayer: "refugees-services"
      });

      this.setState({ providerFeatures: providerFeatures });

      const providers = Array.from(providerFeatures).map(
        ({ id, geometry: { coordinates }, properties }) => ({
          id,
          coordinates,
          ...properties
        })
      );
      console.log("map did load")
      // this.addSourceToMap(this.state.providerFeatures);
      this.props.providerTypes.forEach(type => {
        console.log(type); 
        this.addSourceToMap(type.providers); 
        // this.addSourceToMap(this.convertProvidersToGeoJSON(providers));
        this.addLayerToMap(type.id);
      });
      // this.addLayerToMap("educationfiltered");
      this.props.initializeProviders(providers);

      // hide map icons at first (the default is for icons to show)
      //   layerNames.map(layer =>
      //     map.setLayoutProperty(layer, "visibility", "none")
      //   );
    });
  }

  componentDidUpdate() {
    this.props.providerTypes.forEach(this.reflectProviderVisibility);
  }

  //   setFilter = e => {
  //     const distance = e.target.value;
  //     const distances = this.state.providers.map(provider => {
  //       return {
  //         provider: provider,
  //         distance: turf.distance(
  //           turf.point(provider.geometry.coordinates),
  //           turf.point(this.state.mapCenter)
  //         )
  //       };
  //     });

  //     const closePlaces = distances
  //       .filter(el => el.distance < distance)
  //       .map(el => el.provider);

  //     this.setState((state) => { return {
  //       filteredProviders: closePlaces,
  //       distanceVisible: distance
  //     }}, this.newSymbolLayer);

  //     console.log("filteredProviders " + this.state.filteredProviders.length)
  //     // this.newSymbolLayer();
  //   };

  componentWillUnmount() {
    // this.newSymbolLayer();
    this.map.remove();
  }

  render() {
    return <div id="map" className="map" />;
  }
}

export default connect(
  ({ providerTypes, filterProviders }) => ({ providerTypes, filterProviders }),
  { initializeProviders, toggleProviderVisibility }
)(Map);

/* map.addSource('single-point', {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": []
            }
        });
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
*/
