function displayMap() {

  function getEducationData() {
    return axios.get('https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json');
  }

  function getCountyData() {
    return axios.get('https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json');
  }

  axios.all([getEducationData(), getCountyData()]).then(axios.spread((educationData, countyData) => {
    const colorData = [
      60,
      50,
      40,
      30,
      20,
      10
    ];
    const margin = {
      top: 80,
      left: 100
    };
    const w = window.innerWidth;
    const h = w / 1.6;
    const path = d3.geoPath();
    const svg = d3.select('.map')
      .append('svg')
      .attr('viewBox', `0 0 ${w} ${h}`);

    const legend = svg.append('g')
      .attr('id', 'legend')
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
      .attr('fill', d => `hsl(209, 71%, ${Math.abs(Math.ceil(findMatch(d).bachelorsOrHigher / 10) * 10 - 70) + 30}%)`)
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .attr('data-fips', d => d.id)
      .attr('data-education', d => findMatch(d).bachelorsOrHigher);

    svg.append('path')
      .datum(topojson.mesh(countyData.data, countyData.data.objects.states, (a, b) => a !== b))
      .attr('class', 'states')
      .attr('fill', 'none')
      .attr('stroke', '#333')
      .attr('d', path)
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    function findMatch(d) {
      const match = educationData.data.find(item => item.fips === d.id)
      return match;
    }

    legend.selectAll('rect')
      .data(colorData)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * 60)
      .attr('y', 5)
      .attr('width', 60)
      .attr('height', 15)
      .attr('fill', d => `hsl(209, 71%, ${d + 30}%)`)
      .attr('stroke', '#fff');

    legend.selectAll('text')
      .data(colorData.reverse())
      .enter()
      .append('text')
      .attr('x', (d, i) => i * 60)
      .attr('y', 35)
      .attr('fill', '#fff')
      .text((d) => `<${d}%`)
      .style('font-size', '0.7rem');
  })).catch(() => {
    document.querySelector('.error-message').style.display = 'block';
  });
}

displayMap();
