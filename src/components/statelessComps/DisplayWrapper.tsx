import React from 'react';
import Display from './Display';

const DisplayWrapper = () => {

  return (
    <div>
      <canvas id='myChart'></canvas>
      <Display />
    </div>
  )
}

export default DisplayWrapper;