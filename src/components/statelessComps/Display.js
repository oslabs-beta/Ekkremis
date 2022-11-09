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
const dataSummaryDoughnut = {
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

const configSummaryDoughnut = {
  type: 'doughnut',
  data: dataSummaryDoughnut,
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



const dataMemoryBar = {
  labels: ['jan', 'feb', 'marshfghdfasdafsdghrhsahfgh', 'blah', 'blah2', 'blah3fdghdfghsfghfdfgsdfgdfgjfghjgfgjghfjghkfghkkfgghkrdhs', 'wow', 'wham', 'great'],
  datasets: [{
    label: 'Memory Usage by Pod',
    data: [65, 59, 80, 81, 56, 55, 40, 50, 750],
    backgroundColor: [
      'rgba(255, 99, 132, 0.5)',
      'rgba(255, 159, 64, 0.5)',
      'rgba(255, 205, 86, 0.5)',
      'rgba(75, 192, 192, 0.5)',
      'rgba(54, 162, 235, 0.5)',
      'rgba(153, 102, 255, 0.5)'
    ],
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)'
    ],
    borderWidth: 1
  }]
};

const configMemoryBar = {
  type: 'bar',
  data: dataMemoryBar,
  options: {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value, index, ticks) {
            return value + 'MB';
          }
        }
      }
    }
  },
};


// component for displaying modals based on active pod 
const Display = (props) => {
  const [startChart, setStartChart] = useState(false);

  // state for logging current charts to be displayed
  const [currentChartObject, setCurrentChartObject] = useState({'summaryDoughnutChart': configSummaryDoughnut});
  const [currentChart, setCurrentChart] = useState('summaryDoughnutChart');

  let myChart; 


  // this use effect listens to startChart state, which is changed by the handleClick function, invoked when the show chart button is clicked. this ensures the chart never tries to load before the canvas DOM element is created
  useEffect(() => {
    // console.log("inside Display useEffect");
    // console.log(document.getElementById("myChart"));
    // console.log(currentChartObject[currentChart]);

    // update chart data depending on current chart state 
   
    switch (currentChart) {
      case "memoryBarChart" :
        updateMemoryChartData();
      default : 
        updateSummaryChartData();
    }
    // setting config to the one corresponding to the current chart state
    let config = currentChartObject[currentChart];

    if (props.preventChartLooping) {
      console.log('current config: ', config)
      // on initial load
      if (props.allPods.initial) config = configSummaryDoughnut;
      destroyChart();
      myChart = new Chart(
        document.getElementById("myChart"), 
        config
      );
      props.setPreventChartLooping(false);
    }
  }, [startChart, currentChart, props.currentPods]);

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

  
  const updateSummaryChartData = () => {
    // generate summary object - maybe use caching here to improve performance? or this would be executed every time
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
    dataSummaryDoughnut.labels = doughnutSummaryKeysArray;
    if (props.allPods.initial) doughnutSummaryValuesArray = [0, 0, 0, 100, 0];
    dataSummaryDoughnut.datasets[0].data = doughnutSummaryValuesArray;
    totalPods = podSum;
    configSummaryDoughnut.options.plugins.title.text =
    "Total Pods in Your Kubernetes Cluster: " + totalPods;
  }
  
  // modularizing updating data for memory use chart by parsing thru the currentPods state that's passed down 
  const updateMemoryChartData = () => {
    const labelsArray = [];
    const dataArray = [];

    for (let key in props.currentPods) {
      labelsArray.push(key);
      dataArray.push(props.currentPods[key].memoryUse)
    };
    dataMemoryBar.labels = labelsArray;
    dataMemoryBar.datasets[0].data = dataArray;
  }
  
  // toggle between different charts 
  const handleClick = (str) => {
    // update states 
    setStartChart(true);
    props.setPreventChartLooping(true);
    setCurrentChart(str)
    // giving currently active button a 'active' class 
    const previousActive = document.getElementsByClassName('activeChartButton');
    if (previousActive[0]) previousActive[0].classList.remove('activeChartButton');
    // figure out how to change the current button's class to 'active' 
    let activeButton = document.getElementById(str + 'Button');
    activeButton?.classList.add('activeChartButton');
    if (str==='summaryDoughnutChart') setCurrentChartObject({'summaryDoughnutChart': configSummaryDoughnut});
    if (str==='testChart') setCurrentChartObject({'testChart' : configTest});
    if (str==='memoryBarChart') setCurrentChartObject({'memoryBarChart': configMemoryBar});
  }
  
  return (
    <div id='display' className='display'>
      <div className='display-menu'>
        <button id='summaryDoughnutChartButton' className='chartButton' onClick={() => { handleClick('summaryDoughnutChart') }}>SUMMARY</button>
        <button id='testChartButton' className='chartButton' onClick={() => { handleClick('testChart') }}>CPU USAGE</button>
        <button id='memoryBarChartButton' className='chartButton' onClick={() => { handleClick('memoryBarChart') }}>MEMORY USAGE</button>
        <button id='pendingButton'className='chartButton' onClick>SHOW PENDING</button>
      </div>
      {/* <img src="https://miro.medium.com/max/1400/1*QwGqOMObJd7oFHCfe1AvxA.png" alt="" /> */}
      <canvas id="myChart"></canvas>
    </div>
  )
}

export default Display;