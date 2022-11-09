// Rilo
import App from "../App";
import React, { useState } from "react";
import "../styles/errorModal.css";
import "../styles/chartsModal.css";

import { getPendingReason } from '../utils';

type ErrorProps = {
    show: boolean,
    toggleErrorModal: () => void;
    podName: string,
    currentUrl: string
  }
  
const suggestionObject : any = {
  'ImagePullBackOff': `Kubernetes couldn't pull the specified container image. Please check the pod specification and ensure the repository and image are specified correctly!`,
  'CrashLoopBackOff': `Common causes of CrashLoopBackoff include: insufficient resources, failed reference, setup error, config loading error, and misconfigurations`
}

const ErrorModal = (props: ErrorProps) => {
  const [ran, setRan] = useState(false);
  const [logInfo, setLogInfo] = useState();
  const [noError, setNoError] = useState('no errors found!');

  const showModalClassName = props.show ? "modal display-block" : "modal display-none";

  getPendingReason('actual', setRan, setLogInfo, setNoError, props.podName, props.currentUrl);

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

const Logs = (props: any) => {
  // render different sh*t based on noError prop
  console.log('inside Log!!!!!!')
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

const Loading = () => {
  
  return (
    <div>
      <h1>LOADING</h1>
    </div>
  )
}

  
export default ErrorModal;
