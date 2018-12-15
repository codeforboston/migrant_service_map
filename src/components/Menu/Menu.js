import React, { Component } from "react";
import MenuCategory from "./MenuCategory";

export default class Menu extends Component {
  render() {
    let resources = this.props.resourcesObject;
    return (
      <div className="side-menu">
        <li>
          <h3>Service Type</h3>
          <ul>
            {this.props.categoriesList.map((category, index) => (
              <MenuCategory
                key={index}
                category={category}
                items={resources.filter(
                  resource => resource.type === category
                )}
              />
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
      </div>
    );
  }
}
