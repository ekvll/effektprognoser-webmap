import { map, selectedValues, selectedGranser } from "./map.js";
import { getStyleFunction } from "./styles.js";

let currentLayer;
let currentKommunGranser;
let currentNatagareGranser;


export async function loadNatagareGranser() {
	// This function loads the natagare granser layer onto the Leaflet map based on the selected values
	// It checks if the layer has already been created, and if not, it creates a new layer using the GeoJSON data
	// It styles the layer with a specific color, weight, and opacity
	const dataPath = `assets/data/background/Natomraden_ll84_dissolved.geojson`;
	console.log(dataPath);

	// If the layer hasn't been created yet, load it first
	if (!currentNatagareGranser) {
		currentNatagareGranser = new L.GeoJSON.AJAX(dataPath, {
			style: function () {
				return {
					color: "#000",
					weight: 1,
					opacity: 0.5,
					fillOpacity: 0,
					fillColor: "#000",
					dashArray: "5, 5",
					dashOffset: "0",
				};
			},
		});

		// Only add layer to map if it's supposed to be visible
		if (selectedGranser.natagare) {
			currentNatagareGranser.addTo(map);
			console.log("Natagare granser layer added");
		}
	} else {
		// Toggle visibility
		if (selectedGranser.natagare) {
			if (!map.hasLayer(currentNatagareGranser)) {
				currentNatagareGranser.addTo(map);
				console.log("Natagare granser layer shown");
			}
		} else {
			if (map.hasLayer(currentNatagareGranser)) {
				map.removeLayer(currentNatagareGranser);
				console.log("Natagare granser layer hidden");
			}
		}
	}
}


export async function loadKommunGranser() {
	// This function loads the kommun granser layer onto the Leaflet map based on the selected values
	// It checks if the layer has already been created, and if not, it creates a new layer using the GeoJSON data
	// It styles the layer with a specific color, weight, and opacity
	const dataPath = `assets/data/background/kommungranser_rss_skane_dissolved.geojson`;
	console.log(dataPath);

	// If the layer hasn't been created yet, load it first
	if (!currentKommunGranser) {
		currentKommunGranser = new L.GeoJSON.AJAX(dataPath, {
			style: function () {
				return {
					color: "#000",
					weight: 1,
					opacity: 0.5,
					fillOpacity: 0,
					fillColor: "#000",
					dashArray: "5, 5",
					dashOffset: "0",
				};
			},
		});

		// Only add layer to map if it's supposed to be visible
		if (selectedGranser.kommun) {
			currentKommunGranser.addTo(map);
			console.log("Kommun granser layer added");
		}
	} else {
		// Toggle visibility
		if (selectedGranser.kommun) {
			if (!map.hasLayer(currentKommunGranser)) {
				currentKommunGranser.addTo(map);
				console.log("Kommun granser layer shown");
			}
		} else {
			if (map.hasLayer(currentKommunGranser)) {
				map.removeLayer(currentKommunGranser);
				console.log("Kommun granser layer hidden");
			}
		}
	}
}


export async function loadDataLayer() {
	// This function loads a GeoJSON data layer onto the Leaflet map based on the selected values
	// It constructs the path to the GeoJSON file using the selected region, year, and raps values
	// It removes any existing layer from the map before adding the new data layer
	
	// The data layer is styled using the `getStyleFunction` which returns a function to style the features
	
	// Each feature in the GeoJSON has a popup that displays information about the network company, municipality, and ID
	// The popup is bound to the layer and opens when the layer is clicked
	
	// The path to the GeoJSON file is constructed dynamically based on the selected values
	// The function logs the path to the console for debugging purposes
	// It uses the `L.GeoJSON.AJAX` to load the GeoJSON data asynchronously
	// The function is called to update the map with the new data layer based on the user's selections
	const dataPath = `assets/data/${selectedValues.region}/${selectedValues.year}_${selectedValues.raps}.geojson`;
	console.log(dataPath);

	if (currentLayer) {
		map.removeLayer(currentLayer);
		currentLayer = null;
		console.log("Layer removed");
	}

	const dataLayer = new L.GeoJSON.AJAX(dataPath, {
		style: getStyleFunction(),
		onEachFeature: function (feature, layer) {
			const popupContent = `
				<table style="width:100%; border-collapse: collapse;">
				<tr>
				<th style="text-align:left; padding: 0px; border-bottom: 1px solid #ddd;"><strong>Nätbolag:</strong></th>
				<td style="padding: 8px; border-bottom: 1px solid #ddd;">${feature.properties.natagare}</td>
				</tr>
				<tr>
				<th style="text-align:left; padding: 0px; border-bottom: 1px solid #ddd;"><strong>Kommun:</strong></th>
				<td style="padding: 8px; border-bottom: 1px solid #ddd;">${feature.properties.kn}</td>
				</tr>
				<tr>
				<th style="text-align:left; padding: 0px; border-bottom: 1px solid #ddd;"><strong>ID:</strong></th>
				<td style="padding: 8px; border-bottom: 1px solid #ddd;">${feature.properties.rid}</td>
				</tr>
				</table>
			`;
			layer.on("click", function (e) {
				layer.bindPopup(popupContent).openPopup(e.latlng);
			});
		},
	});

	dataLayer.addTo(map);
	currentLayer = dataLayer;
}
