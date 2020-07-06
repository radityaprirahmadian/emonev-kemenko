import React, { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"

import Spinner from "../Spinner/Spinner"

export default function StatistikMonev(props) {
  useEffect(() => {
    setPeriode(props.periode)
    setInstansi(props.instansi)
    return () => {
      setData(null)
      setStatistik(null)
      setPeriode(null)
      setInstansi(null)
    }
  }, [])

  const [statistik, setStatistik] = useState(null)
  const [data, setData] = useState(null)
  const [periode, setPeriode] = useState(null)
  const [instansi, setInstansi] = useState(null)

  useEffect(() => {
    if (props.periode && props.instansi) {
      setPeriode(props.periode)
      setInstansi(props.instansi)
    }
  }, [props])

  useEffect(() => {
    setStatistik(null)
    setData(null)
    const endpoint = `https://api.simonev.revolusimental.go.id/api/v1/statistik/monev?periode=${periode || ''}&select=${instansi || ''}` 
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        setStatistik(data.statistik)
      })
  }, [periode && instansi])

  useEffect(() => {
    if (statistik && instansi) {
      let chartDatasets = []
      let chartLabel = []

      statistik.forEach(stat => {
        let chartData = Object.values(stat.data)
        chartLabel = [...chartLabel, ...Object.keys(stat.data)]
        chartDatasets.push({
          label: ``,
          borderWidth: 3,
          borderColor: props.color || "#E76975",
          fill: false,
          pointBackgroundColor: "#ffffff",
          pointHoverBackgroundColor: props.color || "#E76975",
          pointHitRadius: 20,
          pointBorderWidth: 3,
          pointRadius: 5,
          lineTension: 0,
          data: chartData
        })
      })

      chartLabel = [...new Set(chartLabel)]

      let chart = {
        labels: chartLabel,
        datasets: chartDatasets
      }

      setData(chart)
    } else setData({ labels: [], datasets: [] })
  }, [statistik])

  const chartOptions = {
    defaultFontStyle: "bold",
    defaultFontSize: 2,
    tooltips: {
      yAlign: "bottom",
      xAlign: "center",
      caretSize: 7,
      backgroundColor: props.color || "#E76975",
      displayColors: false,
      bodyAlign: "center",
      xPadding: 10,
      yPadding: 10,
      callbacks: {
        label: (tooltipItem, data) => {
          let label = data.datasets[tooltipItem.datasetIndex].label || ""
          label += Math.round(tooltipItem.yLabel * 100) / 100
          return label
        },
        title: () => ""
      }
    },
    legend: {
      display: false
    },
    layout: {
      padding: 50
    },
    scales: {
      yAxes: [
        {
          ticks: {
            fontColor: "#000000",
            padding: 5,
            min: 0,
            max: 100,
            callback: value => value + '%'
          },
          gridLines: {
            color: "#CCCCCC",
            borderDash: [8, 4]
          }
        }
      ],
      xAxes: [
        {
          gridLines: {
            drawOnChartArea: false
          },
          ticks: {
            padding: 5,
            fontStyle: "bold",
            fontColor: "#000000"
          }
        }
      ]
    }
  }

  return (
    <div className="chart d-flex justify-content-center align-items-center" style={{height:'410px' , maxWidth: '100%'
    }}>
      {statistik && data ? (
        <Line data={data} options={chartOptions} />
      ) : (
          <Spinner color={props.color || props.color || "#E76975"} />
        )}
    </div>
  )
}
