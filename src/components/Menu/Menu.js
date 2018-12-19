import React, { Component } from "react";
import DropdownMenu from "./DropdownMenu";
import DropdownMenuItem from "./DropdownMenuItem";

export default class Menu extends Component {

  render() {
    const { resources } = this.props;
    this.servicesByType = {};
    this.serviceTypes = [];

    /**
     * extracting map -
     * servicesByType = {
     *    "Health": [<health resource 1>, <health resource 2>, ...],
     *    "Education": [<education resource 1>, <education resource 2>, ...],
     *    ... etc
     * }
     */
    resources.forEach(resource => {
      const { type } = resource;
      this.servicesByType[type] = this.servicesByType[type] || []; // Initialize the array if needed
      this.servicesByType[type].push(resource);

      if (!this.serviceTypes.includes(type)) {
        this.serviceTypes.push(type);
      }
    });

    return (
      <div className="side-menu">
        <DropdownMenu text="Service Type">
          {this.serviceTypes.map((serviceType, index) => (
            <DropdownMenuItem
              key={index}
              text={serviceType}
              items={this.servicesByType[serviceType]}
            />
          ))}
        </DropdownMenu>
        <DropdownMenu text="Other Criteria" />
        <DropdownMenu text="Visa Status" />
      </div>
    );
  }
}
