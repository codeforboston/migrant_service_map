import React, { Component } from "react";
import './cluster-provider-list.css'
import { keyImages } from "../../assets/images.js";

class ClusterList extends Component {

  getImage = typeId => {
    return keyImages.filter(image => image.type === typeId)
  }

  render() {
      const maxProviders = 9
      const listLength = this.props.list.length
      const firstNineProviders = this.props.list.slice(0, maxProviders)
      return (
        <div id="clusterList-inner" className="expandable-content-wrapper">
          <div className="expandable-content">
            {this.props.list.for}
            {firstNineProviders.map(
              (item, i) => {
                return (
                  <div key={i}>
                    <img className="image" src={this.getImage(item.typeId)[0].image} alt='provider type icon'/>
                      <p className="item">{item.name}</p>
                  </div>
                )
              }
            )}
            {listLength > maxProviders &&
              <div key={maxProviders}>
                <p>{listLength - maxProviders} more...</p>
              </div>}
          </div>
        </div>
      );
   }
}

export { ClusterList }
