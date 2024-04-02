import React, { useState } from "react";
import { Chart } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
Chart.register(CategoryScale);

const TotalNumbersBarChart = () => {
  const [voteData, setVoteData] = useState([{ x: "Candidates", y: 200 }]);
  const data = {
    labels: voteData.map((x) => x.x),
    datasets: [
      {
        label: "No of Votes",
        data: voteData.map((v, i, a) => {
          return v.y;
        }),
        backgroundColor: "#015CE9",
        borderColor: "#015CE9",
        tension: 0.1,
      },
    ],
  };
  const options = {
    maxBarThickness: 100,
    scales: {
      x: {
        grid: {
          display: false,
          color: "#000",
          borderColor: "#000",
        },
      },
      y: {
        beginAtZero: true,

        ticks: {
          min: 0,
          max: 700,
          stepSize: 0,
          suggestedMin: 0,
          suggestedMax: 700,
        },
        grid: {
          display: false,
          color: "#000",
          borderColor: "#000",
        },
        title: {
          display: true,
          text: "No of Votes",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  return (
    <div className="mb-20 max-w-[1200px] mx-auto flex flex-row bg-slate-50 px-10 p-[90px] border-l-4 border-l-[#015CE9]">
      <div className="w-[812px] pb-20 pt-10">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default TotalNumbersBarChart;
