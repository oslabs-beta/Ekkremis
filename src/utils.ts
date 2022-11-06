// import { app } from 'electron';
import path from 'path';


export function test() {
  console.log(__dirname)
  // const string = ('file:///Users/z/codesmith/Ekkremis/src/mock_data.json')
  const string = 'file://' + 'static';
  console.log(string);
  fetch(string)
    .then(data => data.json())
    .then(data => {
      console.log(data)
    })
}

type UseCase = "mock" | "actual";

export function getPodInfo(useCase: UseCase, setAllPods: any, url?: string) {
  const promql = '/api/v1/query?query=';
  let statusPhaseQuery = '(kube_pod_status_phase)==1';
  let restartQuery = '(kube_pod_container_status_restarts_total)';
  let ageQuery = '(kube_pod_start_time)';

  let finalStatusUrl: string = '';
  let finalRestartUrl: string = '';
  let finalAgeUrl: string = '';
  if (useCase==='actual') {
    finalStatusUrl = url + promql + statusPhaseQuery;
    finalRestartUrl = url + promql + restartQuery;
    finalAgeUrl = url + promql + ageQuery;
  } 
  console.log('sendQuery invoked', finalStatusUrl)

  let resultObject :any = {"pending": {}, "running": {}, "succeeded": {}, "unknown": {}, "failed": {}};
  let restartObject :any = {};
  fetch(finalRestartUrl)
      .then(data => data.json())
      .then(data => {
        let resultArray;
        if (useCase==='mock') resultArray = data[restartQuery].data.result;
        else if (useCase==='actual') resultArray = data.data.result;
        for (let i=0; i<resultArray.length; i++) {
          restartObject[resultArray[i].metric.pod] = {};
          restartObject[resultArray[i].metric.pod]['restart'] = Number(resultArray[i].value[1]);
        }
        console.log('after first fetch:', restartObject)
      })
      .then(()=> {
        fetch(finalAgeUrl)
          .then(data => data.json())
          .then(data => {
            let resultArray;
            if (useCase==='mock') resultArray = data[restartQuery].data.result;
            else if (useCase==='actual') resultArray = data.data.result;
            const currentTime = Math.floor(Date.now() / 1000); 
            for (let i=0; i<resultArray.length; i++) {
              restartObject[resultArray[i].metric.pod]['age'] = Math.round((currentTime - Number(resultArray[i].value[1]))/3600);
            }
          })
          console.log('after second fetch:',restartObject)
      })
      .then(()=> {
        fetch(finalStatusUrl)
          .then(data => data.json())
          .then(data => {
            // format the data 
            let resultArray;
            if (useCase==='mock') resultArray = data[statusPhaseQuery].data.result;
            else if (useCase==='actual') resultArray = data.data.result;
            for (let i=0; i<resultArray.length; i++) {
              let tempObject :any = {};
              let podName = resultArray[i].metric.pod;
              tempObject["namespace"] = resultArray[i].metric.namespace;
              tempObject["status"] = resultArray[i].metric.phase;
              // check if the current pod name wasn't fetched by the first 2 fetch requests, skip if it doesnt exist
              if (restartObject.hasOwnProperty(podName)) {
                tempObject["restart"] = restartObject[podName].restart ? restartObject[podName].restart : 0
                tempObject["age"] = restartObject[podName].age ? restartObject[podName].age : 0
              }
              resultObject[resultArray[i].metric.phase.toLowerCase()][podName] = tempObject;    
            }
            // call the set state function to update the allPods state
            setAllPods(resultObject)
          })
      })
}


export function getPendingReason(useCase: UseCase, setRan: any, setLogInfo: any, setNoError: any, podName: string, url?: string) {
  const promql = '/api/v1/query?query=';
  const pendingReasonQuery = `(kube_pod_container_status_waiting_reason{pod="${podName}"})`;
  const example = '(kube_pod_container_status_waiting_reason{pod="cowclicker-xlsmq"})'

  let finalPendingQueryUrl: string = '';
  if (useCase==='actual') {
    finalPendingQueryUrl = url + promql + pendingReasonQuery;
  } 

  fetch(finalPendingQueryUrl)
    .then(data => data.json())
    .then(data => {
      if (data.data.result.length===0) {
        setRan(true);  
        return 'no';
      };
      const reason = data.data.result[0].metric.reason;
      setLogInfo(reason);
      setNoError('yes error');
      setRan(true);  
    })
}
