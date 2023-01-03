import React from 'react';

const County = ({ county, margin, path, findMatch, handleMouseEnter, handleMouseLeave }) => {
  return <path className="county" d={path(county)} fill={`hsl(209, 71%, ${Math.abs(Math.floor(findMatch(county).bachelorsOrHigher / 10) * 10 - 50) + 40}%)`} transform={`translate(${margin.left}, ${margin.top})`} onMouseEnter={(event) => handleMouseEnter(event, county)} onMouseLeave={() => handleMouseLeave()}></path>;
}

export default County;