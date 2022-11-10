
// import { app } from 'electron';
import path from 'path';
import { getPositionOfLineAndCharacter } from 'typescript';

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
export function getPodInfo(useCase: UseCase, setAllPods: any, setCurrentPods: any, url?: string) {
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
  let finalMemoryUrl: string = '';
  if (useCase==='actual') {
    finalStatusUrl = url + promql + statusPhaseQuery;
    finalRestartUrl = url + promql + restartQuery;
    finalAgeUrl = url + promql + ageQuery;
    finalMemoryUrl = url + promql + memoryQuery;
  } 
  // console.log('sendQuery invoked', finalStatusUrl)

  // Three separate fetch requests are made here to build up a restart object that stores restarts and the pod age converted from seconds to hours.
  // The last fetch request gets the pod status object and then maps the restarts and age to each pod before setting the allPods state.
  let resultObject :any = {"pending": {}, "running": {}, "succeeded": {}, "unknown": {}, "failed": {}};
  let restartObject :any = {};

    fetchRestart(finalRestartUrl, 'actual', restartObject)
      .then(async () => {
        await fetchAge(finalAgeUrl, 'actual', restartObject)
      })
      .then(async () => {
        await fetchStatus(finalStatusUrl, 'actual', resultObject, restartObject)
      })
      .then(async () => {
        await fetchMemory(finalMemoryUrl, 'actual', resultObject, setAllPods, setCurrentPods)
      })
      .then(async() => {
        await setPods(setAllPods, setCurrentPods, resultObject)
      })
      .then(() => {
        console.log('end of getPodInfo()')
      })
      .catch((error) => {
        console.log('catching error in promise chain in getPodInfo: ', error)
      })
}


// modularizing fetch functions required for getPodInfo() 
async function fetchRestart(finalRestartUrl: string, useCase: string, restartObject: any) {
  await fetch(finalRestartUrl)
      .then(data => data.json())
      .then(data => {
        let resultArray;
        // if (useCase==='mock') resultArray = data[restartQuery].data.result;
        if (useCase==='actual') resultArray = data.data.result;
        for (let i=0; i<resultArray.length; i++) {
          restartObject[resultArray[i].metric.pod] = {};
          restartObject[resultArray[i].metric.pod]['restart'] = Number(resultArray[i].value[1]);
        }
      })
}

async function fetchAge(finalAgeUrl: string, useCase: string, restartObject: any) {
  await fetch(finalAgeUrl)
    .then((data) => data.json())
    .then((data) => {
      let resultArray;
      // if (useCase === "mock") resultArray = data[restartQuery].data.result;
      if (useCase === "actual") resultArray = data.data.result;
      const currentTime = Math.floor(Date.now() / 1000);
      for (let i = 0; i < resultArray.length; i++) {
        restartObject[resultArray[i].metric.pod]["age"] = Math.round(
          (currentTime - Number(resultArray[i].value[1])) / 3600
        );
      }
    });
}

async function fetchStatus(finalStatusUrl: string, useCase: string, resultObject: any, restartObject: any) {
  await fetch(finalStatusUrl)
    .then((data) => data.json())
    .then((data) => {
      // format the data
      let resultArray;
      // if (useCase === "mock") resultArray = data[statusPhaseQuery].data.result;
      if (useCase === "actual") resultArray = data.data.result;
      for (let i = 0; i < resultArray.length; i++) {
        let tempObject: any = {};
        let podName = resultArray[i].metric.pod;
        tempObject["namespace"] = resultArray[i].metric.namespace;
        tempObject["status"] = resultArray[i].metric.phase;
        // check if the current pod name wasn't fetched by the first 2 fetch requests, skip if it doesnt exist
        if (restartObject.hasOwnProperty(podName)) {
          tempObject["restart"] = restartObject[podName].restart
            ? restartObject[podName].restart
            : 0;
          tempObject["age"] = restartObject[podName].age
            ? restartObject[podName].age
            : 0;
        } 
        let status = resultArray[i].metric.phase.toLowerCase();
        resultObject[status][podName] = tempObject;
        if (!resultObject[status][podName].hasOwnProperty('restart')) {
          resultObject[status][podName]['restart'] = 0; 
          resultObject[status][podName]['age'] = 0;
        }
      }
    });
}

async function fetchMemory(finalMemoryUrl: string, useCase: string, resultObject: any, setAllPods: any, setCurrentPods: any) {
  await fetch(finalMemoryUrl)
    .then((data) => data.json())
    .then((data) => {
      let resultArray;
      // if (useCase === "mock") resultArray = data[memoryQuery].data.result;
      if (useCase === "actual") resultArray = data.data.result;
      // loop thru resultArray to create an object storing key values pairs of podName : value
      const podMemoryObject: any = {};
      for (let i = 0; i < resultArray.length; i++) {
        if (resultArray[i].metric.hasOwnProperty("pod")) {
          // converting the metric from bytes to megabytes and store it in podMemoryObject
          podMemoryObject[resultArray[i].metric.pod] =
            resultArray[i].value[1] / 10 ** 6;
        }
      }
      // loop thru resultObject to add the new value to each pod
      for (let statusKey in resultObject) {
        for (let podName in resultObject[statusKey]) {
          if (podMemoryObject.hasOwnProperty(podName))
            resultObject[statusKey][podName]["memoryUse"] =
              podMemoryObject[podName];
          else resultObject[statusKey][podName]["memoryUse"] = 0;
        }
      }
    })
}

async function setPods(setAllPods: any, setCurrentPods: any, resultObject: any) {
  await setAllPods(resultObject);

  const summary = generateSummary(resultObject);
  await setCurrentPods(summary);
  document.getElementById("summary-button")?.click();
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
// set return type to any because function can return string or undefined 
export async function checkRunningPodError(podName: string, currentUrl: string, setClassName: any, setButtonClassName: any) :Promise<any> {
  const promql = '/api/v1/query?query=';
  const pendingReasonQuery = `(kube_pod_container_status_waiting_reason{pod="${podName}"})`;

  const finalUrl = currentUrl + promql + pendingReasonQuery;
  await fetch(finalUrl)
    .then(data => data.json())
    .then(data => {
      if (data.data.result.length) {
        const reason = data.data.result[0].metric.reason;
        console.log("podName: ", podName, 'REASON:', reason);
        setClassName('pod-info pod-info-pending');  
        setButtonClassName('log-button-pending')                                                                                              
      }
    })
    .catch((error) => {
      console.log('error occured in checRunningPodError: ', error)
    })
}


// function to convert all pod data to summary format
function generateSummary(allPods: any) {
  console.log("inside generateSummary(): data: ", allPods)
  // array of keys of allPods
  let keysArray = Object.keys(allPods);
  // console.log(keysArray, allPods[keysArray[0]])
  let resultObject = {};
  for (let i = 0; i < keysArray.length; i++) {
    // console.log('in for loop', i, resultObject)
    Object.assign(resultObject, allPods[keysArray[i]]);
  }
  // console.log("inside generateSummary(): return: ", resultObject);
  // return an object that's in an accepted format by currentPods
  return resultObject;
}