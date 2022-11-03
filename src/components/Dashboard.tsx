// importing dependencies 
import React, { useState, useEffect} from 'react';

// importing other components
import ChartsModal from './ChartsModal';
// import ErrorModal from './ErrorModal';
import '../styles/dashboard.css';
import QueryBar from './QueryBar';
import ErrorModal from './ErrorModal';

// import mock data 
// import mockData from '../mock_data.json' assert { type: 'JSON' };
// mockData = mockData.json();
let mockData: any = {"pending" : {
  "pendingPod1": {"podName": "pending pod 1", "node": "minikube", "status": "pending", "restarts": 0, "age": "53 minutes"}, 
  "pendingPod2": {"podName": "pending pod 2", "node": "minikube", "status": "pending", "restarts": 0, "age": "53 minutes"}, 
  "pendingPod3": {"podName": "pending pod 3", "node": "minikube", "status": "pending", "restarts": 0, "age": "53 minutes"},
  "pendingPod4": {"podName": "pending pod 4", "node": "minikube", "status": "pending", "restarts": 0, "age": "53 minutes"}, 
  "pendingPod5": {"podName": "pending pod 5", "node": "minikube", "status": "pending", "restarts": 0, "age": "53 minutes"}, 
  "pendingPod6": {"podName": "pending pod 6", "node": "minikube", "status": "pending", "restarts": 0, "age": "53 minutes"},
  "pendingPod7": {"podName": "pending pod 7", "node": "minikube", "status": "pending", "restarts": 0, "age": "53 minutes"}, 
  "pendingPod8": {"podName": "pending pod 8", "node": "minikube", "status": "pending", "restarts": 0, "age": "53 minutes"}, 
  "pendingPod9": {"podName": "pending pod 9", "node": "minikube", "status": "pending", "restarts": 0, "age": "53 minutes"}
},
"unknown" : {
  "unknownPod1": {"podName": "unknown pod 1", "node": "minikube", "status": "unknown", "restarts": 0, "age": "27 minutes"}, 
  "unknownPod2": {"podName": "unknown pod 2", "node": "minikube", "status": "unknown", "restarts": 0, "age": "27 minutes"}, 
  "unknownPod3": {"podName": "unknown pod 3", "node": "minikube", "status": "unknown", "restarts": 0, "age": "27 minutes"}
},
"running" : {
  "runningPod1": {"podName": "running pod 1", "node": "minikube", "status": "running", "restarts": 0, "age": "48 minutes"}, 
  "runningPod2": {"podName": "running pod 2", "node": "minikube", "status": "running", "restarts": 0, "age": "52 minutes"}, 
  "runningPod3": {"podName": "running pod 3", "node": "minikube", "status": "running", "restarts": 0, "age": "54 minutes"}
},
"failed" : {
  "failedPod1": {"podName": "failed pod 1", "node": "minikube", "status": "failed", "restarts": 0, "age": "21 minutes"}, 
  "failedPod2": {"podName": "failed pod 2", "node": "minikube", "status": "failed", "restarts": 0, "age": "25 minutes"}, 
  "failedPod3": {"podName": "failed pod 3", "node": "minikube", "status": "failed", "restarts": 0, "age": "27 minutes"}
},
"successful" : {
  "successfulPod1": {"podName": "successful pod 1", "node": "minikube", "status": "successful", "restarts": 0, "age": "27 minutes"}, 
  "successfulPod2": {"podName": "successful pod 2", "node": "minikube", "status": "successful", "restarts": 0, "age": "36 minutes"}, 
  "successfulPod3": {"podName": "successful pod 3", "node": "minikube", "status": "successful", "restarts": 0, "age": "29 minutes"}
}};

// fetch('../mock_data.json')
//   .then(response => response.json())
//   .then(data => mockData = data.data)
//   .catch(error => console.log(error));

