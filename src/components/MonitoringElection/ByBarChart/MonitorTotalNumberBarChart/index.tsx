import React, { useState, useEffect } from "react";
import { Chart } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import setAuthToken from "@/utils/setAuthToken";
import { useCurrentUser, useUser } from "@/utils/hooks";
import { monitorBarChart } from "@/utils/api";
import { CircularProgress } from "@mui/material";
Chart.register(CategoryScale);

const MonitorTotalNumberBarChart = ({ electionId }: { electionId: string }) => {
  const [voteData, setVoteData] = useState([{ x: "Candidates", y: 200 }]);
  const [isFetchBarData, setIsFetchBarData] = useState(false);
  const [barData, setBarData] = useState<any>(null);
  const users = useCurrentUser();
  const user = useUser();
  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;
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
        tension: 1,
      },
    ],
  };

  useEffect(() => {
    const monitorElectionBySubgroup = async () => {
      setIsFetchBarData(true);
      if (users?.data) {
        setAuthToken(users.data.data.cookie);
      } else {
        if (typeof window !== "undefined") {
          const tokenLocal = localStorage.getItem("token");
          setAuthToken(tokenLocal);
        }
      }
      try {
        const { data } = await monitorBarChart(electionId);
        const [{ totalVoters }, { totalParticipant }, ...filteredData] =
          data.data;

        console.log(totalVoters);
        console.log(totalParticipant);
        console.log(filteredData);

        const totalVotes = filteredData.reduce(
          (sum: number, position: any) => sum + position.totalNumberOfVotes,
          0
        );

        console.log(totalVotes);

        const bars = {
          datasets: [
            {
              label: "No of Votes",
              data: {
                "Total Votes": totalParticipant,
              },
              backgroundColor: "#015CE9", // Set to black if abstained > 0
              borderColor: "#015CE9",
              scaleOverride: true,
              scaleSteps: 9,
              scaleStartValue: 0,
              scaleStepWidth: 1,
              tension: 1.0,
            },
          ],
        };

        if (data.data) {
          console.log(data.data);
          setBarData(bars);
          setIsFetchBarData(false);
        }
      } catch (e: any) {
        console.log(e);
        setIsFetchBarData(false);
      }
    };
    monitorElectionBySubgroup();
  }, []);
  // console.log(barData && barData[0].totalVoters);

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
          stepSize: 5,
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

  if (isFetchBarData)
    return (
      <div className="text-center">
        <CircularProgress size={30} style={{ color: "#015CE9" }} />
      </div>
    );
  return (
    <div className="mb-20 max-w-[1200px] mx-auto flex flex-row bg-slate-50 px-10 p-[90px] border-l-4 border-l-[#015CE9]">
      <div className="w-[812px] pb-20 pt-10">
        {barData && <Bar data={barData} options={options} />}
      </div>
    </div>
  );
};

export default MonitorTotalNumberBarChart;
