import React, { Component } from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import { keyImages } from "../../assets/images.js";


class ClusterList extends Component {

    getImage = typeId => {
        return keyImages.filter(image => image.type === typeId)
    }

render(){
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
        paddingTop: "1em",
    }
    const imageStyle = {
        display: "inline-block",
        width: "20px",
        height: "20px",
        verticalAlign: "top",
    }

    return (
        <div id="clusterList-wrapper" className="expandable-container">
            <div id="clusterList-inner" className="expandable-content-wrapper">
                <div className="expandable-content" style={listStyle}>
                    {this.props.list.map(
                        (item, i) => {
                            return (
                                <div key={i}>
                                    <img style={imageStyle} src={this.getImage(item.typeId)[0].image} />
                                    <p style={itemStyle}>{item.name}</p>
                                </div>
                            )
                        }
                    )}
                </div>
            </div>
        </div>
    );

    }
}



export { ClusterList }