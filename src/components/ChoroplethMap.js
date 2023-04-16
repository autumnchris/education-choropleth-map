import React, { useState } from 'react';
import { geoPath } from 'd3';
import { mesh } from 'topojson-client';
import Legend from './Legend';
import County from './County';
import Tooltip from './Tooltip';

const ChoroplethMap = ({ data }) => {
  const margin = {
    top: 80,
    left: 100
  };
  const w = 1200;
  const h = w * 0.6;
  const colorData = [
    50,
    40,
    30,
    20,
    10,
    0
  ];
  const path = geoPath();

  const [tooltip, setTooltip] = useState(null);

  function findMatch(county) {
    return data.education.find(item => item.fips === county.id);
  }

  function handleMouseEnter(event, value) {
    setTooltip({
      countyName: findMatch(value).area_name,
      stateAbbr: findMatch(value).state,
      bachelorsPercentage: `${findMatch(value).bachelorsOrHigher}%`,
      left: `${event.pageX - 55}px`,
      top: `${event.pageY - 75}px`
    });
  }

  function handleMouseLeave() {
    setTooltip(null);
  }

  return (
    <div className="map-container">
      <svg className="choropleth-map" viewBox={`0 0 ${w} ${h}`}>
        <Legend colorData={colorData} />
        <g className="counties">{data.counties.map((county, i) => <County key={i} county={county} margin={margin} path={path} findMatch={findMatch} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />)}</g>
        <path className="states" d={path(mesh(data.map, data.states, (a, b) => a !== b))} fill="none" stroke="hsl(0, 0%, 20%)" transform={`translate(${margin.left}, ${margin.top})`}></path>
      </svg>
      {tooltip && <Tooltip tooltip={tooltip} />}
    </div>
  );
}

export default ChoroplethMap;