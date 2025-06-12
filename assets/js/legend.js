import { svgDiagonalLines } from "./patterns.js";
import { map, selectedValues } from "./map.js";
import { getBoundariesAndColors } from "./boundaries_colors.js";

let negativeValues = null;
let belowZero;

const svgDot = `
<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" style="margin-right: 6px; display: inline-block; vertical-align: middle;">
  <defs>
    <pattern id="dotPattern" patternUnits="userSpaceOnUse" width="5" height="5">
      <circle cx="2.5" cy="2.5" r="1" fill="black" />
    </pattern>
  </defs>
  <rect width="20" height="20" fill="url(#dotPattern)" stroke="black" stroke-width="0.5" />
</svg>
`;

const svgCode = `
<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" style="margin-right: 6px; margin-top: 6px; display: inline-block; vertical-align: middle;">
  <defs>
    <pattern id="diagonalLines" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(135)">
      <line x1="0" y1="0" x2="0" y2="10" stroke="black" stroke-width="1" />
    </pattern>
  </defs>
  <rect width="20" height="20" fill="url(#diagonalLines)" stroke="black" stroke-width="0.5" />
</svg>
`;

// Helper to create a legend row
function legendRow(iconHtml, label, labelWidth = "auto") {
  return `
<div style="display: flex; align-items: center; margin-bottom: 4px;">
${iconHtml}
<span style="width: ${labelWidth}; text-align: center;">${label}</span>
</div>
`;
}

// Helper to get legend header
function legendHeader(prognos) {
  switch (prognos) {
    case "effektbehov":
      return "<strong>Effektbehov (MW)</strong>";
    case "ebd":
      return "<strong>Tillkommande<br>effektbehov (MW)</strong>";
    case "ebp":
      return "<strong>Tillkommande<br>effektbehov (%)</strong>";
    case "ead":
      return "<strong>Tillkommande<br>elanvändning (MWh)</strong>";
    case "eap":
      return "<strong>Tillkommande<br>elanvändning (%)</strong>";
    default:
      return "";
  }
}

export function updateLegend2() {
  const legend = L.control({ position: "bottomleft" });

  legend.onAdd = function (map) {
    const div = L.DomUtil.create("div", "legend");
    div.innerHTML = legendHeader(selectedValues.prognos);

    const { boundaries, colors } = getBoundariesAndColors();
    negativeValues = false;
    belowZero = false;

    for (let i = 0; i < boundaries.length; i++) {
      const b = boundaries[i];

      // Skip legend rows reserved for special cases
      if (b.min === 10e6 - 1 || b.min === -Infinity) {
        if (b.min === -Infinity || b.min === -10e10) negativeValues = true;
        continue;
      }

      let label = "";
      if (b.max === 10e6 - 1) {
        label = `&gt; ${b.min}`;
      } else if (b.min === -10e10) {
        label = `&lt; ${b.max}`;
      } else {
        label = `${b.min} - ${b.max}`;
      }
      div.innerHTML += legendRow(
        `<div style="width: 20px; height: 20px; background: ${colors[i]}; margin-right: 8px; border: 1px solid #000;"></div>`,
        label,
      );
    }
    // Add negative values pattern entry, if needed
    if (negativeValues && selectedValues.prognos !== "effektbehov") {
      div.innerHTML += legendRow(svgDot, "&lt; 0", "30px");
      belowZero = true;
    }
    // Special case for effektbehov: always show min entry
    else if (selectedValues.prognos === "effektbehov") {
      const lastIdx = colors.length - 1;
      div.innerHTML += legendRow(
        `<div style="width: 20px; height: 20px; background: ${colors[lastIdx]}; margin-right: 8px; border: 1px solid #000;"></div>`,
        `&lt; ${boundaries[boundaries.length - 1].max}`,
      );
    }

    // Add special patterned squares for "Ny laddinfra" or "Ny bebyggelse"
    if (selectedValues.prognos !== "effektbehov") {
      if (belowZero) {
        const label =
          selectedValues.raps === "transport"
            ? "Ny laddinfra"
            : "Ny bebyggelse";
        div.innerHTML += legendRow(
          svgCode,
          label,
          label === "Ny laddinfra" ? "80px" : "100px",
        );
      } else {
        const label =
          selectedValues.raps === "transport"
            ? "Ny laddinfra"
            : "Ny bebyggelse";
        div.innerHTML += legendRow(
          svgCode,
          label,
          label === "Ny laddinfra" ? "80px" : "100px",
        );
      }
    }

    // Replace dots with commas in the legend before returning the div
    div.innerHTML = div.innerHTML.replace(/\./g, ",");
    return div;
  };
  return legend;
}

export function updateLegend() {
  const legend = L.control({ position: "bottomleft" });

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
      // div.innerHTML += svgDot + "< 0";
      div.innerHTML += `
<div style="display: flex; align-items: center;">
${svgDot}
<span style="text-align: center; width: 30px; margin-top: 6px;">< 0</span>
</div>
`;
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
          div.innerHTML += `
<div style="display: flex; align-items: center;">
${svgCode}
<span style="text-align: center; width: 100px; margin-top: 6px;">Ny laddinfra</span>
</div>
`;
        } else {
          div.innerHTML += `
<div style="display: flex; align-items: center;">
${svgCode}
<span style="text-align: center; width: 100px; margin-top: 6px;">Ny bebyggelse</span>
</div>
`;
        }
      } else {
        if (selectedValues.raps === "transport") {
          div.innerHTML += `
<div style="display: flex; align-items: center;">
${svgCode}
<span style="text-align: center; width: 100px; margin-top: 6px;">Ny laddinfra</span>
</div>
`;
        } else {
          div.innerHTML += `
<div style="display: flex; align-items: center;">
${svgCode}
<span style="text-align: center; width: 100px; margin-top: 6px;">Ny bebyggelse</span>
</div>
`;
        }
      }
    }
    // Replace dots with commas in the legend before returning the div
    div.innerHTML = div.innerHTML.replace(/\./g, ",");
    return div;
  };
  return legend;
}
