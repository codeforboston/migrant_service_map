import React, { Component } from "react";
import './cluster-provider-list.css'
import { keyImages } from "../../assets/images.js";


class ClusterList extends Component {

    getImage = typeId => {
        return keyImages.filter(image => image.type === typeId)
    }

render() {
    const listLength = this.props.list.length
    return (
      <div id="clusterList-inner" className="expandable-content-wrapper">
        <div className="expandable-content">
          {this.props.list.map(
            (item, i) => { if (i < 9) {
              return (
                <div key={i}>
                  <img className="image" src={this.getImage(item.typeId)[0].image} alt='provider type icon'/>
                    <p className="item">{item.name}</p>
                </div>
              )
            }}
          )}
          {listLength > 9 &&
            <div key='9'>
              <p>{listLength - 9} more...</p>
            </div>}
        </div>
      </div>
    );
  }
}

export { ClusterList }
