import React from 'react'; 
// import mapboxgl from 'mapbox-gl'

export const style = {
    'style': 'object',
    'resource': {'color': 'red', 'listStyle': 'none', 'alignItems': 'left'},
    'text': {
        'fontSize': '1rem', 
        'color': 'alicewhite', 
        'display':'block', 
        'padding':'1rem',
        'textAlign': 'left'
    },
    'list': {
        'listStyle': 'none', 
        'display':'flex', 
        'flexDirection': 'column', 
        'alignItems': 'start', 
        'justifyContent':'start'
    }
}

export const resourceObjects = [
        {'name': 'name1',
        'id': 'id1', 
        'website': 'website', 
        'bio': 'bio',
        'telephone': 'telephone', 
        'type': 'type1',
        'coordinates': 'coordinates',
        'onClick': 'onClick',
        'className': 'className'},
        {'name': 'name2',
        'id': 'id2', 
        'website': 'website', 
        'bio': 'bio',
        'telephone': 'telephone', 
        'type': 'type2',
        'coordinates': 'coordinates',
        'onClick': 'onClick',
        'className': 'className'},
       { 'name': 'name3',
        'id': 'id3', 
        'website': 'website', 
        'bio': 'bio',
        'telephone': 'telephone', 
        'type': 'type3',
        'coordinates': 'coordinates',
        'onClick': 'onClick',
        'className': 'className'},
        { 'name': 'name4',
         'id': 'id3', 
         'website': 'website', 
         'bio': 'bio',
         'telephone': 'telephone', 
         'type': 'type3',
         'coordinates': 'coordinates',
         'onClick': 'onClick',
         'className': 'className'},
         { 'name': 'name5',
          'id': 'id3', 
          'website': 'website',     
          'bio': 'bio',
          'telephone': 'telephone', 
          'type': 'type3',
          'coordinates': 'coordinates',
          'onClick': 'onClick',
          'className': 'className'},
          { 'name': 'name6',
           'id': 'id3', 
           'website': 'website', 
           'bio': 'bio',
           'telephone': 'telephone', 
           'type': 'type3',
           'coordinates': 'coordinates',
           'onClick': 'onClick',
           'className': 'className'}
]; 

const icons = {
    'type1':'mb1',
    'type2':'mb2',
    'type3':'mb3',
    'type4': 'mb4'
}; 


export function TestPattern() {
    return (
        <ul>
            <li>test pattern this is a test pattern</li>
        </ul>
    )
}



export function ResourceListItem(props) {
    return (
        <li style={style.text}><a href="#target" /* onClick={mapboxPopup}*/ >{props.name}</a></li>
    )
}

export const categoryList = makeTypeList(resourceObjects);

function makeTypeList(objectArray){
    return objectArray.map(function(a){ return a.type }).filter(function(value, index, self){
        return self.indexOf(value) === index ; 
    })
}; 



// function getCategories(){
//     let map = 'mapbox reference'; 
//     let services = map.querySourceFeatures('composite', {sourceLayer: 'refugees-services'}); 
//     let serviceCategories = []; 
//     for (let i = 0 ; i < services ; i++){
//         let type = services[i].properties.type; 
//         if ( ! Object.keys(serviceCategories).includes(type) ) {
//             serviceCategories.push(type); 
//         }
//     }
// }

export function ResourceSectionHeader(props){

    return (
        <div style={{'display':'flex', 'alignItems': 'center', 'justifyContent': 'start', 'fontSize':'1rem'}}>
            <i>{'icon'}</i>
            <h2 style={style.text}><a href="#target">{props.category}</a></h2>
            <i>{'chevron'}</i>
        </div>
    )
}


function toggleMapIcons(){ 'toggle(category)' };

function toggleChildMenu(){ 'toggle(catoegory)' };


export function ResourceList(props){
    // const style={'scroll': 'scroll'};
    return(
        <ul style={{'listStyle': 'none', 'textAlign':'left'}}>
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