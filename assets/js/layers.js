import { map, selectedValues } from "./map.js";
import { getStyleFunction } from "./styles.js";

let currentLayer;

export async function loadKommunGranser() {
	const dataPath = `assets/data/background/kommungranser_rss_skane.geojson`;
	console.log(dataPath);
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
