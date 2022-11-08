// importing dependencies 
import React, { useState, useEffect } from 'react';
// importing other components
import '../styles/dashboard.css';
import QueryBar from './statelessComps/QueryBar';
import AllPodInfo from './statelessComps/AllPodInfo';
import TopBar from './statelessComps/TopBar';
import Display from './statelessComps/Display';
// importing functions from utils 
import { getPodInfo } from '../utils';


// import mock data 
// import mockData from '../mock_data.json' assert { type: 'JSON' };
// mockData = mockData.json();
let mockData: any = {"pending": {}, "running": {}, "succeeded": {}, "unknown": {}, "failed": {}, "initial": true}

// fetch('../mock_data.json')
//   .then(response => response.json())
//   .then(data => mockData = data.data)
//   .catch(error => console.log(error));

// the parent componeent that holds all states and puts all other components together 
const Dashboard = () => {
  // state for current URL 
  const [currentUrl, setCurrentUrl] = useState('http://localhost:9090');
  // state for current active nav bar category 
  const [status, setStatus] = useState('');
  // state for current pods for display - initialized by each button click - creates a subset of allPods based on status
  const [currentPods, setCurrentPods] = useState({
    "pendingPod1": { "podName": "pending pod 1", "node": "minikube", "status": "pending", "restarts": 0, "age": "53 minutes" },
    "pendingPod2": { "podName": "pending pod 2", "node": "minikube", "status": "pending", "restarts": 0, "age": "53 minutes" },
    "pendingPod3": { "podName": "pending pod 3", "node": "minikube", "status": "pending", "restarts": 0, "age": "53 minutes" }
  });
  // all pods looks like this: {"pending": {}, "running": {}, "succeeded": {}, "unknown": {}, "failed": {}}
  const [allPods, setAllPods] = useState(mockData);

  // state for making sure the useEffect doesn't loop
  const [preventChartLooping, setPreventChartLooping] = useState(false);


  // function to convert all pod data to summary format
  async function generateSummary() {
    // array of keys of allPods
    let keysArray = Object.keys(allPods);
    let resultObject = {};
    for (let i = 0; i < keysArray.length; i++) {
      Object.assign(resultObject, allPods[keysArray[i]])
    }
    // return an object that's in an accepted format by currentPods
    return resultObject;
  }

  // failed attempt to get the data to render on first load...
  // if (!status) setStatus('summary');

  useEffect(() => {
    // for the cleanup function
    let hasBeenRun = false;
    if (!hasBeenRun) {
      // reshape all pod data to fit status - resets current pods
      // console.log('inside useEffect, status: ', status)
      if (status !== 'summary') {  
        setCurrentPods(allPods[status]);
        // console.log('setting current pods to...', allPods[status]) 
      }
      else {
        (async () => {
          getPodInfo("actual", setAllPods, currentUrl);
          const summary: any = await generateSummary();
          // console.log(summary);
          setCurrentPods(summary);
        })();
      }
    }
    // console.log('inside useEffect, currentPods: ', currentPods);
    // cleanup function to aviod looping
    return () => {
      hasBeenRun = true;
    }
  }, [status, currentUrl]); // update current pods when status or url changes



  return(
    <div className='dashboard'>
      <TopBar currentUrl={currentUrl} setCurrentUrl={setCurrentUrl} setAllPods={setAllPods} setPreventChartLooping={setPreventChartLooping}/>
      <div className='main'>
        <div className='query-bar'>
          <QueryBar status={status} setStatus={setStatus}/>
        </div>
        <div className='right-side'>
          <Display allPods={allPods} preventChartLooping={preventChartLooping} setPreventChartLooping={setPreventChartLooping}/>
          <AllPodInfo currentPods={currentPods} currentUrl={currentUrl} status={status} allPods={allPods}/>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
