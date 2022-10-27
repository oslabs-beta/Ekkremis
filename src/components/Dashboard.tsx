// importing dependencies 
import React, { useState, useEffect} from 'react';

// importing other components
import ChartsModal from './ChartsModal';
// import ErrorModal from './ErrorModal';
import '../styles/dashboard.css';
import Navigation from './Navigation'


// the parent componeent that holds all states and puts all other components together 
const Dashboard = () => {
  // state for current URL 
  const [currentUrl, setCurrentUrl] = useState('')
  // state for current active nav bar category 
  const [currentCategory, setcurrentCategory] = useState({});
  // state for current pods for display 
  const [currentPods, setCurrentPods] = useState([{podName: 'test1', podBasicInfo: 'something'}, {podName: 'test2', podBasicInfo: 'something'}, {podName: 'test3', podBasicInfo: 'something'}, {podName: 'test4', podBasicInfo: 'something'}]);


  return(
    <div className='dashboard'>
      <TopBar currentUrl={currentUrl} setCurrentUrl={setCurrentUrl}/>
      <div className='main'>
        <div className='query-bar'>
          {/* <Navigation somestate={} /> */}
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
        <h3>Ekkremis</h3>
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
  console.log(props.currentPods)

  const populateArray = () => {
    for (let i=0; i<props.currentPods.length; i++) {
      podsArray.push(<PodInfo key={i} podName={props.currentPods[i].podName} podBasicInfo={props.currentPods[i].podBasicInfo}/>)
    }
  }

  populateArray();

  useEffect(() => {
    populateArray();
  }, props.currenPods)

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
