import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import Papa from "papaparse";
import { Chart as ChartJS } from "chart.js/auto"
const DATA_URL = "/data/ev_population.csv"; // Ensure the CSV file is in the 'public/data' folder.

const App = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(DATA_URL);
        const csvData = response.data;
  
        // Define parseCSV inside useEffect
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
  }, []); // No dependencies needed now
  

  // const parseCSV = (csv) => {
  //   Papa.parse(csv, {
  //     header: true,
  //     skipEmptyLines: true,
  //     complete: (result) => {
  //       const parsedData = result.data;
  //       generateChartData(parsedData);
  //       setLoading(false);
  //     },
  //   });
  // };

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
          backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0", "#9966FF"],
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
