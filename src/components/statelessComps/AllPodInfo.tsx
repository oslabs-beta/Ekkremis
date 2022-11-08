// importing dependencies 
import React, { useEffect } from 'react';
// importing other components
import PodInfo from './PodInfo';


// component for all pods info 
const AllPodInfo = (props: any) => {
    let podsArray : any = [];
    // console.log(props.currentPods)
  
    const populateArray = () => {
      console.log('inside populateArray()... status: ', props.status)
      for (const key in props.currentPods) {
        podsArray.push(<PodInfo key={key} podName={key} podNamespace={props.currentPods[key].namespace} podStatus={props.currentPods[key].status} podRestart={props.currentPods[key].restart} podAge={props.currentPods[key].age} currentUrl={props.currentUrl}/>)
      }
    }
  
    // does this call still make sense when useEffect runs on the initial load? 
    populateArray();
  
    useEffect(() => {
      // for cleanup function
      let hasBeenCalled = false;
      // poopulate each pod array for the table 
      if (!hasBeenCalled) {
        populateArray();
      }
      // called cleanup function to prevent looping
      return () => {
        hasBeenCalled = true;
      }
    }, [props.currentPods, props.currentUrl]); // update current pods when curent pods or url changes


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

  export default AllPodInfo;