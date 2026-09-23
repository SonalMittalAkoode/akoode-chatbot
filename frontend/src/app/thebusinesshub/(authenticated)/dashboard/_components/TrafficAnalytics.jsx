'use client'

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function TrafficAnalytics() {
  // Static data for traffic analytics - Last 6 months
  const months = ['Dec', 'Jan', 'Feb', 'Mar', 'April', 'May', 'Jun'];
  
  // Static traffic data - Page Views
  const pageViews = [25000, 18000, 23000, 20000, 30000, 25000, 29000];
  
  // Static traffic data - Unique Visitors
  const uniqueVisitors = [20000, 17000, 24000, 21000, 27000, 32000, 34000];

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Page Views",
        data: pageViews,
        borderColor: "rgb(255, 159, 64)",
        backgroundColor: "rgba(255, 159, 64, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Unique Visitors",
        data: uniqueVisitors,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            weight: '500',
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            if (value >= 1000) {
              return (value / 1000).toFixed(0) + 'k';
            }
            return value;
          },
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        ticks: {
          font: {
            size: 11,
          },
        },
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Traffic Analytics</h4>
        <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666', fontStyle: 'italic' }}>Last 6 months</p>
      </div>
      <div style={{ height: '400px', position: 'relative' }}>
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
}

