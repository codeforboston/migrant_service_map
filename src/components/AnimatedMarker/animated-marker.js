import typeImages from "assets/images";
import mapboxgl from "mapbox-gl";
import { bboxPolygon, point, booleanPointInPolygon } from "@turf/turf";

class AnimatedMarker {
    constructor(provider) {
        this.provider = provider;
        this.markerElement = this.createMarkerElement(this.provider.id, this.provider.typeId);
        this.element = this.markerElement.element;
        this.markerIcon = this.markerElement.icon;
        this.markerIconHighlight = this.markerElement.highlight;
        this.marker = new mapboxgl.Marker({
            element: this.element
        }).setLngLat(provider.coordinates);
    }

    isInView = (map) => {
        const mapBoundsArray = map.getBounds().toArray().flat();
        const poly = bboxPolygon(mapBoundsArray);
        const pt = point(this.provider.coordinates);
        return booleanPointInPolygon(pt, poly);
    };

  bounceIcon = () => {
    this.markerIcon.classList.add("bounceOn");
    this.markerIconHighlight.classList.add("bounceOn");
    this.markerIconHighlight.classList.add("highlightOn");
    this.markerIcon.addEventListener("animationend", this.remove);
  };

    addTo(map) {
        this.marker.addTo(map);
        if (this.isInView(map)) {
            this.bounceIcon()
        } else {
            map.once('moveend', this.bounceIcon)
        }
    }

  remove = () => {
    this.markerIcon.removeEventListener("animationend", this.remove);
    this.marker.remove();
  };

    createMarkerElement = (providerId, typeId) => {
    const element = document.createElement("div");
    element.id = `marker-${providerId}`;
    element.className = "marker";
    const icon = document.createElement("img");
    icon.id = `marker-icon-${providerId}`;
    icon.src = this.getPin(typeId);
    icon.className = "baseState";
    const highlight = document.createElement("img");
    highlight.src = require("../../assets/icons/pin-highlight.svg");
    highlight.className = "marker-highlight";
    const highlightContainer = document.createElement("div");
    highlightContainer.className = "marker-highlight-container";
    highlightContainer.appendChild(highlight);
    element.appendChild(icon);
    element.appendChild(highlightContainer);
    return { element, icon, highlight };
  };

  getPin = typeId => {
    const pinImage = typeImages.filter(item => item.type === typeId);
    return pinImage[0].image;
  };
}

export { AnimatedMarker };
