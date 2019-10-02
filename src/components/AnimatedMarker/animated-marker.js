import React, { Component } from "react";
import typeImages from "assets/images";
import react_dom from "react-dom";

const AnimatedMarker = (providerId, typeId) => {
  const marker = document.createElement("div");
  marker.id = `marker-${providerId}`;
  const icon = document.createElement("img");
  icon.id = `marker-icon-${providerId}`;
  icon.src = getPin(typeId);
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

const getPin = typeId => {
  const pinImage = typeImages.filter(item => item.type === typeId);
  return pinImage[0].image;
};

export { AnimatedMarker };
