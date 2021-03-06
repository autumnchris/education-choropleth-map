function displayMap() {
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

  function getEducationData() {
    return axios.get('https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json');
  }

  function getCountyData() {
    return axios.get('https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json');
  }

  axios.all([getEducationData(), getCountyData()]).then(axios.spread((educationData, countyData) => {
    const path = d3.geoPath();
    const svg = d3.select('.map')
      .append('svg')
      .attr('viewBox', `0 0 ${w} ${h}`);

    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', 'translate(125, 35)');

    svg.append('g')
      .attr('class', 'counties')
      .selectAll('path')
      .data(topojson.feature(countyData.data, countyData.data.objects.counties).features)
      .enter()
      .append('path')
      .attr('class', 'county')
      .attr('d', path)
      .attr('fill', d => `hsl(209, 71%, ${Math.abs(Math.floor(findMatch(d).bachelorsOrHigher / 10) * 10 - 50) + 40}%)`)
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .on('mouseover', handleMouseover)
      .on('mouseout', handleMouseout);

    svg.append('path')
      .datum(topojson.mesh(countyData.data, countyData.data.objects.states, (a, b) => a !== b))
      .attr('class', 'states')
      .attr('fill', 'none')
      .attr('stroke', 'hsl(0, 0%, 20%)')
      .attr('d', path)
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    function findMatch(d) {
      const match = educationData.data.find(item => item.fips === d.id);
      return match;
    }

    function handleMouseover(d) {
      const tooltip = d3.select('.map')
        .append('div')
        .attr('class', 'tooltip')
        .style('visibility', 'hidden');

      tooltip.transition()
        .duration(200)
        .style('visibility', 'visible');

      tooltip.html(`${findMatch(d).area_name}, ${findMatch(d).state}<br/>${findMatch(d).bachelorsOrHigher}%`)
        .style('left', `${d3.event.pageX - 50}px`)
        .style('top', `${d3.event.pageY - 70}px`);
    }

    function handleMouseout() {
      d3.select('.tooltip').remove();
    }

    legend.selectAll('rect')
      .data(colorData)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * 80)
      .attr('y', 5)
      .attr('width', 80)
      .attr('height', 15)
      .attr('fill', d => `hsl(209, 71%, ${d + 40}%)`)
      .attr('stroke', 'hsl(0, 0%, 20%)');

    legend.selectAll('text')
      .data(colorData.reverse())
      .enter()
      .append('text')
      .attr('x', (d, i) => i * 80)
      .attr('y', 35)
      .attr('fill', 'hsl(0, 0%, 100%)')
      .text(d => `${d}-${d + 9}%`)
      .style('font-size', '0.7rem');
  })).catch(err => {
    document.querySelector('.error-message').style.display = 'block';
  });
}

displayMap();

document.querySelector('.current-year').innerHTML = new Date().getFullYear();
