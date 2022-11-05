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

  let finalStatusUrl: string = './mock_data.json';
  let finalRestartUrl: string = './mock_data.json';
  if (useCase==='actual') {
    finalStatusUrl = url + promql + statusPhaseQuery;
    finalRestartUrl = url + promql + restartQuery;
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
          restartObject[resultArray[i].metric.pod] = Number(resultArray[i].value[1]);
        }
      })
      .then(()=> {
        Math.floor(Date.now() / 1000) 
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
              tempObject["restart"] = restartObject[podName] ? restartObject[podName] : 0
              // tempObject["age"] = 5;
              resultObject[resultArray[i].metric.phase.toLowerCase()][podName] = tempObject;
            }
          })
      })

    console.log('inside utils, resultObject: ', resultObject)
    setAllPods(resultObject)
    // return resultObject; 

}

