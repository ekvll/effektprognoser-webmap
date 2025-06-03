import { svgDiagonalLines } from "./patterns.js";
import { map, selectedValues } from "./map.js";
import { getBoundariesAndColors } from "./boundaries_colors.js";

export function updateLegend() {
  const legend = L.control({ position: "bottomright" });

  console.log(legend);

  legend.onAdd = function (map) {
    const div = L.DomUtil.create("div", "legend");
    div.innerHTML = "Legend";

    const { boundaries, colors } = getBoundariesAndColors();

    for (let i = 0; i < boundaries.length; i++) {
      if (boundaries[i].min !== 10e6 - 1) {
        div.innerHTML += `
<div style="display: flex; align-items: center; margin-bottom: 4px;">
<div style="width: 20px; height: 20px; background: ${colors[i]}; margin-right: 8px; border: 1px solid #000;"></div> 
<span>${boundaries[i].min} - ${boundaries[i].max}</span>
</div>
`;
      }
    }
    if (selectedValues.prognos !== "effektbehov") {
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
      if (selectedValues.raps === "transport") {
        div.innerHTML += svgCode + "Ny laddinfra";
      } else {
        div.innerHTML += svgCode + "Ny bebyggelse";
      }
    }

    return div;
  };
  return legend;
}
