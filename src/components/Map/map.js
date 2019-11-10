import React, { Component } from "react";
import mapboxgl from "./mapbox-gl-wrapper";
import "./map.css";
import {
	circle,
	point,
	transformTranslate,
	booleanPointInPolygon,
	bboxPolygon,
} from "@turf/turf";
import typeImages from "assets/images";
import distances from "assets/distances";
import {
	convertProvidersToGeoJSON,
	createCenterMarker,
	createDistanceMarker,
	removeDistanceMarkers,
  getProviderBoundingBox,
	filterProviderIds,
  providersById,
  getBoundingBox
} from "./utilities.js";
import {AnimatedMarker} from "../AnimatedMarker/animated-marker.js";

const zoomPadding = { top: 100, bottom: 100, left: 450, right: 100 };

// The map has a zoom level between 0 (zoomed entirely out)
// and 22 (zoomed entirely in). Zoom level is configured as integers but
// the map can zoom to decimal values. The effective zoom level is
// Math.floor(map.getZoom()).
const MAX_CLUSTERED_ZOOM = 14,
	MIN_UNCLUSTERED_ZOOM = 15;

class Map extends Component {
	constructor(props) {
		super(props);
		this.map = null;
		this.markerList = []; //need to keep track of marker handles ourselves -- cannot be queried from map
    this.mapRef = React.createRef();
		this.zoomLevels = {};
		this.state = {
			loaded: false
		};
	}
	
	onMapLoaded = () => {
		// Initialize static sources and layers. Layers for provider icons are
		// added as they're enabled in the UI. Layers are drawn in the order they
		// are added to the map.
		this.setSingleSourceInMap();
		this.addDistanceIndicatorLayer();
		this.findClustersInMap();
		this.loadProviderTypeImage(typeImages);
		this.setState({loaded: true});
		
		distances.forEach(distance =>
			this.zoomLevels[distance] = this.getZoomForDistance(distance)
		);
	};
	
	componentDidMount() {
		const {mapCenter} = this.props.search;
		const map = new mapboxgl.Map({
      container: this.mapRef.current,
			style: "mapbox://styles/refugeeswelcome/cjxmgxala1t5b1dtea37lbi2p", // stylesheet location
			center: mapCenter,
			zoom: 11 // starting zoom
		});
		map.addControl(new mapboxgl.NavigationControl());
		map.on("load", this.onMapLoaded);
		
		this.map = map;
	}
	
	setSourceFeatures = features => {
		this.setSingleSourceInMap(); // checks source exists, adds if not
		this.map.getSource("displayData").setData({
			type: "FeatureCollection",
			features: features
		});
	};
	
	findLayerInMap = typeId => {
		if (!this.map.getLayer(typeId)) {
			this.map.addLayer({
				id: typeId,
				source: "displayData",
				type: "symbol",
				filter: ["all", ["!=", "has", "point_count"], ["==", "typeId", typeId]],
				layout: {
					"icon-image": typeId + "icon",
					"icon-size": 0.4,
					"icon-allow-overlap": true,
					"icon-ignore-placement": true,
					"icon-padding": 10,
					visibility: "visible"
				}
			});
			this.addClickHandlerToMapIdLayer(typeId);
			this.addHoverHandlerToMapIdLayer(typeId);
		}
	};
	
	setSpecialLayerInMap = (property, layerName) => {
		if (!this.map.getLayer(layerName)) {
			this.map.addLayer({
				id: layerName,
				source: "displayData",
				type: "symbol",
				filter: ["==", property, layerName],
				layout: {
					"icon-image": layerName + "icon",
					"icon-size": 0.4,
					"icon-allow-overlap": true,
					"icon-ignore-placement": true,
					"icon-padding": 10,
					visibility: "visible"
				}
			});
		}
	};
	
