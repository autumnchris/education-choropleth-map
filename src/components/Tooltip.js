import React from 'react';

const Tooltip = ({ tooltip }) => {
  return <div className="tooltip" style={{ top: tooltip.top, left: tooltip.left }}>{tooltip.countyName}, {tooltip.stateAbbr}<br />{tooltip.bachelorsPercentage}</div>;
}

export default Tooltip;