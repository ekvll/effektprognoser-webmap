import { map, selectedValues, selectedGranser } from "./map.js";
import { getStyleFunction } from "./styles.js";
import { zoomThresholds } from "./config.js";
import {
  loadTileLayer,
  loadRoads,
  loadLakes,
  loadCities,
  loadDanmark,
  loadRoadsBoundary,
  currentLayer,
  danmarkLayer,
  tileLayer,
  citiesLayer,
  roadsLayerBoundary,
  roadsLayer,
  lakesLayer,
} from "./loader.js";

function addRemoveLayerPromise(zoomLevel, layer, addFunc, th, reverse) {
  return new Promise((resolve) => {
    if (reverse === 0) {
      if (zoomLevel >= zoomThresholds[th]) {
        if (!map.hasLayer(layer)) {
          addFunc(); // This should call layer.addTo(map)
        }
        resolve(); // Already added
      } else if (map.hasLayer(layer)) {
        map.removeLayer(layer);
        resolve(); // Resolves even after removal
      }
    } else if (reverse === 1) {
      if (zoomLevel < zoomThresholds[th]) {
        if (!map.hasLayer(layer)) {
          addFunc(); // This should call layer.addTo(map)
        }
        resolve(); // Already added
      } else if (map.hasLayer(layer)) {
        map.removeLayer(layer);
        resolve(); // Resolves even after removal
      }
    } else {
      resolve(); // Nothing to do
    }
  });
}

function addRemoveLayer(zoomLevel, layer, addFunc, th, reverse) {
  if (reverse === 0) {
    if (zoomLevel >= zoomThresholds[th]) {
      if (!map.hasLayer(layer)) {
        addFunc();
      }
    } else if (zoomLevel < zoomThresholds[th]) {
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    }
  } else {
    if (zoomLevel < zoomThresholds[th]) {
      if (!map.hasLayer(layer)) {
        addFunc();
      }
    } else if (zoomLevel >= zoomThresholds[th]) {
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    }
  }
}

async function handleZoomLayers(zoomLevel, layer, func, th, reverse) {
  await addRemoveLayerPromise(zoomLevel, layer, func, th, reverse);
}

function onZoomEnd() {
  // This function adjusts the visibility (add/remove) of layers based on the current zoom level
  // The higher the zoom level the more zoomed in you are
  // Zoom level equal to 12 is more zoomed in than zoom level equal to 10
  const zoomLevel = map.getZoom();

  addRemoveLayer(zoomLevel, tileLayer, loadTileLayer, 2, 0);
  addRemoveLayer(zoomLevel, citiesLayer, loadCities, 2, 1);
  addRemoveLayer(zoomLevel, lakesLayer, loadLakes, 2, 1);
  addRemoveLayer(zoomLevel, danmarkLayer, loadDanmark, 2, 1);
  addRemoveLayer(zoomLevel, roadsLayerBoundary, loadRoadsBoundary, 2, 1);
  addRemoveLayer(zoomLevel, roadsLayer, loadRoads, 2, 1);

  console.log(zoomLevel);
}

export function adjustBackgroundLayersOnZoom() {
  map.on("zoomend", onZoomEnd);

  onZoomEnd();
}
