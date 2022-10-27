// promQL Query Bar
import React, { useState } from 'react';
import '../styles/queryBar.css';

function QueryBar() {
    const [status, setStatus] = useState(0);

    return (
      <div className="query-container">
        <div className='query-bar'>
            <button className='query-btn'>Pending</button>
            <button className='query-btn'>Unknown</button>
            <button className='query-btn'>Running</button>
            <button className='query-btn'>Failed</button>
            <button className='query-btn'>Successful</button>
            <button className='query-btn'>Summary</button>
        </div>
      </div>
    );
  }
  
  export default QueryBar;