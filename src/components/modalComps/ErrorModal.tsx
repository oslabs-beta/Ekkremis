import App from "../../App";
import React, { useState } from "react";
import "../../styles/errorModal.css";

import { getPendingReason } from '../../utils';

type ErrorProps = {
    show: boolean,
    toggleErrorModal: () => void;
    podName: string,
    currentUrl: string
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

  // The ErrorModal will invoke getPendingReason to grab the pod status waiting reason
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

// This is a Logs component that will display error logs within the ErrorModal
const Logs = (props: any) => {
  // render different sh*t based on noError prop
  
  return (
    <div className="log-info">
      {props.logInfo ?
        <h5>{props.logInfo}</h5> : 
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
