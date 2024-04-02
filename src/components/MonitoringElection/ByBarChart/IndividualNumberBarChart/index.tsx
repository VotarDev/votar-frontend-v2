import React, { useState, useEffect } from "react";
import { generateUniqueColors, votingCandidateBarGraph } from "@/utils/util";
import { Chart, ChartConfiguration } from "chart.js/auto";
import { Line, Bar } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
Chart.register(CategoryScale);
import { de } from "date-fns/locale";
import "chartjs-adapter-date-fns";
import leftline from "@/public/assets/images/left-line.svg";
import rightline from "@/public/assets/images/right-line.svg";

const IndividualNumberBarChart = () => {
  const [isMounted, setIsMounted] = useState(false);
  const randomColors = [
    "#b138b3",
    "#00ff00",
    "#015CE9",
    "#E46F24",
    "#93241F",
    "#406b83",
  ];
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const option = {
    responsive: true,
    maintainAspectRatio: false,
    maxBarThickness: 50,
    plugins: {
      legend: {
        display: true,
        position: "right",
        align: "start",
        maxWidth: 200,
        labels: {
          boxWidth: 20,
          padding: 16,
          font: {
            size: 16,
            color: "#151B27",
          },
        },
        font: {
          size: 30,
          color: "#151B27",
        },
      },
    },
    scales: {
      x: {
        grid: {
          offset: false,
          display: false,
          borderColor: "#000",
        },
      },
      y: {
        grid: {
          display: false,
          borderColor: "#000",
        },
      },
    },
  };

  return (
    <>
      <div className="max-w-[1200px] mx-auto flex flex-col gap-20">
        {votingCandidateBarGraph.map((position, index) => {
          const generateRandomColor =
            randomColors[Math.floor(Math.random() * randomColors.length)];
          const predefinedColors = [
            "#00f",
            "#f00",
            "#008000",
            "#93241F",
            "#b138b3",
            "#406b83",
          ];
          const borderColors = generateUniqueColors(
            position.candidates.length,
            predefinedColors
          );
          const dat = () => {
            return {
              labels: position.candidates.map((col) => col.name),
              datasets: position.candidates.map((col, i) => {
                return {
                  label: col.name,
                  data: col.datasets,
                  borderColor:
                    col.name === "Abstained" ? "#000000" : borderColors[i],
                  backgroundColor:
                    col.name === "Abstained" ? "#000000" : borderColors[i],
                  borderWidth: 2,
                };
              }),
            };
          };
          return (
            <div
              key={index}
              className="bg-slate-50 p-10 "
              style={{
                ...(isMounted && {
                  borderLeft: `4px solid ${generateRandomColor}`,
                }),
              }}
            >
              <div className="text-center text-slate-900 lg:text-[28px] text-base font-semibold flex items-center justify-center gap-2 uppercase">
                <div>
                  <img
                    src={leftline.src}
                    alt="line"
                    className="w-14 lg:w-full"
                  />
                </div>
                <div>{position.position}</div>
                <div>
                  <img
                    src={rightline.src}
                    alt="line"
                    className="w-14 lg:w-full"
                  />
                </div>
              </div>
              <div className="w-[712px] h-[568px] mx-auto pt-10 relative">
                {/* @ts-ignore */}
                <Bar data={dat()} options={option} />
                <div className="absolute right-28 top-px">
                  <div className="text-blue-700 text-2xl font-semibold p-1.5 relative before:contents-[' '] before:w-[80%] before:absolute before:h-[2.5px] before:bg-blue-700 before:top-[90%] w-20 flex items-center justify-center">
                    keys
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default IndividualNumberBarChart;
