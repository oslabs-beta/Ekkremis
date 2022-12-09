import React from 'react';
import { Bar, Line, Pie, defaults } from 'react-chartjs-2';

defaults.global.legend.position = 'bottom';

const xlabels = ['name','for','each','collum','goes','here'];

const Charts = () => {
    return( 
        <div className="container">
        {/* <canvas id="myChart"></canvas> this is for vanilla JS without using npm */}
       <Pie/>
       <Line/>
        <Bar
        data={{
            labels: xlabels,
            datasets: [
                {
                    label: "pending pods",
                    data: ['info','goes','here'],
                    backgroundColor: 'red', //this can be a single value, or an array of colors. 
                    //the order of the colors corresponds with the data array order
                    borderColor: 'red', //same functionality as backgroungColor
                    borderWidth: 1,

                }
            ]
        }}
        height={100}
        width={200}
        options={{maintainAspectRatio:false}}
        
        />
  </div>
  );
};


export default Charts;


