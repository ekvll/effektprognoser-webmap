import { selectedValues } from "./map.js";

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

function createDotPattern(color, id) {
	// This function creates a dot pattern for the map based on the provided color and ID
	// It creates a pattern element in the SVG namespace and appends it to the document
	// It first checks if a pattern with the same ID already exists and removes it if so
	// The pattern consists of a rectangle filled with the specified color and a circle
	// The rectangle is 8x8 pixels and the circle is drawn at the center with a radius of 0.75 pixels
	// The pattern is added to the SVG definitions section of the document
	// The function is used to create a pattern that can be used for styling features in the GeoJSON layer
	const svgNS = "http://www.w3.org/2000/svg";

	const oldPattern = document.getElementById(id);
	if (oldPattern) {
		oldPattern.remove();
	}

	const pattern = document.createElementNS(svgNS, "pattern");
	pattern.setAttribute("id", id);
	pattern.setAttribute("width", "8");
	pattern.setAttribute("height", "8");
	pattern.setAttribute("patternUnits", "userSpaceOnUse");

	const rect = document.createElementNS(svgNS, "rect");
	rect.setAttribute("width", "8");
	rect.setAttribute("height", "8");
	rect.setAttribute("fill", color || "transparent");

	const circle = document.createElementNS(svgNS, "circle");
	circle.setAttribute("cx", "3");
	circle.setAttribute("cy", "3");
	circle.setAttribute("r", "0.75");
	circle.setAttribute("fill", "black");

	pattern.appendChild(rect);
	pattern.appendChild(circle);

	let defs = document.querySelector("defs");
	if (!defs) {
		defs = document.createElementNS(svgNS, "defs");
		document.querySelector("svg").appendChild(defs);
	}
	defs.appendChild(pattern);
}

function createPattern(color, id) {
	// This function creates a pattern for the map based on the provided color and ID
	// It creates a pattern element in the SVG namespace and appends it to the document
	// It first checks if a pattern with the same ID already exists and removes it if so
	// The pattern consists of a rectangle filled with the specified color and a diagonal line
	// The rectangle is 10x10 pixels and the line is drawn from the top-left to the bottom-right corner
	// The pattern is added to the SVG definitions section of the document
	// The function is used to create a pattern that can be used for styling features in the GeoJSON layer
	const svgNS = "http://www.w3.org/2000/svg";

	// Remove existing pattern with the same ID
	const oldPattern = document.getElementById(id);
	if (oldPattern) {
		// console.log("Removing old pattern with ID:", id);
		oldPattern.remove();
	}
	const pattern = document.createElementNS(svgNS, "pattern");
	pattern.setAttribute("id", id);
	pattern.setAttribute("width", "10");
	pattern.setAttribute("height", "10");
	pattern.setAttribute("patternUnits", "userSpaceOnUse");

	const rect = document.createElementNS(svgNS, "rect");
	rect.setAttribute("width", "10");
	rect.setAttribute("height", "10");
	rect.setAttribute("fill", color);

	const path = document.createElementNS(svgNS, "path");
	path.setAttribute("d", "M0,0 L10,10");
	path.setAttribute("style", "stroke:black; stroke-width:0.25");

	pattern.appendChild(rect);
	pattern.appendChild(path);

	const defs = document.querySelector("defs");
	defs.appendChild(pattern);
}

