import { map, selectedValues } from "./map.js";
import { zoomThresholds } from "./config.js";
import {
  loadTileLayer,
  loadRoads,
  loadLakes,
  loadCities,
  loadCitiesHiRes,
  loadDanmark,
  loadRoadsBoundary,
  loadRoadsHiRes,
  loadRoadsBoundaryHiRes,
  currentLayer,
  danmarkLayer,
  tileLayer,
  citiesLayer,
  citiesLayerHiRes,
  roadsLayerBoundary,
  roadsLayer,
  roadsLayerHiRes,
  roadsLayerBoundaryHiRes,
  lakesLayer,
} from "./loader.js";

function addRemoveLayer_bk(zoomLevel, layer, addFunc, th, reverse) {
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
function addRemoveLayer(zoomLevel, layer, addFunc, th, reverse) {
  console.log(Object.keys(zoomThresholds).length);

  let highTh;

  if (th + 1 <= Object.keys(zoomThresholds).length) {
    highTh = th + 1;
  } else {
    highTh = th;
  }

  let lowTh;

  if (th - 1 >= 0) {
    lowTh = th - 1;
  } else {
    lowTh = th;
  }

  // If reverse
  if (reverse === 0) {
    if (highTh !== th) {
      if (
        zoomLevel < zoomThresholds[highTh] &&
        zoomLevel >= zoomThresholds[th]
      ) {
        if (!map.hasLayer(layer)) {
          addFunc();
        }
      } else {
        if (map.hasLayer(layer)) {
          map.removeLayer(layer);
        }
      }
    } else {
      if (zoomLevel >= zoomThresholds[th]) {
        if (!map.hasLayer(layer)) {
          addFunc();
        }
      } else {
        if (map.hasLayer(layer)) {
          map.removeLayer(layer);
        }
      }
    }

    // If not reverse
  } else {
    if (zoomLevel < zoomThresholds[th]) {
      if (!map.hasLayer(layer)) {
        addFunc();
      }
    } else {
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    }
  }
}

function onZoomEnd() {
  // This function adjusts the visibility (add/remove) of layers based on the current zoom level
  // The higher the zoom level the more zoomed in you are
  // Zoom level equal to 12 is more zoomed in than zoom level equal to 10
  const zoomLevel = map.getZoom();

  addRemoveLayer(zoomLevel, tileLayer, loadTileLayer, 3, 0);
  addRemoveLayer(
    zoomLevel,
    roadsLayerBoundaryHiRes,
    loadRoadsBoundaryHiRes,
    2,
    0,
  );
  addRemoveLayer(zoomLevel, roadsLayerHiRes, loadRoadsHiRes, 2, 0);
  addRemoveLayer(zoomLevel, citiesLayer, loadCities, 2, 1);
  addRemoveLayer(zoomLevel, citiesLayerHiRes, loadCitiesHiRes, 2, 0);
  addRemoveLayer(zoomLevel, lakesLayer, loadLakes, 2, 1);
  addRemoveLayer(zoomLevel, danmarkLayer, loadDanmark, 2, 1);
  addRemoveLayer(zoomLevel, roadsLayerBoundary, loadRoadsBoundary, 2, 1);
  addRemoveLayer(zoomLevel, roadsLayer, loadRoads, 2, 1);
}

export function adjustBackgroundLayersOnZoom() {
  map.on("zoomend", onZoomEnd);

  onZoomEnd();
}
