// importing dependencies 
import React, { useState, useEffect } from 'react';
import './../../styles/display.css';
import Chart from 'chart.js/auto'
import { displayPartsToString } from 'typescript';

const labelsTest = [
  '18:50',
  '18:51',
  '18:52',
  '18:53',
  '18:54',
  '18:55',
];

const dataTest = {
  labels: labelsTest,
  datasets: [{
    label: 'CPU Usage',
    backgroundColor: 'rgb(255, 99, 132)',
    borderColor: 'rgb(255, 99, 132)',
    data: [0, 10, 5, 2, 20, 30, 45],
  }]
};

const configTest = {
  type: 'line',
  data: dataTest,
  options: {}
};

let totalPods = 0;
const dataDoughnut = {
  labels: [
    'Red',
    'Blue',
    'Yellow'
  ],
  datasets: [{
    label: 'Pod Status',
    data: [0, 0, 0,100, 0],
    backgroundColor: [
      'rgb(255, 205, 1)',
      'rgb(112, 229, 178)',
      'rgb(54, 162, 235)',
      'rgb(156, 156, 156)',
      'rgb(255, 99, 132)'
    ],
    hoverOffset: 5
  }],
};

const configDoughnut = {
  type: 'doughnut',
  data: dataDoughnut,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Total Pods in Your Kubernetes Cluster: ' + totalPods
      }
    }
  },
};


// const labelsBar = Utils.months({count: 7});
// const dataBar = {
//   labels: labelsBar,
//   datasets: [{
//     label: 'My First Dataset',
//     data: [65, 59, 80, 81, 56, 55, 40],
//     backgroundColor: [
//       'rgba(255, 99, 132, 0.2)',
//       'rgba(255, 159, 64, 0.2)',
//       'rgba(255, 205, 86, 0.2)',
//       'rgba(75, 192, 192, 0.2)',
//       'rgba(54, 162, 235, 0.2)',
//       'rgba(153, 102, 255, 0.2)',
//       'rgba(201, 203, 207, 0.2)'
//     ],
//     borderColor: [
//       'rgb(255, 99, 132)',
//       'rgb(255, 159, 64)',
//       'rgb(255, 205, 86)',
//       'rgb(75, 192, 192)',
//       'rgb(54, 162, 235)',
//       'rgb(153, 102, 255)',
//       'rgb(201, 203, 207)'
//     ],
//     borderWidth: 1
//   }]
// };

// const configBar = {
//   type: 'bar',
//   data: data,
//   options: {
//     scales: {
//       y: {
//         beginAtZero: true
//       }
//     }
//   },
// };

// component for displaying modals based on active pod 
const Display = (props) => {
  const [startChart, setStartChart] = useState(false);

  // state for logging current charts to be displayed
  const [currentChartObject, setCurrentChartObject] = useState({'doughnutChart': configDoughnut});
  const [currentChart, setCurrentChart] = useState('doughnutChart');

  let myChart; 


  // this use effect listens to startChart state, which is changed by the handleClick function, invoked when the show chart button is clicked. this ensures the chart never tries to load before the canvas DOM element is created
  useEffect(() => {
    // console.log("inside Display useEffect");
    // console.log(document.getElementById("myChart"));
    // console.log(currentChartObject[currentChart]);

    // geenrate summary object - maybe use caching here to improve performance? or this would be executed every time
    const doughnutSummaryObject = {};
    for (let key in props.allPods) {
      let count = 0;
      for (let innerKey in props.allPods[key]) {
        count++;
      }
      doughnutSummaryObject[key] = count;
    }
    console.log(doughnutSummaryObject);

    // generate summary arrays
    const doughnutSummaryKeysArray = [];
    let doughnutSummaryValuesArray = [];
    for (let key in doughnutSummaryObject) {
      doughnutSummaryKeysArray.push(key);
      doughnutSummaryValuesArray.push(doughnutSummaryObject[key]);
    }

    // count total pods
    let podSum = 0;
    for (let i = 0; i < doughnutSummaryValuesArray.length; i++) {
      podSum += doughnutSummaryValuesArray[i];
    }

    // update the values for doughnut chart object
    dataDoughnut.labels = doughnutSummaryKeysArray;
    if (props.allPods.initial) doughnutSummaryValuesArray = [0, 0, 0, 100, 0];
    dataDoughnut.datasets[0].data = doughnutSummaryValuesArray;
    totalPods = podSum;
    configDoughnut.options.plugins.title.text =
      "Total Pods in Your Kubernetes Cluster: " + totalPods;

    if (props.preventChartLooping) {
      // console.log('currentChartObject: ', currentChartObject)
      let config = currentChartObject[currentChart];
      // on initial load
      if (props.allPods.initial) config = configDoughnut;
      destroyChart();
      myChart = new Chart(
        document.getElementById("myChart"), 
        config
      );
      props.setPreventChartLooping(false);
    }
  }, [startChart, currentChart, props.allPods]);

  // modularizing destroy chart 
  const destroyChart = () => {
    // remove chart that is currently using canvas 
    if(myChart) myChart.destroy();
    const oldCanvas = document.getElementById('myChart');
    oldCanvas.remove();
    const newCanvas = document.createElement('canvas');
    newCanvas.setAttribute('id', 'myChart');
    const parent = document.getElementById('display');
    parent.append(newCanvas);
  }

  const handleClick = (str) => {
    setStartChart(true);
    props.setPreventChartLooping(true);
    setCurrentChart(str)
    if (str==='doughnutChart') setCurrentChartObject({'doughnutChart': configDoughnut});
    if (str==='testChart') setCurrentChartObject({'testChart' : configTest});
  }


  return (
    <div id='display' className='display'>
      <div className='display-menu'>
        <button className='chartButton FPbutton' onClick={() => { handleClick('testChart') }}>SHOW CPU USAGE</button>
        <button className='chartButton FPbutton' onClick>SHOW MEMORY USAGE</button>
        <button className='chartButton FPbutton' onClick>SHOW PENDING PODS</button>
        <button id='doughnutChart' className='chartButton FPbutton' onClick={() => { handleClick('doughnutChart') }}>SHOW SUMMARY</button>
      </div>
      {/* <img src="https://miro.medium.com/max/1400/1*QwGqOMObJd7oFHCfe1AvxA.png" alt="" /> */}
      <canvas id="myChart"></canvas>
    </div>
  )
}

export default Display;