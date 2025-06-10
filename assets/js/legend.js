import { svgDiagonalLines } from "./patterns.js";
import { map, selectedValues } from "./map.js";
import { getBoundariesAndColors } from "./boundaries_colors.js";

let negativeValues = null;
let belowZero;

const svgDot = `
<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="dotPattern" patternUnits="userSpaceOnUse" width="5" height="5">
      <circle cx="2.5" cy="2.5" r="1" fill="black" />
    </pattern>
  </defs>
  <rect width="20" height="20" fill="url(#dotPattern)" />
</svg>
`;

const svgCode = `
<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="diagonalLines" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="10" stroke="black" stroke-width="1" />
    </pattern>
  </defs>
  <rect width="20" height="20" fill="url(#diagonalLines)" />
</svg>
`;

export function updateLegend() {
  const legend = L.control({ position: "bottomright" });

  legend.onAdd = function (map) {
    const div = L.DomUtil.create("div", "legend");
    if (selectedValues.prognos === "effektbehov") {
      div.innerHTML = "<strong>Effektbehov (MW)</strong>";
    } else if (selectedValues.prognos === "ebd") {
      div.innerHTML = "<strong>Tillkommande<br>effektbehov (MW)</strong>";
    } else if (selectedValues.prognos === "ebp") {
      div.innerHTML = "<strong>Tillkommande<br>effektbehov (%)</strong>";
    } else if (selectedValues.prognos === "ead") {
      div.innerHTML = "<strong>Tillkommande<br>elanvändning (MWh)</strong>";
    } else if (selectedValues.prognos === "eap") {
      div.innerHTML = "<strong>Tillkommande<br>elanvändning (%)</strong>";
    }

    const { boundaries, colors } = getBoundariesAndColors();

    for (let i = 0; i < boundaries.length; i++) {
      // Dont display colors & boundaries devoted to 'Ny bebyggelse' (10e6 - 1)
      // and negative values
      if (boundaries[i].min !== 10e6 - 1 && boundaries[i].min !== -Infinity) {
        if (boundaries[i].max === 10e6 - 1) {
          div.innerHTML += `
<div style="display: flex; align-items: center; margin-bottom: 4px;">
<div style="width: 20px; height: 20px; background: ${colors[i]}; margin-right: 8px; border: 1px solid #000;"></div> 
<span>> ${boundaries[i].min}</span>
</div>
`;
        } else {
          if (boundaries[i].min !== -10e10) {
            div.innerHTML += `
<div style="display: flex; align-items: center; margin-bottom: 4px;">
<div style="width: 20px; height: 20px; background: ${colors[i]}; margin-right: 8px; border: 1px solid #000;"></div> 
<span>${boundaries[i].min} - ${boundaries[i].max}</span>
</div>
`;
          } else {
            div.innerHTML += `
<div style="display: flex; align-items: center; margin-bottom: 4px;">
<div style="width: 20px; height: 20px; background: ${colors[i]}; margin-right: 8px; border: 1px solid #000;"></div> 
<span>< ${boundaries[i].max}</span>
</div>
`;
          }
        }
        // Update the reference if negative values are present
      } else if (
        boundaries[i].min === -Infinity ||
        boundaries[i].min === -10e10
      ) {
        negativeValues = true;
      }
    }

    // If negative values are present and prognos is not effektbehov
    // then add a square for dot pattern (negative values)
    if (negativeValues === true && selectedValues.prognos !== "effektbehov") {
      div.innerHTML += svgDot + "< 0";
      negativeValues = null;
      belowZero = true;
    } else if (selectedValues.prognos === "effektbehov") {
      div.innerHTML += `
<div style="display: flex; align-items: center; margin-bottom: 4px;">
<div style="width: 20px; height: 20px; background: ${colors[colors.length - 1]}; margin-right: 8px; border: 1px solid #000;"></div> 
<span>< ${boundaries[boundaries.length - 1].max}</span>
</div>
`;
    }

    if (selectedValues.prognos !== "effektbehov") {
      if (belowZero === true) {
        if (selectedValues.raps === "transport") {
          div.innerHTML += "<br>" + svgCode + "Ny laddinfra";
        } else {
          div.innerHTML += "<br>" + svgCode + "Ny bebyggelse";
        }
      } else {
        if (selectedValues.raps === "transport") {
          div.innerHTML += svgCode + "Ny laddinfra";
        } else {
          div.innerHTML += svgCode + "Ny bebyggelse";
        }
      }
    }

    return div;
  };
  return legend;
}
