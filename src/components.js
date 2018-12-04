import React, { Component } from 'react';
import { ResourceListItem, categoryList, ResourceSectionHeader, ResourceList } from './main.js';
import { resourceObjects } from './helper_functions.js';
// import mapboxgl from 'mapbox-gl';

export class TopNav extends Component {
    render() {
        return (
            <nav>
                <div className='top-nav'><a href="https://refugeeswelcomehome.org/"><h1>Migrant Service Map</h1></a></div>
                <div id='top-nav' className='top-nav'>
                    <a className='top-nav' href="#target" >Top Nav</a>
                    <a className='top-nav' href="#target" >Top Nav</a>
                    <a className='top-nav' href="#target" >Top Nav</a>
                </div>
            </nav>
        )
    }
}

//TO-DO remove when mapbox loads
export function FlexContainer({ props, children }) {
    return (
        <div id='flex-container' className='flex-container'>{children}</div>
    )
}

export class Menu extends Component {
    render() {
        debugger;
        return(
            <ul className='side-menu'>
                <li>
                    <h3>Service Type</h3>
                    <ul>{categoryList.map(function (a) {
                        return (
                            <div>
                                <li>
                                    <ResourceSectionHeader category={a} />
                                </li>
                                <li>
                                    <ResourceList resourceObjects={resourceObjects} category={a} />
                                </li>
                            </div>
                        )
                    })}</ul>
                </li>
                <li>
                    <h3>Other Criteria</h3>
                    <ul>
                        <li><h4>Visa Status</h4></li>
                    </ul>
                </li>
            </ul>
        )
    }

}

// mapboxgl.accessToken = 'pk.eyJ1IjoicmVmdWdlZXN3ZWxjb21lIiwiYSI6ImNqZ2ZkbDFiODQzZmgyd3JuNTVrd3JxbnAifQ.UY8Y52GQKwtVBXH2ssbvgw';

// export class Map extends Component {
//     componentDidMount() {
//         var map = new mapboxgl.Map({
//             container: 'map', // container id
//             style: 'mapbox://styles/refugeeswelcome/cjh9k11zz15ds2spbs4ld6y9o', // stylesheet location
//             center: [-71.066954, 42.359947], // starting position [lng, lat]
//             zoom: 11 // starting zoom
//           });
//     }
//     render(){
//         return (
//             <img className="map" src="https://fedora.digitalcommonwealth.org/fedora/objects/commonwealth:cj82m102f/datastreams/access800/content" alt="map"></img>
//         )
//     }
// }