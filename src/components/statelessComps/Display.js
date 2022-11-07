// importing dependencies 
import React, { useState, useEffect } from 'react';
import './../../styles/display.css';
import Chart from 'chart.js/auto'

// component for displaying modals based on active pod 
const Display = (props) => {
  const [startChart, setStartChart] = useState(false);
  // state for making sure the useEffect doesn't loop
  const [preventLooping, setPreventLooping] = useState(false);

  const labels = [
    '18:50',
    '18:51',
    '18:52',
    '18:53',
    '18:54',
    '18:55',
  ];

  const data = {
    labels: labels,
    datasets: [{
      label: 'CPU Usage',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: [0, 10, 5, 2, 20, 30, 45],
    }]
  };

  const config = {
    type: 'line',
    data: data,
    options: {}
  };

  // this use effect listens to startChart state, which is changed by the handleClick function, invoked when the show chart button is clicked. this ensures the chart never tries to load before the canvas DOM element is created
  useEffect(() => {
    if (preventLooping) {
      const myChart = new Chart(
        document.getElementById('myChart'),
        config
      );
      setPreventLooping(false);
    }
  }, [startChart])


  const handleClick = () => {
    setStartChart(true);
    setPreventLooping(true);
  }


  return (
    <div className='display'>
      <button className='chartButton' onClick={() => { handleClick() }}>SHOW CHART</button>
      {/* <img src="https://miro.medium.com/max/1400/1*QwGqOMObJd7oFHCfe1AvxA.png" alt="" /> */}
      <canvas id="myChart"></canvas>
    </div>
  )
}

export default Display;