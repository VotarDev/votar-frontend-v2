import React from "react";
import { Chart } from "chart.js/auto";
import { Line, Bar } from "react-chartjs-2";
import { de } from "date-fns/locale";
import "chartjs-adapter-date-fns";
import { CategoryScale } from "chart.js";
Chart.register(CategoryScale);

const LineChart = ({ chartData }: any) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "hour",
          displayFormats: {
            hour: "HH:mm",
          },
          tooltipFormat: "d MMM yyyy HH:mm",
        },
        min: "2022-10-03T08",
        max: "2022-10-03T18",
        adapters: {
          date: {
            locale: de,
          },
        },
        display: true,
        border: {
          width: 2,
          color: "#000",
        },
        grid: {
          display: false,
          color: "#000",
          borderColor: "#000",
        },
        title: {
          display: true,
          text: "Time (Hrs)",
        },
      },

      y: {
        display: true,
        border: {
          width: 2,
          color: "#000",
        },
        grid: {
          display: false,
          borderColor: "#000",
        },
        title: {
          display: true,
          text: "No of Votes",
        },
        ticks: {
          min: 0,
          max: 700,
          stepSize: 50,
          suggestedMin: 0,
          suggestedMax: 700,
        },
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  };

  return (
    <div className="mb-20 max-w-[1200px] mx-auto flex flex-row bg-slate-50 px-10 p-[90px] border-l-4 border-l-[#015CE9]">
      <div className="w-[712px] h-[568px]">
        {/* @ts-ignore */}
        <Line data={chartData} options={options} />
      </div>
      <div className="">
        <div className="text-blue-700 text-2xl font-semibold p-2.5 relative before:contents-[' '] before:w-[80%] before:absolute before:h-[2.5px] before:bg-blue-700 before:top-[90%] w-20 flex items-center justify-center">
          Keys
        </div>
        <div className="text-stone-900 text-lg font-semibold pt-4">
          Total Number of Votes Per Hour
        </div>
      </div>
    </div>
  );
};

export default LineChart;
