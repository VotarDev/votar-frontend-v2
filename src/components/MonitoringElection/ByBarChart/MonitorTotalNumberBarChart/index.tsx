import React, { useState, useEffect } from "react";
import { Chart } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import Cookies from "universal-cookie";
import setAuthToken from "@/utils/setAuthToken";
import { monitorBarChart } from "@/utils/api";
import { Skeleton } from "@/src/components/ui/skeleton";
import PositionCard from "../../PositionCard";

Chart.register(CategoryScale);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  maxBarThickness: 100,
  scales: {
    x: { grid: { display: false } },
    y: {
      beginAtZero: true,
      ticks: { precision: 0 },
      grid: { color: "rgba(15, 23, 42, 0.06)" },
      title: { display: true, text: "No of Votes" },
    },
  },
  plugins: { legend: { display: false } },
};

/** Total votes cast in the election, as a single bar. */
const MonitorTotalNumberBarChart = ({ electionId }: { electionId: string }) => {
  const [isFetchBarData, setIsFetchBarData] = useState(false);
  const [barData, setBarData] = useState<any>(null);
  const [totalParticipants, setTotalParticipants] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const monitorElectionTotals = async () => {
      setIsFetchBarData(true);
      // Use the signed-in token when there is one; never clear the header.
      const token = new Cookies().get("user-token");
      if (token) setAuthToken(token);
      try {
        const { data } = await monitorBarChart(electionId);
        // The first two entries are the overall voter and participant counts.
        const [, { totalParticipants: participants }] = data.data;
        if (data.data) {
          setTotalParticipants(participants);
          setBarData({
            datasets: [
              {
                label: "No of Votes",
                data: { "Total Votes": participants },
                backgroundColor: "#015CE9",
                borderColor: "#015CE9",
                borderRadius: 6,
              },
            ],
          });
        }
      } catch (e: any) {
        console.log(e);
      } finally {
        setIsFetchBarData(false);
      }
    };
    monitorElectionTotals();
  }, []);

  if (isFetchBarData) return <Skeleton className="h-80 w-full rounded-xl" />;

  return (
    <PositionCard
      title="Total votes"
      meta={
        totalParticipants !== null && (
          <span>
            <span className="font-semibold text-foreground">
              {totalParticipants.toLocaleString()}
            </span>{" "}
            votes cast
          </span>
        )
      }
    >
      <div className="relative h-72 w-full lg:h-96">
        {barData && <Bar data={barData} options={options} />}
      </div>
    </PositionCard>
  );
};

export default MonitorTotalNumberBarChart;
