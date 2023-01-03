import React from 'react';

const Legend = ({ colorData }) => {
  return <g className="legend" transform="translate(125, 35)">
    {colorData.map((color, i) => <rect className="legend-color" key={i} x={i * 80} y="5" width="80" height="15" fill={`hsl(209, 71%, ${color + 40}%)`} stroke="hsl(0, 0%, 20%)"></rect>)}
    {colorData.reverse().map((color, i) => <text className="legend-label" key={i} x={i * 80} y="35" fill="hsl(0, 0%, 100%)" style={{ fontSize: "0.7rem" }}>{color}-{color + 9}%</text>)}
  </g>;
}

export default Legend;