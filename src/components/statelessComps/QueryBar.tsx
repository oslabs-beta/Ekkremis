// promQL Query Bar
import '../../styles/queryBar.css';
import React, { useState, useEffect } from 'react';

// This is the QueryBar component that allows users to select the pod status to be displayed. The default status is set to summary.
function QueryBar(props: any) {

  // updates status upon button click
  const handleClick = (string: string) => {
    // console.log('inside status button handleclick', string)
    props.setStatus(string)    
    // change every other button's class back to 'query-btn-unselected'
    const previousActive = document.getElementsByClassName('active');
    if (previousActive[0]) previousActive[0].classList.remove('active');
    // figure out how to change the current button's class to 'active' 
    let activeButton = document.getElementById(string + '-button');
    activeButton?.classList.add('active');
    props.setPreventChartLooping(true);
  };

  return (
    <div className="query-container">
      <div className='query-bar'>
        <img className='sub' src={require('../../img/Ekkremis-sm.png')} alt={'EkkremisSubmarine'} />
        <button onClick={() => { handleClick('summary') }} id='summary-button' className='query-btn-unselected'>Summary</button>
        <button onClick={() => { handleClick('pending') }} id='pending-button'className='query-btn-unselected'>Pending</button>
        <button onClick={() => { handleClick('unknown') }} id='unknown-button' className='query-btn-unselected'>Unknown</button>
        <button onClick={() => { handleClick('running') }} id='running-button' className='query-btn-unselected'>Running</button>
        <button onClick={() => { handleClick('failed') }} id='failed-button' className='query-btn-unselected'>Failed</button>
        <button onClick={() => { handleClick('successful') }} id='successful-button' className='query-btn-unselected'>Successful</button>
      </div>
    </div>
  );
};

export default QueryBar;