import React, { Component } from "react";

import { ResourceList, ResourceSectionHeader } from "../main";

export default class Menu extends Component {
  render() {
    // debugger;
    return (
      <ul className="side-menu">
        <li>
          <h3>Service Type</h3>
          <ul>
            {this.props.categoriesList.map(category => (
              <div key={category}>
                <li>
                  <ResourceSectionHeader category={category} />
                </li>
                <li>
                  <ResourceList
                    resourcesObject={this.props.resourcesObject}
                    category={category}
                  />
                </li>
              </div>
            ))}
          </ul>
        </li>
        <li>
          <h3>Other Criteria</h3>
          <ul>
            <li>
              <h2>Visa Status</h2>
            </li>
          </ul>
        </li>
      </ul>
    );
  }
}
