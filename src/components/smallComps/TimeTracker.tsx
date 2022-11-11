import React, { useState, useEffect } from 'react';


const TimeTracker = (props: any) => {
  const [timeLapsed, setTimeLapsed] = useState(0)
  // update the time lapsed every second 
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Math.floor(Date.now() / 1000);
      const newInterval = currentTime - props.lastUpdate;
      console.log(currentTime, props.lastUpdate)
      setTimeLapsed(newInterval)
    }, 1000)
    return () => {
      clearInterval(interval);
    };
  }, [props.lastUpdate]);
  return(
    <div className='time-tracker'>
      <h3>Last Updated:</h3>
      <h4>{timeLapsed}</h4>
      <h3>seconds ago  </h3>
    </div>
  )
}

export default TimeTracker;