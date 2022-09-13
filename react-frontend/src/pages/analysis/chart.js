import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
// import faker from 'faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const dataSet = { 'January' : 12, 'February': 23, 'March' :45, 'April':6, 'May':44, 'June':53, 'July':44}
const dataSet2 = { 'January' : 4, 'February': 67, 'March' :34, 'April':16, 'May':54, 'June':34, 'July':23}
const dataSet3 = { 'January' : 43, 'February': 6, 'March' :78, 'April':13, 'May':-6, 'June':9, 'July':123}

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: dataSet,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: dataSet2,
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

export function Chartanalysis() {
  return <Line options={options} data={data} />;
}
