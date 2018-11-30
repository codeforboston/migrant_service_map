import React from 'react'; 
import { resourceObjects } from './helper_functions.js';


//the individual resources (company, school, non-profit)
export function ResourceListItem(props) {
    return (
        <li className='list-item'><a href="#target" /* onClick={mapboxPopup}*/ >{props.name}</a></li>
    )
}

//array of the types of resources -- forms the main menu entries. Draws from the live database so should change with updates. 
export const categoryList = makeTypeList(resourceObjects);

//get the types from the temporary 'data' object 
function makeTypeList(objectArray){
    return objectArray.map(function(a){ return a.type }).filter(function(value, index, self){
        return self.indexOf(value) === index ; 
    })
}; 

// get the types from mapbox data
// function getCategories(){
//     let map = 'mapbox reference'; 
//     let services = map.querySourceFeatures('composite', {sourceLayer: 'refugees-services'}); 
//     return services.map(function(a){ return a.type }).filter(function(value, index, self){
    // return self.indexOf(value) === index ; 
// }

//TO-DO when mapbox hooks up 
function toggleMapIcons(){ 'toggle(category)' };

//toggles child menu
function toggleChildMenu(category){ 
    console.log('toggleChildMenu', category);
    var myMenu = document.getElementById('list-' + category);
    console.log(myMenu); 
    myMenu.classList.toggle('show')
 };


export function ResourceSectionHeader(props){
    return (
        <div className='section-header'>
            <i>{'icon'}</i>
            <h2><a href="#target" onClick={function(){ return toggleChildMenu(props.category)}}>{props.category}</a></h2>
            <i>{'chevron'}</i>
        </div>
    )
}


export function ResourceList(props){
    // const style={'scroll': 'scroll'};
    return(
        <ul className='child-menu' id={'list-' + props.category}>
        {resourceObjects.filter(function(resource){
                return resource.type === props.category
            }).map(function(resource) {
                return <ResourceListItem name={resource.name} key={resource.id} category={resource.type}/>
            })
        }
        </ul>
    )
}




// function mapboxPopup() {
//     new mapboxgl.Popup()
//     .setLngLat(coordinates)
//     .setHTML('<h4>' + name + '</h4>' + '<a href=' + website + '>' + website + '</a>' + '<br><br>' + '<i>' + bio + '</i>' + '<br><br><b>Telephone: </b>' + telephone)
//     .addTo(map);
// }