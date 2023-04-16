import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { feature } from 'topojson-client';
import Header from './components/Header';
import Footer from './components/Footer';
import ChoroplethMap from './components/ChoroplethMap';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

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
      <Header />
      <main>
        {loadingStatus && !data ? <LoadingSpinner /> : data ? <ChoroplethMap data={data} /> : <ErrorMessage />}
      </main>
      <Footer />
    </React.Fragment>
  );
}

export default App;