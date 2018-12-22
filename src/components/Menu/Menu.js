import React, { Component } from "react";
import DropdownMenu from "./DropdownMenu";
import DropdownMenuItem from "./DropdownMenuItem";

export default class Menu extends Component {

  render() {
    const { providers } = this.props;
    this.servicesByType = {};
    this.serviceTypes = [];

    providers.forEach(provider => {
      const { type } = provider.properties;
      this.servicesByType[type] = this.servicesByType[type] || []; // Initialize the array if needed
      this.servicesByType[type].push(provider);

      if (!this.serviceTypes.includes(type)) {
        this.serviceTypes.push(type);
      }
    });

    const filterProvidersList = (type) => providers.filter((provider, type, index) => {
      return provider; 
    })



    return (
      <div className="side-menu">
        <DropdownMenu text="Service Type">
        {this.serviceTypes.map((serviceType, index) => (
            <DropdownMenu text={serviceType} key={index}>
              {filterProvidersList(serviceType).map((provider, i) => (
                <DropdownMenuItem  
                  key={i}
                  text={provider.properties.name}
                  item={provider}
                  clickHandler={this.props.handleProviderClick}
                />
              ))}
            </DropdownMenu>
          ))}
        </DropdownMenu>
        <DropdownMenu text="Other Criteria" >
          <DropdownMenuItem
            key={1}
            text={"placeholder"}
            items={['item1', 'item2']}
          />
        </DropdownMenu>
        <DropdownMenu text="Visa Status" />
      </div>
    );
  }
}
