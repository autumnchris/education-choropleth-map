import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { feature } from "topojson-client";
import ChoroplethMap from './Choropleth-Map';
import LoadingSpinner from './Loading-Spinner';
import ErrorMessage from './Error-Message';

const App = () => {
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([
      getEducationData(),
      getCountyData()
    ]).then(([
      educationDataset,
      countyDataset
    ]) => {
      setLoadingStatus(false);
      setData({
        map: countyDataset.data,
        counties: feature(countyDataset.data, countyDataset.data.objects.counties).features,
        education: educationDataset.data,
        states: countyDataset.data.objects.states
      });
    }).catch(() => {
      setLoadingStatus(false);
      setData(null);
    });
  }, []);

  function getEducationData() {
    return axios.get('https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json');
  }

  function getCountyData() {
    return axios.get('https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json');
  }

  return (
    <React.Fragment>
      <header>
        <h1>US Educational Attainment, 2010-2014</h1>
        <h2>Percentage of Adults Age 25 and Older with a Bachelor's Degree or Higher</h2>
      </header>
      <main>
        {loadingStatus && !data ? <LoadingSpinner /> : data ? <ChoroplethMap data={data} /> : <ErrorMessage />}
      </main>
      <footer>Created by <a href="https://autumnchris.github.io/portfolio" target="_blank">Autumn Bullard</a> &copy; {new Date().getFullYear()}</footer>
    </React.Fragment>
  );
}

export default App;