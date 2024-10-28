import React, { useState, useEffect } from "react";
import { Chart } from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
Chart.register(CategoryScale);
import ChartDataLabels from "chartjs-plugin-datalabels";
import { monitorSubgroup } from "@/utils/api";
import { useCurrentUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { CircularProgress } from "@mui/material";
import { ca, tr } from "date-fns/locale";
import leftline from "@/public/assets/images/left-line.svg";
import rightline from "@/public/assets/images/right-line.svg";

const MonitorSubGroupTotalNumbers = ({
  electionId,
}: {
  electionId: string;
}) => {
  const [subGroup, setSubGroup] = useState<any>(null);
  const [isFetchSubGroup, setIsFetchSubGroup] = useState(false);
  const [candidates, setCandidates] = useState<any>(null);
  const [totalAbstain, setTotalAbstain] = useState<any>(null);
  const [candidateData, setCandidateData] = useState<any>(null);

  const getStoredSubgroupColors = () => {
    const storedColors = localStorage.getItem("subgroupColors");
    return storedColors ? JSON.parse(storedColors) : {};
  };

  const storeSubgroupColors = (subgroupColors: any) => {
    localStorage.setItem("subgroupColors", JSON.stringify(subgroupColors));
  };

  const generateRandomColor = () => {
    const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)}, 1)`;
    return randomColor;
  };

  const predefinedColors: string[] = [
    "rgba(255, 186, 73, 1)",
    "rgba(204, 219, 220, 1)",
    "rgba(0, 18, 47, 1)",
    "rgba(166, 61, 64, 1)",
  ];

  const getStoredColors = () => {
    const storedColors = localStorage.getItem("subgroupColors");
    return storedColors ? JSON.parse(storedColors) : {};
  };

  const [subgroupColors, setSubgroupColors] =
    useState<Record<string, string>>(getStoredColors);

  const getRandomColor = (): string => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const assignColorsToSubgroups = (subgroups: string[]) => {
    let subgroupColors = getStoredSubgroupColors();

    subgroups.forEach((subgroup) => {
      if (!subgroupColors[subgroup]) {
        subgroupColors[subgroup] = generateRandomColor();
      }
    });

    storeSubgroupColors(subgroupColors);
    return subgroupColors;
  };

  // const chartData = candidates
  //   ? candidates.map((candidate: any) => {
  //       const subgroupCounts = (candidate.subGroups || []).reduce(
  //         (acc: any, subgroup: any) => {
  //           acc[subgroup] = (acc[subgroup] || 0) + 1;
  //           return acc;
  //         },
  //         {}
  //       );

  //       const labels = Object.keys(subgroupCounts);
  //       const data = labels.map((label) => subgroupCounts[label]);
  //       const backgroundColor = assignColorsToSubgroups(labels);

  //       return {
  //         labels: labels,
  //         datasets: [
  //           {
  //             data: data,
  //             backgroundColor: labels.map((label) => backgroundColor[label]),
  //             borderColor: labels.map((label) => backgroundColor[label]),
  //             borderWidth: 1,
  //           },
  //         ],
  //       };
  //     })
  //   : null;
  const getSubgroupColor = (subgroup: string): string => {
    const lowerCaseSubgroup = subgroup.toLowerCase();
    if (!subgroupColors[lowerCaseSubgroup]) {
      const newColor = getRandomColor();
      const updatedColors = {
        ...subgroupColors,
        [lowerCaseSubgroup]: newColor,
      };
      setSubgroupColors(updatedColors);
      localStorage.setItem("subgroupColors", JSON.stringify(updatedColors));
      return newColor;
    }
    return subgroupColors[lowerCaseSubgroup];
  };

  const calculateChartData = (candidates: any) => {
    // Accumulate subgroup counts across all candidates
    const totalSubgroupCounts = candidates.reduce(
      (acc: any, candidate: any) => {
        candidate.subGroups.forEach((subgroup: any) => {
          acc[subgroup] = (acc[subgroup] || 0) + 1;
        });
        return acc;
      },
      {}
    );

    // Prepare chart data
    const labels = Object.keys(totalSubgroupCounts);
    const data = labels.map((label) => totalSubgroupCounts[label]);
    const backgroundColor = labels.map((label) => getSubgroupColor(label));
    const borderColor = labels.map((label) => getSubgroupColor(label));

    return {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1,
        },
      ],
    };
  };

  // Usage
  const chartData = candidates ? calculateChartData(candidates) : null;

  // if (chartData?.length > 0) {
  //   // Add the abstained value at the chart level
  //   chartData.forEach((chart: any, index: number) => {
  //     if (totalAbstain > 0) {
  //       // Add 'Abstained' label and data with a black color
  //       chart.labels.push("Abstained");
  //       chart.datasets[0].data.push(totalAbstain);
  //       chart.datasets[0].backgroundColor.push("#000000"); // Black color for abstained
  //       chart.datasets[0].borderColor.push("#000000");
  //     }
  //   });
  // }

  const users = useCurrentUser();

  useEffect(() => {
    if (typeof Chart !== "undefined") {
      Chart.register(ChartDataLabels);

      return () => {
        Chart.unregister(ChartDataLabels);
      };
    }
  }, []);

  useEffect(() => {
    const monitorElectionBySubgroup = async () => {
      setIsFetchSubGroup(true);
      if (users?.data) {
        setAuthToken(users.data.data.cookie);
      } else {
        if (typeof window !== "undefined") {
          const tokenLocal = localStorage.getItem("token");
          setAuthToken(tokenLocal);
        }
      }
      try {
        const { data } = await monitorSubgroup(electionId);
        if (data.data) {
          console.log(data.data);
          const [{ totalAbstain }, ...filteredData] = data.data;

          // const transformedData = filteredData.map((candidate: any) => {
          //   const position = candidate.position;
          //   return {
          //     position,
          //     subGroups: [candidate.subGroups],
          //   };
          // });

          console.log(filteredData);

          setCandidateData(filteredData);
          console.log(totalAbstain);
          console.log(filteredData);
          console.log(filteredData);
          setCandidates(filteredData);
          setTotalAbstain(totalAbstain);
          setSubGroup(data.data[0].subGroups);
          setIsFetchSubGroup(false);
        }
      } catch (e: any) {
        console.log(e);
        setIsFetchSubGroup(false);
      }
    };
    monitorElectionBySubgroup();
  }, [electionId]);

  console.log(chartData);

  if (isFetchSubGroup)
    return (
      <div className="text-center">
        <CircularProgress size={30} style={{ color: "#015CE9" }} />
      </div>
    );

  return (
    <div className="mb-20 lg:w-[1200px] mx-auto w-full bg-slate-50 flex flex-col gap-20 pb-20 justify-center">
      <div className="w-[637px] mx-auto">
        {chartData && (
          <Pie
            data={chartData} // @ts-ignore
            options={{
              plugins: {
                datalabels: {
                  color: "#ffffff",
                },
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
                    },
                  },
                },
              },
            }} // @ts-ignore
            plugins={[ChartDataLabels]}
          />
        )}
      </div>
      {/* {candidateData?.map((candidate: any, index: number) => {
        return (
          <div key={index} className=" px-10 ">
            <div className="text-center pt-20 text-slate-900 lg:text-[28px] text-base font-semibold flex items-center justify-center gap-2 uppercase">
              <div>
                <img src={leftline.src} alt="line" className="w-14 lg:w-full" />
              </div>
              <div>{candidate.position}</div>
              <div>
                <img
                  src={rightline.src}
                  alt="line"
                  className="w-14 lg:w-full"
                />
              </div>
            </div>
            <div className="w-[600px] mx-auto">
              <Pie
                data={chartData[index]} // @ts-ignore
                options={{
                  plugins: {
                    datalabels: {
                      color: "#ffffff",
                    },
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
                        },
                      },
                    },
                  },
                }}
                // @ts-ignore
                plugins={[ChartDataLabels]}
              />
            </div>
          </div>
        );
      })} */}

      {/* <div className="w-[637px]">
        {chartData && (
          <Pie
            data={chartData[1]} // @ts-ignore
            options={{
              plugins: {
                datalabels: {
                  color: "#ffffff",
                },
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
                    },
                  },
                },
              },
            }}
            // @ts-ignore
            plugins={[ChartDataLabels]}
          />
        )}
      </div> */}
    </div>
  );
};

export default MonitorSubGroupTotalNumbers;
