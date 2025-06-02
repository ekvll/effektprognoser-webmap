import { selectedValues } from "./map.js";
import { createPattern, createDotPattern } from "./patterns.js";
import { getBoundariesAndColors } from "./boundaries_colors.js";

const defaultColor = "#6E6E6E";
const defaultWeight = 0.27;
const defaultFillOpacity = 0.8;
const defaultOpacity = 1.0;

function getDefaultStyle() {
	return {
		color: "red",
		weight: 1,
		opacity: 0.5,
		fillColor: "red",
		fillOpacity: 0.7,
	};
}

function getColor(value, boundaries, colors) {
	for (let i = 0; i < boundaries.length; i++) {
		if (value >= boundaries[i].min && value < boundaries[i].max) {
			return colors[i];
		}
	}
	return "#ebebeb";
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
		return createStyleFunctionEB(boundariesAndColors.boundaries, boundariesAndColors.colors);
	
	} else if (selectedValues.prognos == "ebd") {
		return createStyleFunctionEBD(boundariesAndColors.boundaries, boundariesAndColors.colors);
	
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

		if (value < 0) {
			const absValue = Math.abs(value);  // For coloring logic
			const colorForDot = "transparent"; // Default color for negative values
			const patternId = `dotPattern-${absValue}`;
			createDotPattern(colorForDot, patternId);
			color = `url(#${patternId})`;

		} else if (value > 10e6-1) {
			// let value2 = feature.properties ?? 0;
			let value2 = feature.properties.ebd;
			let color2 = getColor(value2, boundaries, colors);
			const patternId = `hatch-${value2}`;
			createPattern(color2, patternId);
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