	findClustersInMap = () => {
		this.map.addLayer({
			id: "clusterCircle",
			source: "displayData",
			type: "symbol",
			filter: ["has", "point_count"],
			layout: {
				"icon-image": "clustersicon",
				"icon-size": 0.5,
				"icon-allow-overlap": true,
				"icon-ignore-placement": true
			}
		});
		
		let clusterName = "cluster";
		this.map.addLayer({
			id: clusterName,
			source: "displayData",
			type: "symbol",
			filter: ["has", "point_count"],
			layout: {
				"icon-size": 0.4,
				"text-field": "{point_count_abbreviated}",
				"text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
				"text-size": 26,
				"text-offset": [0, -0.3],
				"icon-allow-overlap": true,
				"icon-ignore-placement": true,
				visibility: "visible"
			},
			paint: {
				"text-color": "black",
				"text-halo-color": "#ffffff",
				"text-halo-width": 2
			}
		});
		
		this.addClusterClickHandlerToMapLayer(clusterName);
	};
	
	setSingleSourceInMap = () => {
		if (!this.map.getSource("displayData")) {
			this.map.addSource("displayData", {
				type: "geojson",
				data: {
					type: "FeatureCollection",
					features: []
				},
				cluster: true,
				clusterMaxZoom: MAX_CLUSTERED_ZOOM,
				clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
			});
		}
	};
	
	loadProviderTypeImage = images => {
		images.map(typeImage =>
			this.map.loadImage(typeImage.image, (error, image) => {
				if (error) throw error;
				this.map.addImage(`${typeImage.type}icon`, image);
			})
		);
	};
	
	addClusterClickHandlerToMapLayer = clusterName => {
		this.map.on("click", clusterName, e => {
			let features = this.map.queryRenderedFeatures(e.point, {
				layers: [clusterName]
			});
			
			let clusterId = features[0].properties.cluster_id;
			this.map
				.getSource("displayData")
				.getClusterExpansionZoom(clusterId, (err, zoom) => {
					if (err) return;
					
					const mapZoom = this.map.getZoom();
					this.map.easeTo({
						center: features[0].geometry.coordinates,
						zoom: mapZoom >= zoom ? mapZoom + 1 : zoom
					});
				});
		});
	};
	
	addClickHandlerToMapIdLayer = typeId => {
		let {displayProviderInformation, highlightedProviders, selectProvider} = this.props;
		this.map.on("click", typeId, e => {
			const providerId = e.features[0].properties.id;
			selectProvider(providerId);
			const providerElement = document.getElementById(
				`provider-${providerId}`
			);
			if (typeId !== "highlightedProviders" && providerElement) {
				displayProviderInformation(providerId);
			} else if (!highlightedProviders.includes(providerId)) {
				displayProviderInformation(providerId);
			}
		});
	};
	
	addHoverHandlerToMapIdLayer = typeId => {
		let popup = new mapboxgl.Popup({
			closeButton: false,
			closeOnClick: false,
			className: "name-popup",
			offset: 20
		});
		
		this.map.on("mouseenter", typeId, e => {
			let popupCoordinates = e.features[0].geometry.coordinates.slice();
			let name = e.features[0].properties.name;
			
			popup
				.setLngLat(popupCoordinates)
				.setHTML(name)
				.addTo(this.map);
		});
		
		this.map.on("mouseleave", typeId, () => {
			popup.remove();
		});
	};
	
	addDistanceIndicatorLayer = () => {
		if (!this.map.getSource("distance-indicator-source")) {
			this.map.addSource("distance-indicator-source", {
				type: "geojson",
				data: {
					type: "FeatureCollection",
					features: []
				}
			});
		}
		if (!this.map.getLayer("distance-indicator-fill")) {
			this.map.addLayer({
				id: "distance-indicator-fill",
				type: "fill",
				source: "distance-indicator-source",
				paint: {
					"fill-color": ["get", "color"]
				}
			});
		}
		if (!this.map.getLayer("distance-indicator-stroke")) {
			this.map.addLayer({
				id: "distance-indicator-stroke",
				type: "line",
				source: "distance-indicator-source",
				paint: {
					"line-color": "#D561B5",
					"line-width": 2
				}
			})
		}
	}
	