function getBoundariesAndColors() {
	// This function returns the boundaries and colors based on the selected prognos and raps values
	// It checks the selected prognos and raps values to determine which boundaries and colors to return
	// If the prognos is "effektbehov", it returns specific boundaries and colors based on the selected raps value

	if (selectedValues.prognos == "effektbehov") {
		if (selectedValues.raps == "total") {
			return {
				boundaries: [
					{min: 10e6 - 1, max: Infinity},
					{min: 7, max: 10e6 - 1},
					{min: 1, max: 7},
					{min: 0.1, max: 1},
					{min: -Infinity, max: 0.1},
				],
				colors: ["url(#hatch1)", "#060807", "#163019", "#296633", "#599E66"],
			};
		} else if (selectedValues.raps == "bostader") {
			return {
				boundaries: [
					{ min: 10e6 - 1, max: Infinity },
					{ min: 7, max: 10e6 - 1 },
					{ min: 1, max: 7 },
					{ min: 0.1, max: 1 },
					{ min: -Infinity, max: 0.1 },
				],
				colors: ["url(#hatch1)", "#3E2C13", "#C46737", "#EFA327", "#FEE292"],
			};
		} else if (selectedValues.raps == "industri_och_bygg") {
			return {
				boundaries: [
					{ min: 10e6 - 1, max: Infinity },
					{ min: 7, max: 10e6 - 1 },
					{ min: 1, max: 7 },
					{ min: 0.1, max: 1 },
					{ min: -Infinity, max: 0.1 },
				],
				colors: ["url(#hatch1)", "#4B1216", "#961B1E", "#ED1C29", "#F0675E"],
			};
		} else if (selectedValues.raps == "offentlig_och_privat_sektor") {
			return {
				boundaries: [
					{ min: 10e6 - 1, max: Infinity },
					{ min: 7, max: 10e6 - 1 },
					{ min: 1, max: 7 },
					{ min: 0.1, max: 1 },
					{ min: -Infinity, max: 0.1 },
				],
				colors: ["url(#hatch1)", "#10101D", "#393777", "#7E7DBC", "#BCBADD"],
			};
		} else if (selectedValues.raps == "transport") {
			return {
				boundaries: [
					{ min: 10e6 - 1, max: Infinity },
					{ min: 7, max: 10e6 - 1 },
					{ min: 1, max: 7 },
					{ min: 0.1, max: 1 },
					{ min: -Infinity, max: 0.1 },
				],
				colors: ["url(#hatch1)", "#091C1D", "#155384", "#068AB6", "#7BACAE"],
			};
		}

	// Effektbehov Difference
	} else if (selectedValues.prognos == "ebd") {
		if (selectedValues.raps == "total") {
			return {
				boundaries: [
					{min: 10e6 - 1, max: Infinity},
					{min: 7, max: 10e6 - 1},
					{min: 1, max: 7},
					{min: 0.1, max: 1},
					{min: -Infinity, max: 0.1},
				],
				colors: ["url(#hatch1)", "#060807", "#163019", "#296633", "#599E66"],
			};
		} else if (selectedValues.raps == "bostader") {
			return {
				boundaries: [
					{ min: 10e6 - 1, max: Infinity },
					{ min: 7, max: 10e6 - 1 },
					{ min: 1, max: 7 },
					{ min: 0.1, max: 1 },
					{ min: -Infinity, max: 0.1 },
				],
				colors: ["url(#hatch1)", "#3E2C13", "#C46737", "#EFA327", "#FEE292"],
			};
		} else if (selectedValues.raps == "industri_och_bygg") {
			return {
				boundaries: [
					{ min: 10e6 - 1, max: Infinity },
					{ min: 7, max: 10e6 - 1 },
					{ min: 1, max: 7 },
					{ min: 0.1, max: 1 },
					{ min: -Infinity, max: 0.1 },
				],
				colors: ["url(#hatch1)", "#4B1216", "#961B1E", "#ED1C29", "#F0675E"],
			};
		} else if (selectedValues.raps == "offentlig_och_privat_sektor") {
			return {
				boundaries: [
					{ min: 10e6 - 1, max: Infinity },
					{ min: 7, max: 10e6 - 1 },
					{ min: 1, max: 7 },
					{ min: 0.1, max: 1 },
					{ min: -Infinity, max: 0.1 },
				],
				colors: ["url(#hatch1)", "#10101D", "#393777", "#7E7DBC", "#BCBADD"],
			};
		} else if (selectedValues.raps == "transport") {
			return {
				boundaries: [
					{ min: 10e6 - 1, max: Infinity },
					{ min: 7, max: 10e6 - 1 },
					{ min: 1, max: 7 },
					{ min: 0.1, max: 1 },
					{ min: -Infinity, max: 0.1 },
				],
				colors: ["url(#hatch1)", "#091C1D", "#155384", "#068AB6", "#7BACAE"],
			};
		} 
	
	
	// Effektbehov Percentage
	} else if (selectedValues.prognos == "ebp") {
		if (selectedValues.raps == "total") {
			return {
				boundaries: [
					{min: 10e6 - 1, max: Infinity},
					{min: 7, max: 10e6 - 1},
					{min: 1, max: 7},
					{min: 0.1, max: 1},
					{min: -Infinity, max: 0.1},
				],
				colors: ["url(#hatch1)", "#060807", "#163019", "#296633", "#599E66"],
			};
		} else if (selectedValues.raps == "bostader") {
			return {
				boundaries: [
					{ min: 10e6 - 1, max: Infinity },
					{ min: 7, max: 10e6 - 1 },
					{ min: 1, max: 7 },
					{ min: 0.1, max: 1 },
					{ min: -Infinity, max: 0.1 },
				],
				colors: ["url(#hatch1)", "#3E2C13", "#C46737", "#EFA327", "#FEE292"],
			};
		} else if (selectedValues.raps == "industri_och_bygg") {
			return {
				boundaries: [
					{ min: 10e6 - 1, max: Infinity },
					{ min: 7, max: 10e6 - 1 },
					{ min: 1, max: 7 },
					{ min: 0.1, max: 1 },
					{ min: -Infinity, max: 0.1 },
				],
				colors: ["url(#hatch1)", "#4B1216", "#961B1E", "#ED1C29", "#F0675E"],
			};
		} else if (selectedValues.raps == "offentlig_och_privat_sektor") {
			return {
				boundaries: [
					{ min: 10e6 - 1, max: Infinity },
					{ min: 7, max: 10e6 - 1 },
					{ min: 1, max: 7 },
					{ min: 0.1, max: 1 },
					{ min: -Infinity, max: 0.1 },
				],
				colors: ["url(#hatch1)", "#10101D", "#393777", "#7E7DBC", "#BCBADD"],
			};
		} else if (selectedValues.raps == "transport") {
			return {
				boundaries: [
					{ min: 10e6 - 1, max: Infinity },
					{ min: 7, max: 10e6 - 1 },
					{ min: 1, max: 7 },
					{ min: 0.1, max: 1 },
					{ min: -Infinity, max: 0.1 },
				],
				colors: ["url(#hatch1)", "#091C1D", "#155384", "#068AB6", "#7BACAE"],
			};
		} 
	

	// Elanvandning
	} else if (selectedValues.prognos == "elanvandning") {
		if (selectedValues.raps == "total") {
			return {
				boundaries: [
					{min: 10e6 - 1, max: Infinity},
					{min: 7, max: 10e6 - 1},
					{min: 1, max: 7},
					{min: 0.1, max: 1},
					{min: -Infinity, max: 0.1},
				],
				colors: ["url(#hatch1)", "#060807", "#163019", "#296633", "#599E66"],
			};
		} else if (selectedValues.raps == "bostader") {
			return {
				boundaries: [
					{ min: 10e6 - 1, max: Infinity },
					{ min: 7, max: 10e6 - 1 },
					{ min: 1, max: 7 },
					{ min: 0.1, max: 1 },
					{ min: -Infinity, max: 0.1 },
				],
				colors: ["url(#hatch1)", "#3E2C13", "#C46737", "#EFA327", "#FEE292"],
			};
		} else if (selectedValues.raps == "industri_och_bygg") {
			return {
				boundaries: [
					{ min: 10e6 - 1, max: Infinity },
					{ min: 7, max: 10e6 - 1 },
					{ min: 1, max: 7 },
					{ min: 0.1, max: 1 },
					{ min: -Infinity, max: 0.1 },
				],
				colors: ["url(#hatch1)", "#4B1216", "#961B1E", "#ED1C29", "#F0675E"],
			};
		} else if (selectedValues.raps == "offentlig_och_privat_sektor") {
			return {
				boundaries: [
					{ min: 10e6 - 1, max: Infinity },
					{ min: 7, max: 10e6 - 1 },
					{ min: 1, max: 7 },
					{ min: 0.1, max: 1 },
					{ min: -Infinity, max: 0.1 },
				],
				colors: ["url(#hatch1)", "#10101D", "#393777", "#7E7DBC", "#BCBADD"],
			};
		} else if (selectedValues.raps == "transport") {
			return {
				boundaries: [
					{ min: 10e6 - 1, max: Infinity },
					{ min: 7, max: 10e6 - 1 },
					{ min: 1, max: 7 },
					{ min: 0.1, max: 1 },
					{ min: -Infinity, max: 0.1 },
				],
				colors: ["url(#hatch1)", "#091C1D", "#155384", "#068AB6", "#7BACAE"],
			};
		} 
	

	// Elanvandning Percentage
	} else if (selectedValues.prognos == "eap") {
		if (selectedValues.raps == "total") {
			return {
				boundaries: [
					{min: 10e6 - 1, max: Infinity},
					{min: 7, max: 10e6 - 1},
					{min: 1, max: 7},
					{min: 0.1, max: 1},
					{min: -Infinity, max: 0.1},
				],
				colors: ["url(#hatch1)", "#060807", "#163019", "#296633", "#599E66"],
			};
		} else if (selectedValues.raps == "bostader") {
			return {
				boundaries: [
					{ min: 10e6 - 1, max: Infinity },
					{ min: 7, max: 10e6 - 1 },
					{ min: 1, max: 7 },
					{ min: 0.1, max: 1 },
					{ min: -Infinity, max: 0.1 },
				],
				colors: ["url(#hatch1)", "#3E2C13", "#C46737", "#EFA327", "#FEE292"],
			};
		} else if (selectedValues.raps == "industri_och_bygg") {
			return {
				boundaries: [
					{ min: 10e6 - 1, max: Infinity },
					{ min: 7, max: 10e6 - 1 },
					{ min: 1, max: 7 },
					{ min: 0.1, max: 1 },
					{ min: -Infinity, max: 0.1 },
				],
				colors: ["url(#hatch1)", "#4B1216", "#961B1E", "#ED1C29", "#F0675E"],
			};
		} else if (selectedValues.raps == "offentlig_och_privat_sektor") {
			return {
				boundaries: [
					{ min: 10e6 - 1, max: Infinity },
					{ min: 7, max: 10e6 - 1 },
					{ min: 1, max: 7 },
					{ min: 0.1, max: 1 },
					{ min: -Infinity, max: 0.1 },
				],
				colors: ["url(#hatch1)", "#10101D", "#393777", "#7E7DBC", "#BCBADD"],
			};
		} else if (selectedValues.raps == "transport") {
			return {
				boundaries: [
					{ min: 10e6 - 1, max: Infinity },
					{ min: 7, max: 10e6 - 1 },
					{ min: 1, max: 7 },
					{ min: 0.1, max: 1 },
					{ min: -Infinity, max: 0.1 },
				],
				colors: ["url(#hatch1)", "#091C1D", "#155384", "#068AB6", "#7BACAE"],
			};
		} 
	}
}


