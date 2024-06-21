import React, { useState, useEffect } from "react";
import { Chart } from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
Chart.register(CategoryScale);
import ChartDataLabels from "chartjs-plugin-datalabels";
import { monitorSubgroup } from "@/utils/api";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";

const TotalNumberSubGroup = ({ electionId }: { electionId: string }) => {
  const users = useCurrentUser();
  const user = useUser();
  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;
  const data = {
    labels: ["Group 1", "Group 2", "Group 3", "Group 4"],
    datasets: [
      {
        label: "No of Votes",
        data: [10, 15, 15, 25],
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
        if (data) {
          console.log(data);
        }
      } catch (e: any) {
        console.log(e);
      }
    };
    monitorElectionBySubgroup();
  }, []);

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
