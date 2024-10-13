import React, { useState, useEffect } from "react";
import { Chart } from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
Chart.register(CategoryScale);
import "chartjs-adapter-date-fns";
import leftline from "@/public/assets/images/left-line.svg";
import rightline from "@/public/assets/images/right-line.svg";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useCurrentUser, useUser } from "@/utils/hooks";
import { monitorIndividualSubgroup } from "@/utils/api";
import setAuthToken from "@/utils/setAuthToken";
import { CircularProgress } from "@mui/material";

const CustomLegend = ({ subgroups, candidateSubgroup }: any) => {
  const subgroupCounts = candidateSubgroup.reduce(
    (acc: any, candidate: any) => {
      const subgroup = candidate.subgroups;
      if (subgroup && Array.isArray(subgroup)) {
        subgroup.forEach((sub: any) => {
          acc[sub] = (acc[sub] || 0) + 1;
        });
      }
      return acc;
    },
    {}
  );
  console.log(subgroupCounts);

  return (
    <div className="flex flex-col gap-2">
      {Object.keys(subgroupCounts).map((key, index) => (
        <div
          key={index}
          className="legend-item"
          style={{ display: "flex", alignItems: "center" }}
        >
          <span
            className="legend-color"
            style={{
              display: "inline-block",
              width: "20px",
              height: "20px",
              backgroundColor: subgroups[key.toLowerCase()],
              marginRight: "10px",
            }}
          ></span>
          <span className="legend-label text-slate-600">{key}</span>
        </div>
      ))}
    </div>
  );
};

const MonitorSubGroupIndividualNumbers = ({
  electionId,
}: {
  electionId: string;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isFetchSubGroup, setIsFetchSubGroup] = useState(false);
  const [candidates, setCandidates] = useState<any>(null);
  const [subGroup, setSubGroup] = useState<any>(null);

  const mediaCounts = subGroup?.reduce((acc: any, media: any) => {
    acc[media] = (acc[media] || 0) + 1;
    return acc;
  }, {});

  const countsArray = mediaCounts ? Object.values(mediaCounts) : [];
  const uniqueLabels = Array.from(new Set(subGroup));

  console.log(uniqueLabels);
  const users = useCurrentUser();
  const user = useUser();

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

  // Object to hold the consistent colors for each subgroup
  // const subgroupColors: Record<string, string> = {};

  // Function to get or assign a color for a subgroup
  const getSubgroupColor = (subgroup: string): string => {
    const lowerCaseSubgroup = subgroup.toLowerCase();
    if (!subgroupColors[lowerCaseSubgroup]) {
      // Assign a random color if the subgroup doesn't have one yet
      const newColor = getRandomColor();
      const updatedColors = {
        ...subgroupColors,
        [lowerCaseSubgroup]: newColor,
      };
      setSubgroupColors(updatedColors);
      localStorage.setItem("subgroupColors", JSON.stringify(updatedColors)); // Save to localStorage
      return newColor;
    }
    return subgroupColors[lowerCaseSubgroup];
  };

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
        const { data } = await monitorIndividualSubgroup(electionId);
        if (data.data) {
          console.log(data.data);

          // Flatten the nested arrays into a single array of candidates
          const flattenedData = data.data.flat();

          // Group candidates by their position
          const groupedCandidates = flattenedData.reduce(
            (acc: any, candidate: any) => {
              const { position } = candidate;
              if (!acc[position]) {
                acc[position] = [];
              }
              acc[position].push(candidate);
              return acc;
            },
            {}
          );

          // Convert the grouped candidates object into an array
          const groupedCandidatesArray = Object.entries(groupedCandidates).map(
            ([position, candidates]) => ({
              position,
              candidates,
            })
          );

          console.log(groupedCandidatesArray);
          setSubGroup(data.data[0].subgroups); // Assuming subgroups are set correctly from the first data group
          setCandidates(groupedCandidatesArray); // Setting grouped candidates by position

          setIsFetchSubGroup(false);
        }
      } catch (e) {
        console.log(e);
        setIsFetchSubGroup(false);
      }
    };

    monitorElectionBySubgroup();
  }, [electionId]);

  const chartData =
    candidates?.length > 0
      ? candidates.map(({ candidates: candidateList }: any) =>
          candidateList && candidateList.length > 0
            ? candidateList.map((candidate: any) => {
                // Calculate the counts of each subgroup
                const subgroupCounts = candidate.subgroups.reduce(
                  (acc: Record<string, number>, subgroup: string) => {
                    acc[subgroup] = (acc[subgroup] || 0) + 1;
                    return acc;
                  },
                  {}
                );

                // Prepare the data for the chart
                const labels = Object.keys(subgroupCounts);
                const data = labels.map((label) => subgroupCounts[label]);
                const backgroundColor = labels.map((label) =>
                  getSubgroupColor(label)
                );
                const borderColor = labels.map((label) =>
                  getSubgroupColor(label)
                );

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
              })
            : []
        )
      : [];

  console.log(chartData);

  if (isFetchSubGroup)
    return (
      <div className="text-center">
        <CircularProgress size={30} style={{ color: "#015CE9" }} />
      </div>
    );

  return (
    <>
      <div className="max-w-[1200px] mx-auto flex flex-col gap-20 pb-20">
        {candidates?.map((items: any, index: any) => {
          const generateRandomColor =
            randomColors[Math.floor(Math.random() * randomColors.length)];

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
                <CustomLegend
                  subgroups={subgroupColors}
                  candidateSubgroup={items.candidates}
                />
                {items.candidates.map((candidate: any, candidateIndex: any) => (
                  <div key={candidateIndex}>
                    <div>
                      {chartData &&
                        chartData.length > index &&
                        chartData[index][candidateIndex] && ( // Ensure indices align correctly
                          <Pie
                            //@ts-ignore
                            options={option}
                            data={chartData[index][candidateIndex]} // Correct index for candidate chart data
                            /** @ts-ignore */
                            plugins={[ChartDataLabels]}
                          />
                        )}
                      <div className="flex justify-center py-10 text-xl font-semibold">
                        {candidate.candidateName}
                      </div>
                    </div>
                  </div>
                ))}
                <div>
                  <div className="flex flex-col gap-3 mt-5">
                    {/* {Array.from(
                        { length: items.candidates[0].datasets.length },
                        (_, i) => `Group ${i + 1}`
                      ).map((item, i) => (
                        <div key={i} className="flex items-center">
                          <div
                            className="w-4 h-4 mr-2"
                            // style={{
                            //   backgroundColor: backgroundColors[i],
                            // }}
                          ></div>
  
                          <div>{item}</div>
                        </div>
                      ))} */}
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

export default MonitorSubGroupIndividualNumbers;
