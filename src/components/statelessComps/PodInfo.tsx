// importing dependencies 
import React, { useState } from 'react';
// importing other components 
import ChartsModal from '../modalComps/ChartsModal';
import ErrorModal from '../modalComps/ErrorModal';

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
