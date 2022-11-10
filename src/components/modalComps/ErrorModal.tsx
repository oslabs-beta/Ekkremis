import App from "../../App";
import React, { useState } from "react";
import "../../styles/errorModal.css";

import { getPendingReason } from '../../utils';

type ErrorProps = {
    show: boolean,
    toggleErrorModal: () => void;
    podName: string,
    podStatus: string,
    currentUrl: string
  }

  // creating a solution object mapped to different error keys 
  const suggestionObject : any = {
    'ImagePullBackOff': `Kubernetes couldn't pull the specified container image. Please check the pod specification and ensure the repository and image are specified correctly!`,
    'CrashLoopBackOff': `Common causes of CrashLoopBackoff include: insufficient resources, failed reference, setup error, config loading error, and misconfigurations`,
    'ContainerCreating': `Common causes of ContainerCreating include: errors in configmap, unmountable configmap, exceeding memory limits, and liveliness probes`,
  
  }
  
  // ErrorModal is a popup modal within each PodInfo component that displays error info
  const ErrorModal = (props: ErrorProps) => {
    // ran checks if getPendingReason has been ran to be able to toggle off the Loading component.
    const [ran, setRan] = useState(false);
    // logInfo will store the fetched error info if available. If logInfo remains falsey, then no errors will be displayed
    const [logInfo, setLogInfo] = useState();
    // noError is another option to store a default 'no errors found!' message. If an error is found, then it will change to 'yes error'. This could be a redundant stateful object.
    const [noError, setNoError] = useState('no errors found!');
    
    // showModalClassName toggles the classname of the component to toggle the css property display between 'block' and 'none'.
    const showModalClassName = props.show ? "modal display-block" : "modal display-none";
    
    suggestionObject['PodPending...'] = `${props.podName} is pending but Prometheus was unable to diagnose the root cause. Ekkremis recommends running the following commmand in your terminal to get a more detailed reason: \n kubectl describe pod ${props.podName}`
   

  // The ErrorModal will invoke getPendingReason to grab the pod status waiting reason
  getPendingReason('actual', setRan, setLogInfo, setNoError, props.podName, props.podStatus, props.currentUrl);

  return (
    <div className={showModalClassName}>
      <section className="modal-main">
        {ran ?
          <Logs logInfo={logInfo} noError={noError} /> : 
          <Loading />
        }
        <button type="button" onClick={props.toggleErrorModal}>
          Close
        </button>
      </section>
    </div>
  )
}

// This is a Logs component that will display error logs within the ErrorModal
const Logs = (props: any) => {
  // render different sh*t based on noError prop
  return (
    <div className="log-info">
      {props.logInfo ?
        <div className="log-info-inner">
          <h3>Error:</h3>
          <h5>{props.logInfo}</h5> 
          <h3>Suggestion from Ekkremis:</h3>
          <h5>{suggestionObject[props.logInfo]}</h5>
        </div> : 
        <h5>NO ERRORS LOL</h5>
      }  
    </div>
  )
}  

// This is a Loading component that will display a 'LOADING' message while the fetch for the pod status waiting reason is happening.
const Loading = () => {
  
  return (
    <div>
      <h1>LOADING</h1>
    </div>
  )
}

export default ErrorModal;
