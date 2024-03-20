import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

/**
 * 
 * @description Temporary data visualization with help from ChatGPT
 */
const DataVisualization = () => {
    const chartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      if (chartRef.current) {

        const data = {
          labels: ["1: Train", "2: Train", "3: Truck", "4: Air Cargo", "5: Truck", "6: Hybrid Truck"],
          datasets: [{
            label: 'CO2 emission',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(53, 162, 234, 1)',
            borderWidth: 1,
            data: [8, 3, 6, 25, 2, 1],
          }]
        };
  
        const options = {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        };
  
        const chart = new Chart(chartRef.current, {
          type: 'bar',
          data: data,
          options: options
        });

        return () => {
          chart.destroy();
        };
      }
    }, []);
  
    return (
      <div style={{ width: "600px", height: "400px", margin: "0 auto" }}>
        <h1>Carbon emission by mode:</h1>
        <canvas ref={chartRef} width="600" height="400"></canvas>
      </div>
    );
  };
    
  export default DataVisualization;
