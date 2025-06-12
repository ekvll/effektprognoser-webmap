import { selectedValues } from "./map.js";
import { createPattern, createDotPattern } from "./patterns.js";
import { getBoundariesAndColors } from "./boundaries_colors.js";

const defaultColor = "#6E6E6E";
const defaultWeight = 0.27;
const defaultFillOpacity = 0.8;
const defaultOpacity = 1.0;

function getDefaultStyle() {
  // Default style function to use when no other
  // style function in available
  return {
    color: "red",
    weight: 1,
    opacity: 0.5,
    fillColor: "red",
    fillOpacity: 0.7,
  };
}

function getColor(value, boundaries, colors) {
  // Return a color from a list of colors by comparing
  // a value to an interval associated with each color
  // in the list of colors
  for (let i = 0; i < boundaries.length; i++) {
    if (value >= boundaries[i].min && value < boundaries[i].max) {
      return colors[i];
    }
  }
  return "red";
}

export function getStyleFunction() {
  // This function returns a style function based on the selected prognos and raps values
  // It checks the selected prognos and raps values to determine which style function to return
  // If the prognos is "effektbehov", it calls `createStyleFunctionEB` with the appropriate boundaries and colors
  // If the prognos is not "effektbehov", it returns a default style function
  // The `getBoundariesAndColors` function is used to retrieve the boundaries and colors based on the selected prognos and raps values
  // The function is used to style the features in the GeoJSON layer based on the selected prognos and raps values
  // The function returns a style function that can be used by Leaflet to style the features in the GeoJSON layer
  // The function is called to get the style function based on the current selections
  let boundariesAndColors = getBoundariesAndColors();

  if (selectedValues.prognos == "effektbehov") {
    return createStyleFunctionEB(
      boundariesAndColors.boundaries,
      boundariesAndColors.colors,
    );
  } else if (selectedValues.prognos == "ebd") {
    return createStyleFunctionEBD(
      boundariesAndColors.boundaries,
      boundariesAndColors.colors,
    );
  } else if (selectedValues.prognos == "ebp") {
    return createStyleFunctionEBP(
      boundariesAndColors.boundaries,
      boundariesAndColors.colors,
    );
  } else if (selectedValues.prognos == "ead") {
    return createStyleFunctionEAD(
      boundariesAndColors.boundaries,
      boundariesAndColors.colors,
    );
  } else if (selectedValues.prognos == "eap") {
    return createStyleFunctionEAP(
      boundariesAndColors.boundaries,
      boundariesAndColors.colors,
    );
  } else {
    return getDefaultStyle();
  }
}

// From here on are the specific style functions for "effektbehov", "ebd", "ebp", "elanvandning" and "eap"

function createStyleFunctionEB(boundaries, colors) {
  return function (feature) {
    let value = feature.properties.eb;
    let color = getColor(value, boundaries, colors);

    return {
      color: defaultColor,
      opacity: defaultOpacity,
      weight: defaultWeight,
      fillColor: color,
      fillOpacity: defaultFillOpacity,
    };
  };
}

function createStyleFunctionEBD(boundaries, colors) {
  return function (feature) {
    let value = feature.properties.ebd;
    let color;
    if (value < 0 && selectedValues.raps !== "bostader") {
      const absValue = Math.abs(value);
      const colorForDot = "transparent";
      const patternId = `dotPattern-${colorForDot}`;
      createDotPattern(colorForDot, patternId);
      color = `url(#${patternId})`;
    } else if (value > 10e6 - 1) {
      const baseValue = feature.properties.eb;
      const baseColor = getColor(baseValue, boundaries, colors);
      const patternId = `hatch-${baseColor}`;
      createPattern(baseColor, patternId);
      color = `url(#${patternId})`;
    } else {
      color = getColor(value, boundaries, colors);
    }
    return {
      color: defaultColor,
      opacity: defaultOpacity,
      weight: defaultWeight,
      fillColor: color,
      fillOpacity: defaultFillOpacity,
    };
  };
}

function createStyleFunctionEBP(boundaries, colors) {
  return function (feature) {
    let value = feature.properties.ebp;
    let color;

    if (value < 0 && selectedValues.raps !== "bostader") {
      const absValue = Math.abs(value);
      const colorForDot = "transparent";
      const patternId = `dotPattern-${colorForDot}`;
      createDotPattern(colorForDot, patternId);
      color = `url(#${patternId})`;
    } else if (value > 10e6 - 1) {
      const baseColor = "transparent";
      const patternId = `hatch-${baseColor}`;
      createPattern(baseColor, patternId);
      color = `url(#${patternId})`;
    } else {
      color = getColor(value, boundaries, colors);
    }

    return {
      color: defaultColor,
      opacity: defaultOpacity,
      weight: defaultWeight,
      fillColor: color,
      fillOpacity: defaultFillOpacity,
    };
  };
}

function createStyleFunctionEAD(boundaries, colors) {
  return function (feature) {
    let value = feature.properties.ead;
    let color;
    if (value < 0 && selectedValues.raps !== "bostader") {
      const absValue = Math.abs(value);
      const colorForDot = "transparent";
      const patternId = `dotPattern-${colorForDot}`;
      createDotPattern(colorForDot, patternId);
      color = `url(#${patternId})`;
    } else if (value > 10e6 - 1) {
      const baseValue = feature.properties.ea;
      const baseColor = getColor(baseValue, boundaries, colors);
      const patternId = `hatch-${baseColor}`;
      createPattern(baseColor, patternId);
      color = `url(#${patternId})`;
    } else {
      color = getColor(value, boundaries, colors);
    }
    return {
      color: defaultColor,
      opacity: defaultOpacity,
      weight: defaultWeight,
      fillColor: color,
      fillOpacity: defaultFillOpacity,
    };
  };
}

function createStyleFunctionEAP(boundaries, colors) {
  return function (feature) {
    let value = feature.properties.eap;
    let color;

    if (value < 0 && selectedValues.raps !== "bostader") {
      const absValue = Math.abs(value);
      const colorForDot = "transparent";
      const patternId = `dotPattern-${colorForDot}`;
      createDotPattern(colorForDot, patternId);
      color = `url(#${patternId})`;
    } else if (value > 10e6 - 1) {
      const baseColor = "transparent";
      const patternId = `hatch-${baseColor}`;
      createPattern(baseColor, patternId);
      color = `url(#${patternId})`;
    } else {
      color = getColor(value, boundaries, colors);
    }

    return {
      color: defaultColor,
      opacity: defaultOpacity,
      weight: defaultWeight,
      fillColor: color,
      fillOpacity: defaultFillOpacity,
    };
  };
}