	geoJSONFeatures = () => {
		let {highlightedProviders, visibleProviders = []} = this.props;
		let provider;
		for (provider of visibleProviders) {
			provider.highlighted = highlightedProviders.includes(provider.id)
				? "highlighted"
				: "not-highlighted";
		}
		return convertProvidersToGeoJSON(visibleProviders);
	};
	
	setSourceFeatures = features => {
		this.setSingleSourceInMap(); // checks source exists, adds if not
		this.map.getSource("displayData").setData({
			type: "FeatureCollection",
			features: features
		});
	};
	
	markRecentSelection(prevProps) {
		let {visibleProviders, selectProviderKey, selectProviderId} = this.props;
		if (selectProviderKey === prevProps.selectProviderKey) { return ;}
		const provider = providersById(visibleProviders)[selectProviderId];
		const marker = new AnimatedMarker(provider);
		marker.addTo(this.map);
	}
	
	updatePinAndDistanceIndicator = prevProps => {
		const distance = this.props.filters.distance;
		const searchKey = this.props.search.searchKey;
		const searchCoordinates = this.props.search.coordinates;
		if (
			distance === prevProps.filters.distance && !searchKey
		) {
			// Do not render if the relevant props have not changed. This includes
			// the first render of this component, so the marker is not shown until
			// the user starts interacting with the app.
			return;
		}
		removeDistanceMarkers(this.markerList);
		this.addDistanceIndicatorLayer();
		// If no distance filter is set, display all distance indicators.
		let distanceIndicatorRadii = distance ? [distance] : distances.sort();
		let userSearch = this.props.search.currentLocation !== "default";
		
		if (distance || userSearch) {
			const centerMarker = createCenterMarker();
			//TODO: extract the creation of the visual features
			const mapPin = new mapboxgl.Marker({element: centerMarker})
				.setLngLat(searchCoordinates)
				.addTo(this.map);
			this.markerList.push(mapPin);
			
			const labels = distanceIndicatorRadii.map((radius, i) => {
				const radiusOffset = transformTranslate(
					point(searchCoordinates),
					radius,
					90,
					{units: "miles"}
				);
				const distanceMarker = createDistanceMarker(radius);
				const marker = new mapboxgl.Marker({element: distanceMarker});
				this.markerList.push(marker);
				return marker.setLngLat(radiusOffset.geometry.coordinates);
			});
			labels.map(label => label.addTo(this.map));
		} else {
			distanceIndicatorRadii = [];
		}
		const innerColor = "hsla(317, 100%, 84%, .1)";
		const outerColor = "hsla(317, 100%, 84%, .15)";
		const circles = distanceIndicatorRadii
			.slice()
			.reverse()
			.map((radius, i) =>
				circle(searchCoordinates, radius, {
					steps: 100,
					units: "miles",
					properties: {color: i === 0 ? outerColor : innerColor}
				})
			);
		
		this.map
			.getSource("distance-indicator-source")
			.setData({type: "FeatureCollection", features: circles});
	};
	
	zoomToFit = providerIds => {
		providerIds =
			providerIds ||
			filterProviderIds(
				providersById(this.props.visibleProviders),
				this.props.highlightedProviders
			);
		if (providerIds.length > 0) {
			this.map.fitBounds(
				getBoundingBox(providersById(this.props.visibleProviders), providerIds),
				{
					// Left padding accounts for provider list UI.
          padding: zoomPadding,
					duration: 2000,
					maxZoom: MIN_UNCLUSTERED_ZOOM,
					linear: false
				}
			);
		}
	};
	
