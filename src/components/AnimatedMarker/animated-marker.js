import typeImages from "assets/images";
import mapboxgl from "mapbox-gl";
import { displayProviderInformation} from "../../redux/actions";


// clean self up after animation? (not waiting for update)
// animate only when map stops in view


class AnimatedMarker {
  constructor(provider) {
    this.provider = provider;
    this.element = this.createMarkerElement(this.provider.id, this.provider.typeId); // what you currently have in this function
    this.popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      className: "name-popup",
      offset: 20
    }).setText(this.provider.name);

    this.element.addEventListener("mouseover", () => {
      this.marker.togglePopup();
    });
    this.element.addEventListener("mouseout", () => {
      this.marker.togglePopup();
    });
    this.element.addEventListener("animationend", () => {
      this.popup.remove();
      this.marker.remove();
    });

    this.marker = new mapboxgl.Marker({
      element: this.element
    })
        .setPopup(this.popup)
        .setLngLat(provider.coordinates);
  }
  addTo(map) {
    this.marker.addTo(map);
    const markerIcon = this.marker.getElement().firstChild;
    markerIcon.classList.add("bounceOn");
    const markerIconHighlight = markerIcon.nextSibling.firstChild;
    markerIconHighlight.classList.add("bounceOn");
    markerIconHighlight.classList.add("highlightOn");
  }
  remove() {
    this.marker.remove();
    this.popup.remove();
  }

  createMarkerElement = (providerId, typeId) => {
    const marker = document.createElement("div");
    marker.id = `marker-${providerId}`;
    marker.className = "marker";
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
    marker.appendChild(icon);
    marker.appendChild(highlightContainer);

    return marker;
  };

  getPin = typeId => {
    const pinImage = typeImages.filter(item => item.type === typeId);
    return pinImage[0].image;
  };
}



export { AnimatedMarker };
