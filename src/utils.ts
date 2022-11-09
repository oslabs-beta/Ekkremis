
// import { app } from 'electron';
import path from 'path';

/*
This function is a test to see if mock data can be fetched from a local json file, in order to reuse the fetch functionality for actual Prometheus metrics.
The fetch funtionality works for the json file when hardcoded as 'file:///Users/z/codesmith/Ekkremis/src/mock_data.json'.
Still need to find a way to dynamically build the file path to the mock data.
The app tries to fetch from localhost unless specifying 'file://'.
__dirname returns '/' from within this file.
Within main.ts, app.getPath('userData') returns the path that can be combined with 'file://' + app.getPath('userData') + '/src/mock_data.json'.
*/

export function test() {
  // console.log(__dirname) // returns '/'
  // const string = ('file:///Users/z/codesmith/Ekkremis/src/mock_data.json')
  const string = 'file://' + 'static';
  console.log(string);
  fetch(string)
    .then(data => data.json())
    .then(data => {

    })
}

// UseCase allows for only two accepted types for data source useCase, 'mock' & 'actual' .
type UseCase = "mock" | "actual";

// getPodInfo fetches the current phase of the pods along with total restarts and age in hours.
export async function getPodInfo(useCase: UseCase, setAllPods: any, setCurrentPods: any, url?: string) {
  // this promql is the initial portion of the Prometheus query string.
  const promql = '/api/v1/query?query=';

  // These are queries for the current phase of the pods along with total restarts and age in seconds.
  let statusPhaseQuery = '(kube_pod_status_phase)==1';
  let restartQuery = '(kube_pod_container_status_restarts_total)';
  let ageQuery = '(kube_pod_start_time)';
  let memoryQuery = '(container_memory_working_set_bytes)';

  let finalStatusUrl: string = '';
  let finalRestartUrl: string = '';
  let finalAgeUrl: string = '';
  let finalMemoryQuery: string = '';
  if (useCase==='actual') {
    finalStatusUrl = url + promql + statusPhaseQuery;
    finalRestartUrl = url + promql + restartQuery;
    finalAgeUrl = url + promql + ageQuery;
    finalMemoryQuery = url + promql + memoryQuery;
  } 
  // console.log('sendQuery invoked', finalStatusUrl)

  // Three separate fetch requests are made here to build up a restart object that stores restarts and the pod age converted from seconds to hours.
  // The last fetch request gets the pod status object and then maps the restarts and age to each pod before setting the allPods state.
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
        // console.log('after first fetch:', restartObject)
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
          // console.log('after second fetch:',restartObject)
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
            
          })
      })
      .then(() => {
        fetch(finalMemoryQuery)
          .then(data => data.json())
          .then(data => {
            let resultArray;
            if (useCase==='mock') resultArray = data[memoryQuery].data.result;
            else if (useCase==='actual') resultArray = data.data.result;
            // loop thru resultArray to create an object storing key values pairs of podName : value 
            const podMemoryObject : any = {};
            for (let i=0; i<resultArray.length; i++) {
              if (resultArray[i].metric.hasOwnProperty('pod')) {
                // converting the metric from bytes to megabytes and store it in podMemoryObject
                podMemoryObject[resultArray[i].metric.pod] = (resultArray[i].value[1])/(10**6)
              }
            }
            console.log(podMemoryObject);
            // loop thru resultObject to add the new value to each pod 
            for (let statusKey in resultObject) {
              for (let podName in resultObject[statusKey]) {
                if (podMemoryObject.hasOwnProperty(podName)) resultObject[statusKey][podName]['memoryUse'] = podMemoryObject[podName];
                else resultObject[statusKey][podName]['memoryUse'] = 0;
                console.log(resultObject[statusKey][podName])
              }
            }
            return resultObject
          })
          .then(data => {
            console.log('in utils, resultObject: ', data);
            setAllPods(data);
          })
          .then (()=> {
            const summary = generateSummary(resultObject);
            setCurrentPods(summary)
            document.getElementById('summary-button')?.click();
          })
      })
}

/*
getPendingReason queries for the pod's waiting reason.
If the pod is not waiting, a waiting reason is not set.
If the pod is waiting, a waiting reason is set.
*/
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
        // setRan to true so the Log component renders in place of the Loading component.
        setRan(true);  
        return 'no';
      };
      const reason = data.data.result[0].metric.reason;
      // Set the error log reason to be the reason.
      setLogInfo(reason);
      // Set the noError state to have an error.
      setNoError('yes error');
      // setRan to true so the Log component renders in place of the Loading component.
      setRan(true);  
    })
}


  // function to convert all pod data to summary format
  function generateSummary(allPods: any) {
    console.log("inside generateSummary(): data: ", allPods)
    // array of keys of allPods
    let keysArray = Object.keys(allPods);
    console.log(keysArray)
    let resultObject = {};
    for (let i = 0; i < keysArray.length; i++) {
      console.log('in for loop', i, resultObject)
      Object.assign(resultObject, allPods[keysArray[i]]);
    }
    console.log("inside generateSummary(): return: ", resultObject);
    // return an object that's in an accepted format by currentPods
    return resultObject;
  }