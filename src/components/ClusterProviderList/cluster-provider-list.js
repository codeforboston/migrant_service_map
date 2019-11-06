

import React from "react";
import ReactDOM from "react-dom";


const createClusterList = (clusterListProviders) => {
    let markerDiv = document.createElement("div");
        let clusterListEl = document.createElement("p");
        clusterListEl.innerText = "a,b,c";

        markerDiv.appendChild(clusterListEl);
        markerDiv.classList.add("");

        ReactDOM.render(clusterListEl, document.getElementById("clusterList"));
}


export { createClusterList }