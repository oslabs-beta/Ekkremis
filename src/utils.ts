export default function sendQuery(url: string, setAllPods: any) {
  const promql = '/api/v1/query?query=';
  let query = '(kube_pod_status_phase)==1';
  const finalUrl = url + promql + query;
  console.log('sendQuery invoked', finalUrl)
  fetch(finalUrl)
    .then(data => data.json())
    .then(data => {
      // format the data 
      let resultArray = data.data.result;
      let resultObject :any = {"pending": {}, "running": {}, "successful": {}, "unkown": {}, "failed": {}};
      for (let i=0; i<resultArray.length; i++) {
        let tempObject :any = {};
        let podName = resultArray[i].metric.pod;
        tempObject["node"] = resultArray[i].metric.namespace;
        tempObject["status"] = resultArray[i].metric.phase;
        tempObject["restart"] = 1;
        tempObject["age"] = 5;
        resultObject[resultArray[i].metric.phase.toLowerCase()][podName] = tempObject;
      }
      console.log('inside utils, resultObject: ', resultObject)
      setAllPods(resultObject)
      // return resultObject; 
    })
}