// promQL Query Bar
import '../../styles/queryBar.css';
import React, { useState, useEffect } from 'react';

// This is the QueryBar component that allows users to select the pod status to be displayed. The default status is set to summary.
function QueryBar(props: any) {

  // updates status upon button click
  const handleClick = (string: string) => {
    // console.log('inside status button handleclick', string)
    props.setStatus(string)
  };

  return (
    <div className="query-container">
      <div className='query-bar'>
        <img className='sub' src={require('../../img/Ekkremis-sm.png')} alt={'EkkremisSubmarine'} />
        <button onClick={() => { handleClick('summary') }} className='query-btn-unselected'>Summary</button>
        <button onClick={() => { handleClick('pending') }} className='query-btn-unselected'>Pending</button>
        <button onClick={() => { handleClick('unknown') }} className='query-btn-unselected'>Unknown</button>
        <button onClick={() => { handleClick('running') }} className='query-btn-unselected'>Running</button>
        <button onClick={() => { handleClick('failed') }} className='query-btn-unselected'>Failed</button>
        <button onClick={() => { handleClick('successful') }} className='query-btn-unselected'>Successful</button>
      </div>
    </div>
  );
};

export default QueryBar;