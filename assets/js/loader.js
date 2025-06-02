import { map, selectedValues, selectedGranser } from "./map.js";
import { getStyleFunction } from "./styles.js";

const layerCache = {};
let currentLayer;
let danmarkLayer;
let tileLayer;
let currentKommunGranser;
let currentNatagareGranser;
let citiesLayer;
let lakesLayer;
let roadsLayer;
let roadsLayerBoundary;
let canvasRenderer = L.canvas();

// Function to bring a layer to the front with a timer
function bringLayerToFrontWithTimer(layer, intervalDuration, totalDuration) {
  // Calculate the total number of intervals
  let intervals = totalDuration / intervalDuration;

  // Initialize the interval
  const timer = setInterval(() => {
    // Bring the specified layer to the back
    layer.bringToFront();

    // Decrement the interval count
    if (--intervals <= 0) {
      clearInterval(timer); // Clear the interval after the total duration
    }
  }, intervalDuration);
}

export function loadNatagareGranser() {
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

export function loadKommunGranser() {
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

export function loadDataLayer() {
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

export function loadRoadsBoundary() {
  const dataPath = `assets/data/background/vagar_2.geojson`;
  const cacheKey = "roads_boundary";

  if (layerCache[cacheKey]) {
    map.addLayer(layerCache[cacheKey]);
    layerCache[cacheKey].bringToFront();
    console.log("Cached roads boundary layer added");
  } else {
    roadsLayerBoundary = new L.GeoJSON.AJAX(dataPath, {
      style: {
        // Add styling
        color: "#c3c3c3", // Line color
        weight: 3, // Line thickness
        opacity: 1, // Line opacity
        fill: false,
        //   fillColor: "#eeead7",
        //   fillOpacity: 1,
        interactive: false,
        zIndex: 1000,
      },
    });
    roadsLayerBoundary.addTo(map);
    console.log("Roads boundary layer added");
    layerCache[cacheKey] = roadsLayerBoundary;
  }
}

export function loadRoads() {
  const dataPath = `assets/data/background/vagar_2.geojson`;

  if (layerCache[dataPath]) {
    map.addLayer(layerCache[dataPath]);
    console.log("Cached roads layer added");
  } else {
    roadsLayer = new L.GeoJSON.AJAX(dataPath, {
      style: {
        // Add styling
        color: "#f5f5f5", // Line color
        weight: 1.5, // Line thickness
        opacity: 1, // Line opacity
        fillColor: "#f5f5f5",
        fillOpacity: 1,
        interactive: false,
        zIndex: 2000,
      },
    });

    roadsLayer.addTo(map);
    console.log("Roads layer added");
    layerCache[dataPath] = roadsLayer;
  }
}

export function loadLakes() {
  const dataPath = `assets/data/background/sjoar_1.geojson`;
  if (layerCache[dataPath]) {
    map.addLayer(layerCache[dataPath]);
    console.log("Cached lakes layer added");
  } else {
    lakesLayer = new L.GeoJSON.AJAX("assets/data/background/sjoar_1.geojson", {
      // renderer: canvasRenderer,  // Render with canvas, instead of SVG
      style: {
        // Add styling
        color: "#d1caab",
        weight: 0.5,
        opacity: 1.0,
        fillColor: "#eeead7",
        fillOpacity: 1.0,
      },
    });
    lakesLayer.addTo(map);
    console.log("Lakes layer added");
    layerCache[dataPath] = lakesLayer;
  }
}

export function loadTileLayer() {
  const dataUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  if (layerCache[dataUrl]) {
    map.addLayer(layerCache[dataUrl]);
    console.log("Cached tile layer added");
  } else {
    tileLayer = L.tileLayer(dataUrl, {
      attribution: "© OpenStreetMap contributors",
    });
    tileLayer.addTo(map);
    console.log("Tile layer added");
    layerCache[dataUrl] = tileLayer;
  }
}

export function loadDanmark() {
  const dataPath = `assets/data/background/land_2_danmark.geojson`;
  if (layerCache[dataPath]) {
    map.addLayer(layerCache[dataPath]);
  } else {
    danmarkLayer = new L.GeoJSON.AJAX(dataPath, {
      renderer: canvasRenderer,
      style: {
        color: "#d1caab",
        weight: 0.5,
        opacity: 1.0,
        fillColor: "#f7f3df",
        fillOpacity: 1.0,
      },
    });
    danmarkLayer.addTo(map);
    layerCache[dataPath] = danmarkLayer;
  }
}

export function loadCities() {
  // Function to load the city name labels layer
  const dataPath = `assets/data/background/city_1.geojson`;

  if (layerCache[dataPath]) {
    // Check if the layer is already loaded, and stored in cache
    // Use cached layer
    map.addLayer(layerCache[dataPath]);
    console.log("Cached cities layer added");
  } else {
    citiesLayer = new L.GeoJSON.AJAX(dataPath, {
      renderer: canvasRenderer, // Render with canvas, instead of SVG
      pointToLayer: function (feature, latlng) {
        // Define a custom pointToLayer function
        var marker = L.circleMarker(latlng, {
          // Create a circle marker
          radius: 0,
          fillColor: "#000000",
          color: "#000",
          weight: 0,
          opacity: 0,
          fillOpacity: 0,
          zIndex: 1000,
        });

        // Bind a tooltip or popup with the 'name' property from the GeoJSON feature
        if (feature.properties && feature.properties.name) {
          // Check if the 'name' property exists
          marker
            .bindTooltip(feature.properties.name, {
              // Bind a tooltip with the 'name' property
              permanent: true,
              direction: "right",
              className: "custom-tooltip", // Add your custom class, for CSS styling
            })
            .openTooltip();
        }

        return marker;
      },
    });
    citiesLayer.addTo(map);
    console.log("Cities layer added");
    layerCache[dataPath] = citiesLayer; // Cache the layer
  }
}

export {
  currentLayer,
  danmarkLayer,
  tileLayer,
  currentKommunGranser,
  currentNatagareGranser,
  citiesLayer,
  lakesLayer,
  roadsLayer,
  roadsLayerBoundary,
};
