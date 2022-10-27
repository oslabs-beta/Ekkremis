// importing dependencies 
import React, { useState, useEffect} from 'react';

// importing other components
import ChartsModal from './ChartsModal';
// import ErrorModal from './ErrorModal';
import '../styles/dashboard.css';
import QueryBar from './QueryBar'

// import mock data 
// import mockData from '../mock_data.json' assert { type: 'JSON' };
// mockData = mockData.json();
let mockData: any = {"pending" : [
  {"podName": "pending pod 1", "node": "minikube", "status": "pending", "restarts": 0, "age": "53 minutes"}, 
  {"podName": "pending pod 2", "node": "minikube", "status": "pending", "restarts": 0, "age": "53 minutes"}, 
  {"podName": "pending pod 3", "node": "minikube", "status": "pending", "restarts": 0, "age": "53 minutes"}
],
"unknown" : [
  {"podName": "unknown pod 1", "node": "minikube", "status": "unknown", "restarts": 0, "age": "27 minutes"}, 
  {"podName": "unknown pod 2", "node": "minikube", "status": "unknown", "restarts": 0, "age": "27 minutes"}, 
  {"podName": "unknown pod 3", "node": "minikube", "status": "unknown", "restarts": 0, "age": "27 minutes"}
],
"running" : [
  {"podName": "running pod 1", "node": "minikube", "status": "running", "restarts": 0, "age": "48 minutes"}, 
  {"podName": "running pod 2", "node": "minikube", "status": "running", "restarts": 0, "age": "52 minutes"}, 
  {"podName": "running pod 3", "node": "minikube", "status": "running", "restarts": 0, "age": "54 minutes"}
],
"failed" : [
  {"podName": "failed pod 1", "node": "minikube", "status": "failed", "restarts": 0, "age": "21 minutes"}, 
  {"podName": "failed pod 2", "node": "minikube", "status": "failed", "restarts": 0, "age": "25 minutes"}, 
  {"podName": "failed pod 3", "node": "minikube", "status": "failed", "restarts": 0, "age": "27 minutes"}
],
"successful" : [
  {"podName": "successful pod 1", "node": "minikube", "status": "successful", "restarts": 0, "age": "27 minutes"}, 
  {"podName": "successful pod 2", "node": "minikube", "status": "successful", "restarts": 0, "age": "36 minutes"}, 
  {"podName": "successful pod 3", "node": "minikube", "status": "successful", "restarts": 0, "age": "29 minutes"}
]};

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
  const [currentPods, setCurrentPods] = useState([
    {"podName": "pending pod 1", "node": "minikube", "status": "pending", "restarts": 0, "age": "53 minutes"}, 
    {"podName": "pending pod 2", "node": "minikube", "status": "pending", "restarts": 0, "age": "53 minutes"}, 
    {"podName": "pending pod 3", "node": "minikube", "status": "pending", "restarts": 0, "age": "53 minutes"}
  ]);

  useEffect(() => {

      setCurrentPods(mockData[status])
      console.log(currentPods)

  }, [status])


  return(
    <div className='dashboard'>
      <TopBar currentUrl={currentUrl} setCurrentUrl={setCurrentUrl}/>
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
  const handleClick = () => {
    console.log('inside handleClick')
    // document.getElementById() returns the type HTMLElement which does not contain a value property. The subtype HTMLInputElement does however contain the value property.
    const inputElement = (document.getElementById('endpoint-url') as HTMLInputElement);
    const inputValue = inputElement.value
    const url = inputValue.toString() + '/metrics'
    props.setCurrentUrl(url);
    inputElement.value = '';
  }

  let placeholder = 'your url here';
  if (props.currentUrl) placeholder = props.currentUrl;

  return(
    <div className='top-bar'>
      <div className='logo'>
      
      </div>
      <div className='url-input'>
        <input id='endpoint-url' type="text" placeholder={placeholder}/>
        <h5>/metrics</h5>
        <button onClick={()=>{handleClick()}}>update url</button>
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
    for (let i=0; i<props.currentPods.length; i++) {
      podsArray.push(<PodInfo key={i} podName={props.currentPods[i].podName} podBasicInfo={props.currentPods[i].podBasicInfo}/>)
    }
  }

  populateArray();

  useEffect(() => {
    populateArray();
  }, props.currentPods)

  return(
    <div className='all-pod-info'>
      {podsArray}
    </div>
  )
}

// type for props for podInfo 
type podType = {
  podName: string,
  podBasicInfo: string
}
// component for individual pod info 
const PodInfo = (props: podType) => {
  return(
    <div className='pod-info'>
      <h4>{props.podName}</h4>
      <h4>{props.podBasicInfo}</h4>
    </div>
  )
}



export default Dashboard
