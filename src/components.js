import React, { Component } from 'react';
import { ResourceSectionHeader, ResourceList } from './main.js';

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

export default class Menu extends Component {
    render() {
        // debugger;
        return(
            <ul className='side-menu'>
                <li>
                    <h3>Service Type</h3>
                    <ul>{this.props.categoriesList.map(category => (
                            <div key={category} >
                                <li>
                                    <ResourceSectionHeader category={category} />
                                </li>
                                <li>
                                    <ResourceList resourcesObject={this.props.resourcesObject} category={category} />
                                </li>
                            </div>
                        ))}</ul>
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
