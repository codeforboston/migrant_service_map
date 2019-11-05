import React, { Component } from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import './cluster-provider-list.css'
import { keyImages } from "../../assets/images.js";


class ClusterList extends Component {

    getImage = typeId => {
        return keyImages.filter(image => image.type === typeId)
    }

render() {
    const itemStyle = {
        color: "#8c45cf",
        fontWeight: "400",
        fontSize: "15px",
        verticleAlign: "top",
        display: "inline-block",
        width: "20em",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        padding: "0px 6px",
        lineHeight: "1.5em",
    }
    const listStyle = {
        // margin: '0.5em'
        //height of 9 elements
        // height: '324px'
    }
    const imageStyle = {
        display: "inline-block",
        width: "20px",
        height: "20px",
        verticalAlign: "top",
    }
    const wrapper = {
        backgroundColor: 'white',
        padding: '15px',
        border: '1px solid #D7ADFF',
        borderRadius: '8px'
    }
    // const more = {
    //     paddingBottom: '1em'
    // }
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
