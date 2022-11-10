// importing dependencies 
import React, { useState } from 'react';
// importing other components 
import ChartsModal from '../modalComps/ChartsModal';
import ErrorModal from '../modalComps/ErrorModal';
import { checkRunningPodError } from '../../utils';
import { useEffect } from 'react';

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

    const [className, setClassName] = useState('pod-info');
    const [buttonClassName, setButtonClassName] = useState('log-button');

    useEffect(() => {
      if (props.podStatus === 'Pending') {
        setClassName('pod-info pod-info-pending');
        setButtonClassName('log-button-pending')
      }
      if (props.podStatus === 'Running') {
        console.log('inside pod info async')
        checkRunningPodError(props.podName, props.currentUrl, setClassName, setButtonClassName)
      }
    },[props.podStatus])

  
    return(
      <div className={className}>
        <div><p>{props.podName}</p></div>
        <div><p>{props.podNamespace}</p></div>
        <div><p>{props.podStatus}</p></div>
        <div><p>{props.podRestart}</p></div>
        <div><p>{props.podAge}</p></div>
          {/* <button onClick={toggleChartsModal}>charts</button> */}
        <div><button className={buttonClassName} onClick={toggleErrorModal}>logs</button></div>
        {/* <ChartsModal show={showChartsModal} toggleChartsModal={toggleChartsModal} /> */}
        <ErrorModal show={showErrorModal} toggleErrorModal={toggleErrorModal} podName={props.podName} currentUrl={props.currentUrl}/>
      </div>
    )
  }

  export default PodInfo;

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
