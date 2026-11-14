import React, { useState, useEffect } from "react";
import { Chart } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import Cookies from "universal-cookie";
import { generateUniqueColors } from "@/utils/util";
import { monitorInidividualNumber } from "@/utils/api";
import setAuthToken from "@/utils/setAuthToken";
import { Skeleton } from "@/src/components/ui/skeleton";
import PositionCard, { accentFor } from "../../PositionCard";

Chart.register(CategoryScale);

const PREDEFINED_COLORS = [
  "#00f",
  "#f00",
  "#008000",
  "#93241F",
  "#b138b3",
  "#406b83",
];

const option = {
  responsive: true,
  maintainAspectRatio: false,
  maxBarThickness: 50,
  plugins: {
    // Below the chart so it fits on phones.
    legend: {
      display: true,
      position: "bottom" as const,
      labels: { boxWidth: 14, padding: 14, font: { size: 13 } },
    },
  },
  scales: {
    x: { grid: { display: false }, ticks: { display: false } },
    y: {
      beginAtZero: true,
      ticks: { precision: 0 },
      grid: { color: "rgba(15, 23, 42, 0.06)" },
    },
  },
};

/** Votes for each candidate as a bar chart, one card per position. */
const MonitorIndividualNumberChart = ({
  electionId,
}: {
  electionId: string;
}) => {
  const [canidates, setCanidates] = useState<any>(null);
  const [isFetchBarData, setIsFetchBarData] = useState(false);

  useEffect(() => {
    const monitorIndividualNumberBarChart = async () => {
      setIsFetchBarData(true);
      // Use the signed-in token when there is one; never clear the header.
      const token = new Cookies().get("user-token");
      if (token) setAuthToken(token);
      try {
        const { data } = await monitorInidividualNumber(electionId);
        if (data.data) {
          const transformedData = data.data.map(
            ([abstainedData, candidatesData]: any) => {
              const datasets = candidatesData.map((candidate: any) => ({
                x: candidate.candidateName,
                y: candidate.numberOfVotes,
              }));
              datasets.push({ x: "Abstained", y: abstainedData.abstain });
              return {
                position: candidatesData[0].position,
                abstained: abstainedData.abstain,
                datasets,
                candidates: candidatesData,
              };
            },
          );
          setCanidates(transformedData);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsFetchBarData(false);
      }
    };
    monitorIndividualNumberBarChart();
  }, [electionId]);

  if (isFetchBarData) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {canidates?.map((position: any, index: number) => {
        const borderColors = generateUniqueColors(
          position.datasets.length,
          PREDEFINED_COLORS,
        );
        // One dataset per bar so each candidate gets its own legend entry;
        // abstentions are black, as before.
        const chartData = {
          labels: position.datasets.map((dataset: any) => dataset.x),
          datasets: position.datasets.map((dataset: any, i: number) => {
            const isAbstained = dataset.x === "Abstained";
            return {
              label: dataset.x,
              data: [{ x: dataset.x, y: dataset.y }],
              borderColor: isAbstained ? "#000000" : borderColors[i],
              backgroundColor: isAbstained ? "#000000" : borderColors[i],
              borderWidth: 2,
              borderRadius: 4,
            };
          }),
        };

        return (
          <PositionCard
            key={index}
            title={position.position}
            accent={accentFor(index)}
          >
            <div className="relative h-80 w-full lg:h-[420px]">
              <Bar data={chartData} options={option} />
            </div>
          </PositionCard>
        );
      })}
    </div>
  );
};

export default MonitorIndividualNumberChart;
