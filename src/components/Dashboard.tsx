// importing dependencies 
import React, { useState, useEffect} from 'react';

// importing other components
import ChartsModal from './ChartsModal';
// import ErrorModal from './ErrorModal';
import '../styles/dashboard.css';
import QueryBar from './QueryBar';
import ErrorModal from './ErrorModal';

import { test, getPodInfo } from '../utils';

// import mock data 
// import mockData from '../mock_data.json' assert { type: 'JSON' };
// mockData = mockData.json();
let mockData: any = {"pending": {}, "running": {}, "succeeded": {}, "unknown": {}, "failed": {}}

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
    "pendingPod1": {"podName": "pending pod 1", "node": "minikube", "status": "pending", "restarts": 0, "age": "53 minutes"}, 
    "pendingPod2": {"podName": "pending pod 2", "node": "minikube", "status": "pending", "restarts": 0, "age": "53 minutes"}, 
    "pendingPod3": {"podName": "pending pod 3", "node": "minikube", "status": "pending", "restarts": 0, "age": "53 minutes"}
});
  // all pods looks like this: {"pending": {}, "running": {}, "succeeded": {}, "unknown": {}, "failed": {}}
  const [allPods, setAllPods] = useState(mockData);

  // a state for all summary data 

  // a state for actively 

    async function generateSummary() {
    // array of keys of allPods
    let keysArray = Object.keys(allPods);
    let resultObject = {};
    for (let i=0; i<keysArray.length; i++) {
      Object.assign(resultObject, allPods[keysArray[i]])
    }
    // return an object that's in an accepted format by currentPods
    return resultObject;
  }

  if (!status) setStatus('summary');
  
  useEffect(() => {
    // reshape all pod data to fit status - resets current pods
    if (status!=='summary') setCurrentPods(allPods[status]);
    else {
      (async() => {
        getPodInfo("actual", setAllPods, currentUrl);
        const summary: any = await generateSummary();
        console.log(summary);
        setCurrentPods(summary);
      })();
    }
      console.log(currentPods)
  }, [status]);


  return(
    <div className='dashboard'>
      <TopBar currentUrl={currentUrl} setCurrentUrl={setCurrentUrl} setAllPods={setAllPods}/>
      <div className='main'>
        <div className='query-bar'>
          <QueryBar status={status} setStatus={setStatus}/>
        </div>
        <div className='right-side'>
          <Display />
          <AllPodInfo currentPods={currentPods} currentUrl={currentUrl} status={status} allPods={allPods}/>
        </div>
      </div>
    </div>
  )
}


// the top nav bar containing URL event listener and (potentially login?)
const TopBar = (props: any) => {
  function handleClick(setAllPods: any) {
    console.log('inside handleClick')
    // document.getElementById() returns the type HTMLElement which does not contain a value property. The subtype HTMLInputElement does however contain the value property.
    const inputElement = (document.getElementById('endpoint-url') as HTMLInputElement);
    let inputValue = inputElement.value
    // const url = inputValue.toString() + '/metrics'
    if (inputValue) props.setCurrentUrl(inputValue);
    else inputValue = 'http://localhost:9090';
   
    inputElement.value = '';
    // this is the get real data from localhost 9090
    getPodInfo("actual", setAllPods, inputValue);

    // this uses mock data
    // getPodInfo("mock", setAllPods);

    // declare a resultObject -> {"pending": {}, "running": {}, "succeeded": {}, "unknown": {}, "failed": {}};
    // call our first fetch function to update result object, pass in resultObject as an argument 
    // second fetch 
    // third fetch
    // setAllPods(resultObject)

  }

  let placeholder = 'your url here';
  // if (props.currentUrl) placeholder = props.currentUrl;

  return(
    <div className='top-bar'>
      <img className='header-logo' src={require('../img/Ekkremis-logo-light.png')} alt="Ekkremis" height='100px' width='180px'/>
      <div className='url-input'>
        <input id='endpoint-url' type="text" placeholder={placeholder}/>
        <h5>/metrics</h5>
        <button className='url-btn' onClick={()=>{handleClick(props.setAllPods)}}>update url</button>
      </div>
      <div className='login-buttons'>
        <button>Login</button>
        <button>Sign Up</button>
      </div>
    </div>
  )
}

// component for displaying modals based on active pod 
const Display = (props: any) => {

  return(
    <div className='display'>
      <h5>fake graphs lol</h5>
      <img src="https://miro.medium.com/max/1400/1*QwGqOMObJd7oFHCfe1AvxA.png" alt="" />
    </div>
  )
}

// component for all pods info 
const AllPodInfo = (props: any) => {
  let podsArray : any = [];
  // console.log(props.currentPods)

  const populateArray = () => {
    for (const key in props.currentPods) {
      podsArray.push(<PodInfo key={key} podName={key} podNamespace={props.currentPods[key].namespace} podStatus={props.currentPods[key].status} podRestart={props.currentPods[key].restart} podAge={props.currentPods[key].age} currentUrl={props.currentUrl}/>)
    }
  }

  populateArray();

  useEffect(() => {
    populateArray();
  }, [props.currentPods, props.status, props.allPods])

  return(
      <div>
          <div className='pods-header'>
            <h5>pod name</h5>
            <h5>node</h5>
            <h5>status</h5>
            <h5>restarts</h5>
            <h5>age</h5>
          </div>
          <div className='all-pod-info'>
            {podsArray}
          </div>
      </div>
  )
}

// type for props for podInfo 
type podType = {
  podName: string,
  podNamespace: string,
  podStatus: string,
  podRestart: number,
  podAge: number,
  podReason?: string,
  currentUrl: string
}
// component for individual pod info 
const PodInfo = (props: podType) => {

  const [showChartsModal, setShowChartsModal] = useState(false);

  const toggleChartsModal = () => {
    setShowChartsModal(!showChartsModal);
  }
  

  const [showErrorModal, setShowErrorModal] = useState(false);

  const toggleErrorModal = () => {
    setShowErrorModal(!showErrorModal);
  }

  return(
    <div className='pod-info'>
      <h5>{props.podName}</h5>
      <h5>{props.podNamespace}</h5>
      <h5>{props.podStatus}</h5>
      <h5>{props.podRestart}</h5>
      <h5>{props.podAge}</h5>
      <button onClick={toggleChartsModal}>charts</button>
      <button onClick={toggleErrorModal}>logs</button>
      <ChartsModal show={showChartsModal} toggleChartsModal={toggleChartsModal} />
      <ErrorModal show={showErrorModal} toggleErrorModal={toggleErrorModal} podName={props.podName} currentUrl={props.currentUrl}/>
    </div>
  )
}


// function getPodInfo(url: string, setPods: any) {
//   const promql = '/api/v1/query?query=';
//   let query = '(kube_pod_status_phase)==1';
//   const finalUrl = url + promql + query;
//   fetch(finalUrl)
//     .then(data => data.json())
//     .then(data => {
//       // format the data 
//       let resultArray = data.data.result;
//       let resultObject :any = {"pending": {}, "running": {}, "successful": {}, "unkown": {}, "failed": {}};
//       for (let i=0; i<resultArray.length; i++) {
//         let tempObject :any = {};
//         let podName = resultArray[i].metric.pod;
//         tempObject["node"] = resultArray[i].metric.namespace;
//         tempObject["status"] = resultArray[i].metric.phase;
//         tempObject["restart"] = 1;
//         tempObject["age"] = 5;
//         resultObject[resultArray[i].metric.phase.toLowerCase()][podName] = tempObject;
//       }
//       setPods(resultObject)
//     })
// }


export default Dashboard
