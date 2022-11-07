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


const dataDoughnut = {
  labels: [
    'Red',
    'Blue',
    'Yellow'
  ],
  datasets: [{
    label: 'Pod Status',
    data: [300, 50, 100],
    backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 205, 86)'
    ],
    hoverOffset: 4
  }]
};

const configDoughnut = {
  type: 'doughnut',
  data: dataDoughnut,
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
  // state for making sure the useEffect doesn't loop
  const [preventLooping, setPreventLooping] = useState(false);

  // state for logging current charts to be displayed
  const [currentChartObject, setCurrentChartObject] = useState({'test': configTest});
  const [currentChart, setCurrentChart] = useState('test');

  let myChart; 


  // this use effect listens to startChart state, which is changed by the handleClick function, invoked when the show chart button is clicked. this ensures the chart never tries to load before the canvas DOM element is created
  useEffect(() => {
    console.log('inside Display useEffect')
    console.log(document.getElementById('myChart'))
    if (preventLooping) {
      console.log('currentChartObject: ', currentChartObject)
        myChart = new Chart(
        document.getElementById('myChart'),
        currentChartObject[currentChart]
      );
      setPreventLooping(false);
    }
  }, [startChart, currentChart])


  const handleClick = (str) => {
    console.log('inside Display handleClick')
    // remove chart using canvas 
    if(myChart) myChart.destroy();
    const oldCanvas = document.getElementById('myChart');
    oldCanvas.remove();
    const newCanvas = document.createElement('canvas');
    newCanvas.setAttribute('id', 'myChart');
    const parent = document.getElementById('display');
    parent.append(newCanvas);

    console.log('after destroy: ', myChart)
    setStartChart(true);
    setPreventLooping(true);
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