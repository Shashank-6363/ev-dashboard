import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import Papa from "papaparse";
import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  ArcElement,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const pieData = {
  labels: ["Red", "Blue", "Yellow"],
  datasets: [
    {
      data: [300, 50, 100],
      backgroundColor: ["red", "blue", "yellow"],
    },
  ],
};

const pieConfig = {
  type: "pie",
  data: pieData,
};

new ChartJS(document.getElementById("myPieChart"), pieConfig);

const DATA_URL = "/data/ev_population.csv";
const App = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(DATA_URL);
        const csvData = response.data;

        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const parsedData = result.data;
            generateChartData(parsedData);
            setLoading(false);
          },
        });
      } catch (error) {
        console.error("Error fetching the dataset:", error);
      }
    };

    fetchData();
  }, []);

  const generateChartData = (parsedData) => {
    const manufacturers = {};
    parsedData.forEach((entry) => {
      const manufacturer = entry["Make"];
      manufacturers[manufacturer] = (manufacturers[manufacturer] || 0) + 1;
    });

    setChartData({
      labels: Object.keys(manufacturers),
      datasets: [
        {
          label: "EV Count by Manufacturer",
          data: Object.values(manufacturers),
          backgroundColor: [
            "#36A2EB",
            "#FF6384",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
          ],
        },
      ],
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Electric Vehicle Dashboard</h1>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <h2>EV Population by Manufacturer</h2>
          <Bar data={chartData} />
          <h2>Distribution (Pie Chart)</h2>
          <Pie data={chartData} />
        </>
      )}
    </div>
  );
};

export default App;
