import { svgDiagonalLines } from "./patterns.js";
import { map, selectedValues } from "./map.js";
import { getBoundariesAndColors } from "./boundaries_colors.js";

export function createLegend() {
  const legend = L.control({ position: "bottomright" });

  console.log(legend);

  legend.onAdd = function (map) {
    const div = L.DomUtil.create("div", "legend");
    div.innerHTML = "Legend";

    // // For loop to iterate over number 0 to 4
    // for (let i = 0; i < 5; i++) {
    //   div.innerHTML += "<br>" + i;
    // }

    let boundaries = [
      { min: 10e6 - 1, max: Infinity },
      { min: 7, max: 10e6 - 1 },
      { min: 1, max: 7 },
      { min: 0.1, max: 1 },
      { min: -Infinity, max: 0.1 },
    ];

    let colors = ["black", "#060807", "#163019", "#296633", "#599E66"];

    for (let i = 0; i < boundaries.length; i++) {
      div.innerHTML += `
<div style="display: flex; align-items: center; margin-bottom: 4px;">
<div style="width: 20px; height: 20px; background: ${colors[i]}; margin-right: 8px; border: 1px solid #000;"></div> 
<span>${boundaries[i].min} - ${boundaries[i].max}</span>
</div>
`;
    }

    // // Loop over the min and max values in boundaries
    // for (let i = 0; i < boundaries.length; i++) {
    //   div.innerHTML += "<br>" + boundaries[i].min + " - " + boundaries[i].max;
    // }

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

    div.innerHTML += svgCode;

    return div;
  };

  return legend;
}

export function updateLegend() {
  const legend = L.control({ position: "bottomright" });

  console.log(legend);

  legend.onAdd = function (map) {
    const div = L.DomUtil.create("div", "legend");
    div.innerHTML = "Legend";

    const { boundaries, colors } = getBoundariesAndColors();

    for (let i = 0; i < boundaries.length; i++) {
      div.innerHTML += `
<div style="display: flex; align-items: center; margin-bottom: 4px;">
<div style="width: 20px; height: 20px; background: ${colors[i]}; margin-right: 8px; border: 1px solid #000;"></div> 
<span>${boundaries[i].min} - ${boundaries[i].max}</span>
</div>
`;
    }

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

    div.innerHTML += svgCode;

    return div;
  };
  return legend;
}