  getPaddedMapBounds() {
    const width = this.mapRef.current.clientWidth,
      height = this.mapRef.current.clientHeight,
      leftX = zoomPadding.left,
      topY = zoomPadding.top,
      rightX = width - zoomPadding.right,
      bottomY = height - zoomPadding.bottom;
    return getBoundingBox([
      this.map.unproject([leftX, topY]),
      this.map.unproject([rightX, topY]),
      this.map.unproject([rightX, bottomY]),
      this.map.unproject([leftX, bottomY])
    ]);
  }
	/**
	 * Checks if newly selected providers are within map active bounds.
	 *
	 * TODO: This treats all selections the same. We may want to do different things depending
	 * on how the provider was selected. For example, when selecting a provider from the list,
	 * maybe we should zoom to that specific provider if not in view, but when deselecting
	 * a distance filter, maybe we want to zoom to fit all selected providers. Handling these
	 * cases is best done using more granular props passed to the map rather than having the map
	 * track changes to highlighted props.
	 */
	areNewSelectionsInView = prevProps => {
		const mapBounds = this.map.getBounds().toArray().flat();
		const mapBoundPoly = bboxPolygon(mapBounds);
		const newSelection = this.props.highlightedProviders.filter(providerId => !prevProps.highlightedProviders.includes(providerId));
		newSelection.find(providerId => {
			const providerObj = providersById(this.props.visibleProviders)[providerId];
			return !booleanPointInPolygon(point(providerObj.coordinates), mapBoundPoly);
		})
	};
	
	getZoomForDistance = distance => {
		let resolution = window.screen.height;
		let latitude = this.props.search.coordinates[1];
		let milesPerPixel = (distance * 8) / resolution;
		return (
			Math.log2(
				(24901 * Math.cos((latitude * Math.PI) / 180)) / milesPerPixel
			) - 8
		);
	};
	
	didKeyChange = (prevProps) => {
		if (this.props.filters["distance"] && this.props.filters["distance"] !== prevProps.filters["distance"]) {
			return "distance"
		}
		if (this.props.search["searchKey"] && this.props.search["searchKey"] !== prevProps.search["searchKey"]) {
			return "searchKey"
		}
		if (this.props.search["flyToProviderKey"] && this.props.search["flyToProviderKey"] !== prevProps.search["flyToProviderKey"]) {
			return "flyToProviderKey"
		}
		if (this.props.search["zoomToFitKey"] && this.props.search["zoomToFitKey"] !== prevProps.search["zoomToFitKey"]) {
			return "zoomToFitKey"
		}
		if (this.props.selectProviderKey && this.props.selectProviderKey !== prevProps.selectProviderKey) {
			return this.areNewSelectionsInView(prevProps) || "zoomToFitKey"
		}
		return false
	};
	
	smoothFlyTo = (zoom, coordinates = this.props.search.coordinates) => {
		return this.map.flyTo({
			center: coordinates,
			zoom: zoom,
			speed: 0.5,
		})
	};
	
	componentDidUpdate(prevProps) {
		let {distance} = this.props.filters;
		let {flyToProviderId} = this.props.search;
		let idLookUp = providersById(this.props.visibleProviders);
		
		
		if (this.state.loaded) {
			const features = this.geoJSONFeatures();
			this.setSourceFeatures(features);
			this.props.loadedProviderTypeIds.map(typeId => this.findLayerInMap(typeId));
			this.setSpecialLayerInMap("highlighted", "highlighted");
			
			this.updatePinAndDistanceIndicator(prevProps);
			this.markRecentSelection();
			
			/*decides whether map should move and how*/
			switch (this.didKeyChange(prevProps)) {
				case "distance":
					return this.smoothFlyTo(this.getZoomForDistance(distance));
				case "zoomToFitKey":
					return this.zoomToFit();
				case "flyToProviderKey":
					return this.smoothFlyTo(MIN_UNCLUSTERED_ZOOM, idLookUp[flyToProviderId]);
				case "searchKey":
					return this.smoothFlyTo(this.getZoomForDistance(distance || 1.5));
				default:
					return ;
			}
			
		}
	}
	
	componentWillUnmount() {
		this.map.remove();
	}
	
	render() {
    return <div className="map" ref={this.mapRef} />;
	}
}

export default Map;
