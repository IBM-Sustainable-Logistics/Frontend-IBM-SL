import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { Stage, project } from "../lib/Transport.ts";

type DataProps = {
  stages: Stage[];
};

const DataVisualization: React.FC<DataProps> = ({ stages }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const data = {
        datasets: [
          {
            label: "CO2 emission kg",
            backgroundColor: stages.map((stage) => {
              return stage.transportMethod === "truck"
                ? "rgba(29, 149, 39, 0.2)"
                : "rgba(54, 162, 235, 0.2)";
            }),
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
            data: stages.map((stage) => stage.emission || 0),
          },
        ],
        labels: stages.map((stage, index) => {
          return `Stage ${index + 1}- ${
            stage.usesAddress
              ? "from " +
                stage.from.city +
                " " +
                stage.from.country +
                " to  " +
                stage.to.city +
                " " +
                stage.to.country
              : stage.distance
          } - ${stage.transportMethod}`;
        }),
      };

      const options = {
        indexAxis: "y",
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value: GLfloat) {
                return `stage -  ${value + 1}  `;
              },
            },
          },
        },
      };

      const chart = new Chart(chartRef.current, {
        type: "bar",
        data: data,
        options: options,
      });

      return () => {
        chart.destroy();
      };
    }
  }, []);

  return (
    <canvas
      ref={chartRef}
      className=" m-auto block"
      width="400"
      height="200"
    ></canvas>
  );
};

export default DataVisualization;
