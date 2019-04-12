function displayMap() {

  function getEducationData() {
    return axios.get('https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json');
  }

  function getCountyData() {
    return axios.get('https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json');
  }

  axios.all([getEducationData(), getCountyData()]).then(axios.spread((educationData, countyData) => {
    console.log({
      education: educationData.data
    });
    console.log({
      county: countyData.data
    });
  })).catch(() => {
    document.querySelector('.error-message').style.display = 'block';
  });
}

displayMap();
