import React, { useState, useEffect } from "react";
import { Chart } from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
Chart.register(CategoryScale);
import ChartDataLabels from "chartjs-plugin-datalabels";
import { monitorSubgroup } from "@/utils/api";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { sub } from "date-fns";
import { set } from "lodash";
import { CircularProgress } from "@mui/material";
import { tr } from "date-fns/locale";

const TotalNumberSubGroup = ({ electionId }: { electionId: string }) => {
  const [subGroup, setSubGroup] = useState<any>(null);
  const [isFetchSubGroup, setIsFetchSubGroup] = useState(false);
  const medias = ["Media", "Engineering", "Logistics", "Engineering", "Media"];
  const mediaCounts = subGroup?.reduce((acc: any, media: any) => {
    acc[media] = (acc[media] || 0) + 1;
    return acc;
  }, {});

  // Step 2: Extract counts, maintaining duplicates

  const countsArray = mediaCounts ? Object.values(mediaCounts) : [];
  const uniqueLabels = Array.from(new Set(subGroup));

  const predefinedColors: string[] = [
    "rgba(255, 186, 73, 1)",
    "rgba(204, 219, 220, 1)",
    "rgba(0, 18, 47, 1)",
    "rgba(166, 61, 64, 1)",
  ];

  type RgbaArray = [number, number, number, number];

  function rgbaToRgbArray(rgba: string): RgbaArray {
    const rgbaArray = rgba.slice(5, -1).split(", ").map(Number);
    return [
      rgbaArray[0],
      rgbaArray[1],
      rgbaArray[2],
      rgbaArray[3],
    ] as RgbaArray;
  }

  function generateShade([r, g, b, a]: RgbaArray): string {
    const variation = 30;
    const randomInt = (base: number): number =>
      Math.max(
        0,
        Math.min(
          255,
          base + Math.floor(Math.random() * (variation * 2 + 1)) - variation
        )
      );
    return `rgba(${randomInt(r)}, ${randomInt(g)}, ${randomInt(b)}, ${a})`;
  }

  function generateShadesOfColors(colors: string[], length: number): string[] {
    const shades = new Set<string>();
    const rgbaColors = colors.map(rgbaToRgbArray);

    while (shades.size < length) {
      const baseColor = rgbaColors[shades.size % rgbaColors.length];
      shades.add(generateShade(baseColor));
    }

    return Array.from(shades);
  }

  console.log(uniqueLabels); // [2, 2, 1]
  const users = useCurrentUser();
  const user = useUser();
  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;
  const data = {
    labels: uniqueLabels,
    datasets: [
      {
        label: "No of Votes",
        data: countsArray,
        // add colors to the chart according to the length of uniqueLabels

        backgroundColor: generateShadesOfColors(
          predefinedColors,
          uniqueLabels.length
        ),

        borderWidth: 1,
      },
    ],
  };

  const option = {
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
        const { data } = await monitorSubgroup(electionId);
        if (data.data) {
          console.log(data.data);
          setSubGroup(data.data[0].subGroups);
          setIsFetchSubGroup(false);
        }
      } catch (e: any) {
        console.log(e);
        setIsFetchSubGroup(false);
      }
    };
    monitorElectionBySubgroup();
  }, []);

  if (isFetchSubGroup)
    return (
      <div className="text-center">
        <CircularProgress size={30} style={{ color: "#015CE9" }} />
      </div>
    );

  return (
    <div className="mb-20 lg:w-[1200px] mx-auto w-full flex flex-row bg-slate-50 px-10 p-[50px] border-l-4 border-l-[#015CE9] justify-center">
      <div className="w-[637px]">
        {/* @ts-ignore */}
        <Pie data={data} options={option} plugins={[ChartDataLabels]} />
      </div>
    </div>
  );
};

export default TotalNumberSubGroup;
