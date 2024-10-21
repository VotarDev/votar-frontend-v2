import React, { useState, useEffect } from "react";
import { generateUniqueColors, votingCandidateBarGraph } from "@/utils/util";
import { Chart, ChartConfiguration } from "chart.js/auto";
import { Line, Bar } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
Chart.register(CategoryScale);
import { de, el, tr } from "date-fns/locale";
import "chartjs-adapter-date-fns";
import leftline from "@/public/assets/images/left-line.svg";
import rightline from "@/public/assets/images/right-line.svg";
import { monitorInidividualNumber } from "@/utils/api";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { CircularProgress } from "@mui/material";

const MonitorIndividualNumberChart = ({
  electionId,
}: {
  electionId: string;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [canidates, setCanidates] = useState<any>(null);
  const [isFetchBarData, setIsFetchBarData] = useState(false);
  const randomColors = [
    "#b138b3",
    "#00ff00",
    "#015CE9",
    "#E46F24",
    "#93241F",
    "#406b83",
  ];
  const users = useCurrentUser();
  const user = useUser();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const monitorIndividualNumberBarChart = async () => {
      setIsFetchBarData(true);

      // Set auth token based on user data or local storage
      if (users?.data) {
        setAuthToken(users.data.data.cookie);
      } else if (typeof window !== "undefined") {
        const tokenLocal = localStorage.getItem("token");
        setAuthToken(tokenLocal);
      }

      try {
        const { data } = await monitorInidividualNumber(electionId);
        console.log(data.data);
        if (data.data) {
          const transformedData = data.data.map(
            ([abstainedData, candidatesData]: any) => {
              const position = candidatesData[0].position;

              const datasets = candidatesData.map((candidate: any) => ({
                x: candidate.candidateName,
                y: candidate.numberOfVotes,
              }));

              datasets.push({
                x: "Abstained",
                y: abstainedData.abstain,
              });

              return {
                position,
                abstained: abstainedData.abstain,
                datasets,
                candidates: candidatesData,
              };
            }
          );

          console.log(transformedData);
          setCanidates(transformedData);
          setIsFetchBarData(false);
        }
      } catch (error) {
        setIsFetchBarData(false);
        console.log(error);
      }
    };

    monitorIndividualNumberBarChart();
  }, [electionId]);
  console.log(canidates);

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
        beginAtZero: true,

        ticks: {
          min: 0,
          max: 700,
          stepSize: 1,
          suggestedMin: 0,
          suggestedMax: 700,
        },
        grid: {
          display: false,
          borderColor: "#000",
        },
      },
    },
  };

  if (isFetchBarData)
    return (
      <div className="text-center">
        <CircularProgress size={30} style={{ color: "#015CE9" }} />
      </div>
    );

  return (
    <>
      <div className="max-w-[1200px] mx-auto flex flex-col gap-20 mb-20">
        {canidates?.map((position: any, index: number) => {
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
            position.datasets.length,
            predefinedColors
          );
          const dat = () => {
            const datasets = position.datasets.map(
              (dataset: any, i: number) => {
                const isAbstained = dataset.x === "Abstained";

                return {
                  label: dataset.x,
                  data: [{ x: dataset.x, y: dataset.y }],
                  borderColor: isAbstained ? "#000000" : borderColors[i],
                  backgroundColor: isAbstained ? "#000000" : borderColors[i],
                  borderWidth: 2,
                };
              }
            );

            const labels = position.datasets.map((dataset: any) => dataset.x);
            // return {
            //   labels: position.candidates.map((col: any) => col.candidateName),
            //   datasets: position.candidates.map((col: any, i: number) => {
            //     return {
            //       label: col.candidateName,
            //       data: position.datasets,
            //       borderColor:
            //         position.abstained > 0 ? "#000000" : borderColors[i],
            //       backgroundColor:
            //         position.abstained > 0 ? "#000000" : borderColors[i],
            //       borderWidth: 2,
            //     };
            //   }),
            // };
            return {
              labels,
              datasets,
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

export default MonitorIndividualNumberChart;
