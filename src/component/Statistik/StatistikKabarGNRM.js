import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Spinner from '../Spinner/Spinner';

export default function StatistikKabarGNRM(props) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const endpoint = `https://api.simonev.revolusimental.go.id/api/v2/charts/gnrm/count`;
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        const chartData = data.gnrm.map((data) => data.provinsi);
        const chartDataKab = data.gnrm.map((data) => data.kabkota);
        const chartLabel = data.gnrm.map((data) => data.tahun);

        const chart = {
          labels: chartLabel,
          datasets: [
            {
              label: 'provinsi',
              borderWidth: 0,
              barThickness: 30,
              backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 300, 0, 450);
                gradient.addColorStop(0, 'rgba(66,79,200,1)');
                gradient.addColorStop(1, 'rgba(131,128,234,0.9)');
                return gradient;
              },
              borderColor: '#FDE47F',
              data: chartData,
            },
            {
              label: 'kabupaten/kota',
              borderWidth: 0,
              barThickness: 30,
              backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 300, 0, 450);
                gradient.addColorStop(0, 'rgba(253,228,127,1)');
                gradient.addColorStop(1, 'rgba(243,224,145,0.7)');
                return gradient;
              },
              borderColor: '#E76975',
              data: chartDataKab,
            },
          ],
        };

        setData(chart);
      });
  }, []);

  const chartOptions = {
    defaultFontStyle: 'bold',
    // defaultFontSize: 2,
    aspectRatio: props.aspect || 2,
    legend: {
      display: false,
    },
    type: 'bar',
    plugins: {
      datalabels: {
        display: true,
        color: 'black',
        formatter: Math.round,
        anchor: 'end',
        offset: -35,
        align: 'start',
      },
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
      backgroundColor: '#E76975',
      displayColors: false,
      bodyAlign: 'center',
      xPadding: 10,
      yPadding: 10,
      callbacks: {
        label: (tooltipItem, data) => {
          let label = '';
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
      style={{ height: props.height || '56vh', width: '100%', paddingTop: 50, marginBottom: 15 }}
    >
      {data ? (
        <Bar
          data={data}
          options={chartOptions}
          plugins={[ChartDataLabels]}
          height={null}
          width={null}
        />
      ) : (
        <Spinner color={props.color || '#E76975'} />
      )}
    </div>
  );
}
