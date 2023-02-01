import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

import Spinner from '../Spinner/Spinner';

export default function StatistikGNRM(props) {
  const [statistik, setStatistik] = useState(null);
  const [tahun, setTahun] = useState(props.filter.tahun);
  const [periode, setPeriode] = useState(props.filter.periode);
  const [instansi, setInstansi] = useState(null);

  useEffect(() => {
    setTahun(props.filter.tahun);
    setPeriode(props.filter.periode);
    setInstansi(props.instansi);
    return () => {
      setStatistik(null);
      setData(null);
      setTahun(null);
      setPeriode(null);
    };
  }, []);

  useEffect(() => {
    setTahun(props.filter.tahun);
    setInstansi(props.instansi);
    if (props.filter.periode) {
      setPeriode(props.filter.periode);
    }
  }, [props]);

  // useEffect(() => {
  //   setData(null);
  //   setStatistik(null);
  //   const endpoint = `http://api.simonev.revolusimental.go.id:8882/api/v1/statistik/gnrm?instansi=${
  //     instansi || ''
  //   }&tahun=${tahun}&periode=${periode || ''}&waktu=${waktu || ''}`;
  //   fetch(endpoint)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setStatistik(data.statistik);
  //     });
  // }, [instansi, tahun, periode && waktu]);

  useEffect(() => {
    setData(null);
    setStatistik(null);
    const endpoint = `http://api.simonev.revolusimental.go.id:8882/api/v2/charts/gerakan/count?&tahun=${tahun}&periode=${
      periode || 'Jan-Mei'
    }`;
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        setStatistik(data.gerakan);
      });
  }, [tahun, periode]);

  useEffect(() => {
    if (statistik) {
      let chartData = Object.values(statistik);
      let chartLabel = [];

      Object.keys(statistik).forEach((label) => {
        const splitLabel = label.split(' ');
        chartLabel.push(splitLabel);
      });

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
            max: 100,
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
