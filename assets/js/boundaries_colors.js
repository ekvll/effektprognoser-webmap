import { selectedValues } from "./map.js";


export function getBoundariesAndColors() {
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