// the parent componeent that holds all states and puts all other components together 
const Dashboard = () => {
  // state for current URL 
  const [currentUrl, setCurrentUrl] = useState('')
  // state for current active nav bar category 
  const [status, setStatus] = useState("pending");
  // state for current pods for display 
  const [currentPods, setCurrentPods] = useState({
    "pendingPod1": {"podName": "pending pod 1", "node": "minikube", "status": "pending", "restarts": 0, "age": "53 minutes"}, 
    "pendingPod2": {"podName": "pending pod 2", "node": "minikube", "status": "pending", "restarts": 0, "age": "53 minutes"}, 
    "pendingPod3": {"podName": "pending pod 3", "node": "minikube", "status": "pending", "restarts": 0, "age": "53 minutes"}
});
  const [allPods, setAllPods] = useState(mockData);

  useEffect(() => {

      setCurrentPods(allPods[status])
      console.log(currentPods)

  }, [status])


  return(
    <div className='dashboard'>
      <TopBar currentUrl={currentUrl} setCurrentUrl={setCurrentUrl} setAllPods={setAllPods}/>
      <div className='main'>
        <div className='query-bar'>
          <QueryBar status={status} setStatus={setStatus}/>
        </div>
        <div className='right-side'>
          <Display />
          <AllPodInfo currentPods={currentPods}/>
        </div>
      </div>
    </div>
  )
}


// the top nav bar containing URL event listener and (potentially login?)
const TopBar = (props: any) => {
  const handleClick = (setAllPods: any) => {
    console.log('inside handleClick')
    // document.getElementById() returns the type HTMLElement which does not contain a value property. The subtype HTMLInputElement does however contain the value property.
    const inputElement = (document.getElementById('endpoint-url') as HTMLInputElement);
    const inputValue = inputElement.value
    // const url = inputValue.toString() + '/metrics'
    props.setCurrentUrl(inputValue);
    inputElement.value = '';
    // console.log(props.setAllPods)
    sendQuery(inputValue, setAllPods);
  }

  let placeholder = 'your url here';
  if (props.currentUrl) placeholder = props.currentUrl;

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
      podsArray.push(<PodInfo key={key} podName={key} podNode={props.currentPods[key].node} podStatus={props.currentPods[key].status} podRestarts={props.currentPods[key].restarts} podAge={props.currentPods[key].age} />)
    }
  }

  populateArray();

  useEffect(() => {
    populateArray();
  }, [props.currentPods])

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
  podNode: string,
  podStatus: string,
  podRestarts: number,
  podAge: number
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
      <h5>{props.podNode}</h5>
      <h5>{props.podStatus}</h5>
      <h5>{props.podRestarts}</h5>
      <h5>{props.podAge}</h5>
      <button onClick={toggleChartsModal}>charts</button>
      <button onClick={toggleErrorModal}>logs</button>
      <ChartsModal show={showChartsModal} toggleChartsModal={toggleChartsModal} />
      <ErrorModal show={showErrorModal} toggleErrorModal={toggleErrorModal} />
    </div>
  )
}


function sendQuery(url: string, setPods: any) {
  const promql = '/api/v1/query?query=';
  let query = '(kube_pod_status_phase)==1';
  const finalUrl = url + promql + query;
  fetch('http://localhost:9090/api/v1/query?query=(kube_pod_status_phase)==1')
    .then(data => data.json())
    .then(data => {
      // format the data 
      let resultArray = data.data.result;
      let resultObject :any = {"pending": {}, "running": {}, "successful": {}, "unkown": {}, "failed": {}};
      for (let i=0; i<resultArray.length; i++) {
        let tempObject :any = {};
        let podName = resultArray[i].metric.pod;
        tempObject["node"] = resultArray[i].metric.namespace;
        tempObject["status"] = resultArray[i].metric.phase;
        tempObject["restart"] = 1;
        tempObject["age"] = 5;
        resultObject[resultArray[i].metric.phase.toLowerCase()][podName] = tempObject;
      }
      setPods(resultObject)
    })
}


export default Dashboard
