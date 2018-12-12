import React from 'react'; 


//TO-DO when mapbox hooks up 
export const toggleMapIcons = () => 'toggle(category)';

//toggles child menu
export const toggleChildMenu = (category) => {
    const myMenu = document.getElementById(category);
    myMenu.classList.toggle('show');
 };

 export const ResourceSectionHeader = (props) => {
    return (
        <div className='section-header'>
            <i>{'•'}</i>
            <h2><a href="#target" onClick={() => toggleChildMenu(props.category)}>{props.category}</a></h2>
            <i>{'v'}</i>
        </div>
    )
}

//the individual resources (company, school, non-profit)
export const ResourceListItem = (resourceListItem) => <li className='list-item'><a href="#target" /* onClick={mapboxPopup}*/ >{resourceListItem.name}</a></li> ;

export const ResourceList = (props) => {
    return(
        <ul className='child-menu' 
            id={props.category} 
            key={props.category}>
                {props.resourcesObject.filter(resource => resource.type === props.category).map(resource => <ResourceListItem 
                    name={resource.name} 
                    key={resource.name} 
                    category={resource.type}/>
            )}
        </ul>
    )
}
