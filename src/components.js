import React, { Component } from 'react'; 
import { style, resourceObjects, ResourceListItem, categoryList, ResourceSectionHeader, ResourceList } from './main.js'; 

export class TopNav extends Component {
    render(){
    return ( 
        <nav> 
            <div className='top-nav'><a href="https://refugeeswelcomehome.org/"><h1>Migrant Service Map</h1></a></div>
            <div id='top-nav' className='top-nav'>
                <a className='top-nav' href="#target" >Top Nav</a>
                <a className='top-nav' href="#target" >Top Nav</a>
                <a className='top-nav' href="#target" >Top Nav</a>
            </div>
        </nav>
)}
}



export function Menu(props){
    return (
    <ul className='side-menu'>
        <li>
            <h3>Service Type</h3>
                <ul>{categoryList.map(function(a){
                return (
                <div style={style.list}>
                <li style={style.list}>
                <ResourceSectionHeader category={a} />
                </li>
                <li style={style.list}>
                <ResourceList resourceObjects={resourceObjects} category={a}/>
                </li>
                </div>
                )})}</ul>
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
