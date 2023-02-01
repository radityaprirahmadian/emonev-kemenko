import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

import Spinner from '../Spinner/Spinner';

export default function StatistikKabarGNRM(props) {
  const [statistik, setStatistik] = useState([]);

  useEffect(() => {
    setData(null);
    setStatistik(null);
    const endpoint = `http://api.simonev.revolusimental.go.id:8882/api/v2/charts/gnrm/count`;
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        setStatistik(data.gnrm);
      });
  }, []);

  useEffect(() => {
    if (statistik) {
      let chartData = statistik.map((data) => data.provinsi);
      let chartLabel = statistik.map((data) => data.tahun);

      let chart = {
        labels: chartLabel,
        datasets: [
          {
            label: '',
            borderWidth: 0,
            barThickness: 15,
            backgroundColor: props.color || '#E76975',
            borderColor: props.color || '#E76975',
            data: chartData,
          },
        ],
      };

      setData(chart);
    }
  }, [statistik]);

  const [data, setData] = useState(null);

  const chartOptions = {
    defaultFontStyle: 'bold',
    // defaultFontSize: 2,
    aspectRatio: props.aspect || 2,
    legend: {
      display: false,
    },
    layout: {
      padding: 50,
    },
    scales: {
      yAxes: [
        {
          ticks: {
            fontColor: '#000000',
            min: 0,
            max: 500,
            callback: (value) => {
              if (value % 1 === 0) {
                return value;
              }
            },
          },
          gridLines: {
            color: '#CCCCCC',
            borderDash: [8, 4],
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            drawOnChartArea: false,
          },
          ticks: {
            padding: 5,
            fontSize: 10,
            fontStyle: 'bold',
            fontColor: '#000000',
          },
        },
      ],
    },
    tooltips: {
      yAlign: 'bottom',
      xAlign: 'center',
      caretSize: 7,
      backgroundColor: props.color || '#E76975',
      displayColors: false,
      bodyAlign: 'center',
      xPadding: 10,
      yPadding: 10,
      callbacks: {
        label: (tooltipItem, data) => {
          let label = data.datasets[tooltipItem.datasetIndex].label || '';
          label += Math.round(tooltipItem.yLabel * 100) / 100;
          return label;
        },
        title: () => '',
      },
    },
  };

  return (
    <div
      className="chart d-flex justify-content-center align-items-center"
      style={{ height: props.height || '54vh', width: '100%' }}
    >
      {statistik && data ? (
        <Bar data={data} options={chartOptions} height={null} width={null} />
      ) : (
        <Spinner color={props.color || '#E76975'} />
      )}
    </div>
  );
}
