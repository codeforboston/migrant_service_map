const centerMarker = document.createElement("div");
centerMarker.className = "searchCenterMarker";
centerMarker.id = "searchCenterMarker";
centerMarker.style.display = "block";
centerMarker.style.height = "20px";
centerMarker.style.width = "20px";
centerMarker.style.borderRadius = "10px";
centerMarker.style.backgroundColor = "#0f0";

const createDistanceMarker = (distance, color) => {
  const markerElement = document.createElement("div");
  markerElement.className = "distanceMarker";
  markerElement.id = "marker-" + distance + "-miles";
  markerElement.style.display = "block";
  markerElement.innerText = distance + (distance > 1 ? " miles" : " mile");
  markerElement.style.backgroundColor = color;
  return markerElement;
};

const removeDistanceMarkers = () => {
  const distanceMarkers = Array.from(document.getElementsByClassName("distanceMarker"));
  return distanceMarkers.map(marker => marker.remove());
};


const createSelectionMarker = () => {
  
}

const addSourceToMap = (typeId, map) => {
  if (!map.getSource(typeId)) {
    map.addSource(typeId, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: []
      }
    });
  }
};

const addPointSourceToMap = (name, map) => {
  if (!map.getSource(name)) {
    map.addSource(name, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: []
            }
          }
        ]
      }
    });
  }
};

const addCircleLayerToMap = (name, source, map) => {
  if (!map.getLayer(name)) {
    map.addLayer({
      id: name,
      source: source,
      type: "circle",
      paint: {
        "circle-radius": 30,
        "circle-color": "rgba(140,69,207, 0.5)",
        "circle-stroke-color": "rgba(140,69,207, 1)",
        "circle-stroke-width": 3 
      }
    });
  }
};

const addDistanceFilterLayer = (distanceFilterDistances, map) => {
  removeDistanceMarkers();
  if (!map.getSource("distance-indicator-source")) {
    map.addSource("distance-indicator-source", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: []
      }
    });
    map.addLayer({
      id: "distance-indicator",
      type: "line",
      source: "distance-indicator-source",
      paint: {
        "line-color": ["get", "color"],
        "line-opacity": 0.8,
        "line-width": ["*", distanceFilterDistances[0], 3],
        "line-offset": 5
      }
    });
  }
};

export {
  // featureToProvider,
  centerMarker,
  createDistanceMarker,
  removeDistanceMarkers,
  addDistanceFilterLayer,
  addSourceToMap,
  addCircleLayerToMap,
  addPointSourceToMap
};
