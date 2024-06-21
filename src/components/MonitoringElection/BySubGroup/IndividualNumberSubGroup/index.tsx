import React, { useState, useEffect } from "react";
import { Chart } from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
Chart.register(CategoryScale);
import "chartjs-adapter-date-fns";
import leftline from "@/public/assets/images/left-line.svg";
import rightline from "@/public/assets/images/right-line.svg";
import ChartDataLabels from "chartjs-plugin-datalabels";

const IndividualNumberSubGroup = ({ electionId }: { electionId: string }) => {
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

  const subGroupContents = [
    {
      position: "Chairman",
      candidates: [
        {
          name: "Adeleke Olusegun",
          datasets: [10, 15, 15, 25],
        },
        {
          name: "Olusegun Mayowa",
          datasets: [3, 15, 15, 25],
        },
        {
          name: "Olabunmi Sukuanmi",
          datasets: [15, 10, 10, 8],
        },
      ],
    },
    {
      position: "Vice Chairman",
      candidates: [
        {
          name: "Olusegun Mayowa",
          datasets: [10, 15, 15, 25],
        },
      ],
    },
    {
      position: "Secretary",
      candidates: [
        {
          name: "Olusegun Mayowa",
          datasets: [10, 15, 15, 25],
        },
        {
          name: "Olusegun Mayowa",
          datasets: [20, 15, 15, 25],
        },
      ],
    },
  ];

  const option = {
    plugins: {
      datalabels: {
        color: "#ffffff",
      },
      legend: {
        display: false,
        position: "right",
        align: "start",
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
  };

  useEffect(() => {
    if (typeof Chart !== "undefined") {
      Chart.register(ChartDataLabels);

      return () => {
        Chart.unregister(ChartDataLabels);
      };
    }
  }, []);

  return (
    <>
      <div className="max-w-[1200px] mx-auto flex flex-col gap-20 pb-20">
        {subGroupContents.map((items, index) => {
          const generateRandomColor =
            randomColors[Math.floor(Math.random() * randomColors.length)];
          const backgroundColors = items.candidates[0].datasets.map(
            (_, i) =>
              [
                "rgba(255, 186, 73, 1)",
                "rgba(204, 219, 220, 1)",
                "rgba(0, 18, 47, 1)",
                "rgba(166, 61, 64, 1)",
              ][i]
          );
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
                <div>{items.position}</div>
                <div>
                  <img
                    src={rightline.src}
                    alt="line"
                    className="w-14 lg:w-full"
                  />
                </div>
              </div>
              <div className="mx-auto pt-10 relative flex justify-center  gap-10">
                {items.candidates.map((candidate, candidateIndex) => (
                  <>
                    <div key={candidateIndex}>
                      <Pie
                        //@ts-ignore
                        options={option}
                        data={{
                          labels: Array.from(
                            { length: items.candidates[0].datasets.length },
                            (_, i) => `Group ${i + 1}`
                          ),
                          datasets: [
                            {
                              data: candidate.datasets,
                              backgroundColor: [
                                "rgba(255, 186, 73, 1)",
                                "rgba(204, 219, 220, 1)",
                                "rgba(0, 18, 47, 1)",
                                "rgba(166, 61, 64, 1)",
                              ],
                              borderColor: [
                                "rgba(255, 186, 73, 1)",
                                "rgba(204, 219, 220, 1)",
                                "rgba(0, 18, 47, 1)",
                                "rgba(166, 61, 64, 1)",
                              ],
                              borderWidth: 1,
                            },
                          ],
                        }}
                        /** @ts-ignore */
                        plugins={[ChartDataLabels]}
                      />
                      <div className="flex justify-center py-10 text-xl font-semibold">
                        {candidate.name}
                      </div>
                    </div>
                  </>
                ))}
                <div>
                  <div className="flex flex-col gap-3 mt-5">
                    {Array.from(
                      { length: items.candidates[0].datasets.length },
                      (_, i) => `Group ${i + 1}`
                    ).map((item, i) => (
                      <div key={i} className="flex items-center">
                        <div
                          className="w-4 h-4 mr-2"
                          style={{
                            backgroundColor: backgroundColors[i],
                          }}
                        ></div>

                        <div>{item}</div>
                      </div>
                    ))}
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

export default IndividualNumberSubGroup;
