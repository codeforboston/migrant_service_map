import React, { Component } from "react";
import typeImages from "assets/images";
import react_dom from "react-dom";



const AnimatedMarker = (providerId, typeId) => {
    const marker = document.createElement("civ");
    marker.id=`marker-${providerId}`;
    const icon = document.createElement("img");
    icon.id = `marker-icon-${providerId}`;
    icon.src = getPin(typeId);
    icon.className = "baseState";
    marker.appendChild(icon);

    return marker;
}


const getPin = (typeId) => {
    for (let i = 0; i < typeImages.length; i++){
        if ( typeImages[i].type == typeId ) {
            return typeImages[i].image;
        }
    }
}



export { AnimatedMarker };




