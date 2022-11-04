const fetch = require('node-fetch');


const ekkremisController = {};

ekkremisController.getAllPodsInfo = (req, res, next) => {
  console.log('inside getAllPodsInfo middleware')
  // get the prometheus end point from the request 
  const rootUrl = req.body.url;
  const promql = '/api/v1/query?query=';
  let query = '(kube_pod_status_phase)==1';
  const finalUrl = rootUrl + promql + query;
  fetch(finalUrl)
    .then(data => data.json())
    .then(data => {
      console.log('inside 2nd then. data: ', data)
      // format the data 
      let resultArray = data.data.result;
      let resultObject = {"pending": {}, "running": {}, "successful": {}, "unkown": {}, "failed": {}};
      for (let i=0; i<resultArray.length; i++) {
        let tempObject = {};
        let podName = resultArray[i].metric.pod;
        tempObject["node"] = resultArray[i].metric.namespace;
        tempObject["status"] = resultArray[i].metric.phase;
        tempObject["restart"] = 1;
        tempObject["age"] = 5;
        resultObject[resultArray[i].metric.phase.toLowerCase()][podName] = tempObject;
      }
      res.locals.getAllPodsInfo = resultObject;
      return next();
    })
    .catch(error => {
      console.log('caught on line 28 of controllers.js: ', error);
    })
}




module.exports = ekkremisController;