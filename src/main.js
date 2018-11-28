import React from 'react'; 


//the individual resources (company, school, non-profit)
export function ResourceListItem(resourceListItem) {
    return (
        <li className='list-item'><a href="#target" /* onClick={mapboxPopup}*/ >{resourceListItem.name}</a></li>
    )
}


//TO-DO when mapbox hooks up 
function toggleMapIcons(){ 'toggle(category)' };

//toggles child menu
function toggleChildMenu(category){
    var myMenu = document.getElementById(category);
    myMenu.classList.toggle('show')
 };


export function ResourceSectionHeader(props){
    return (
        <div className='section-header'>
            <i>{'icon'}</i>
            <h2><a href="#target" onClick={() => toggleChildMenu(props.category)}>{props.category}</a></h2>
            <i>{'chevron'}</i>
        </div>
    )
}

export function ResourceList(props){
    return(
        <ul className='child-menu' id={props.category} key={props.category}>
            {props.resourcesObject.filter(resource => resource.type === props.category).map(resource => <ResourceListItem name={resource.name} key={resource.name} category={resource.type}/>
            )}
        </ul>
    )
}