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

const MonitorSubGroupTotalNumbers = ({
  electionId,
}: {
  electionId: string;
}) => {
  const [subGroup, setSubGroup] = useState<any>(null);
  const [isFetchSubGroup, setIsFetchSubGroup] = useState(false);
  const [candidates, setCandidates] = useState<any>(null);

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

  const chartData = candidates
    ? candidates.map((candidate: any) => {
        const subgroupCounts = candidate.subGroups.reduce(
          (acc: any, subgroup: any) => {
            acc[subgroup] = (acc[subgroup] || 0) + 1;
            return acc;
          },
          {}
        );

        const labels = Object.keys(subgroupCounts);
        const data = labels.map((label) => subgroupCounts[label]);
        const backgroundColor = assignColorsToSubgroups(labels);

        return {
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: labels.map((label) => backgroundColor[label]),
              borderColor: labels.map((label) => backgroundColor[label]),
              borderWidth: 1,
            },
          ],
        };
      })
    : null;

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
          setCandidates(data.data);
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

  if (isFetchSubGroup)
    return (
      <div className="text-center">
        <CircularProgress size={30} style={{ color: "#015CE9" }} />
      </div>
    );

  return (
    <div className="mb-20 lg:w-[1200px] mx-auto w-full flex flex-row bg-slate-50 px-10 p-[50px] border-l-4 border-l-[#015CE9] justify-center">
      <div className="w-[637px]">
        {chartData && (
          <Pie
            data={chartData[0]} // @ts-ignore
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
      </div>
    </div>
  );
};

export default MonitorSubGroupTotalNumbers;
