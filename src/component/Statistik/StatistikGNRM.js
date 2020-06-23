import React, { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"

import Spinner from "../Spinner/Spinner"

export default function StatistikGNRM(props) {
  const [statistik, setStatistik] = useState(null)
  const [tahun, setTahun] = useState(null)
  const [periode, setPeriode] = useState(null)
  const [waktu, setWaktu] = useState(null)

  useEffect(() => {
    setTahun(props.tahun)
      setPeriode(props.periode)
      setWaktu(props.waktu)
    return () => {
      setStatistik(null)
      setData(null)
      setTahun(null)
      setPeriode(null)
      setWaktu(null)
    }
  }, [])
  
  useEffect(() => {
    console.log('statistikk', props)
    setTahun(props.tahun)
    if (props.periode && props.waktu) {
      setPeriode(props.periode)
      setWaktu(props.waktu)
    }
  }, [props])

  useEffect(() => {
    setData(null)
    setStatistik(null)
    const endpoint =  `http://localhost:5000/api/v1/statistik/gnrm?tahun=${tahun}&periode=${periode || ''}&waktu=${waktu || ''}`
    console.log('statistikk', endpoint)
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        setStatistik(data.statistik)
      })
  }, [tahun, periode && waktu])


  useEffect(() => {
    if (statistik) {
      let chartData = Object.values(statistik)

      let chartLabel = []

      Object.keys(statistik).forEach(label => {
        const splitLabel = label.split(' ')
        chartLabel.push(splitLabel)
      })

      let chart = {
        labels: chartLabel,
        datasets: [
          {
            label: "",
            borderWidth: 0,
            barThickness: 5,
            backgroundColor: props.color || "#E76975",
            borderColor: props.color || "#E76975",
            data: chartData
          }
        ]
      }

      setData(chart)
    }

  }, [statistik])

  const [data, setData] = useState(null)

  const chartOptions = {
    defaultFontStyle: "bold",
    defaultFontSize: 2,
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
            min: 0,
            callback: value => {
              if (value % 1 === 0) {
                return value
              }
            }
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
            fontSize: 12,
            fontStyle: "bold",
            fontColor: "#000000"
          }
        }
      ]
    },
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
  }

  return (
    <div className="chart d-flex justify-content-center align-items-center" style={{
    }}>
      {statistik && data ? (
        <Bar data={data} options={chartOptions} />
      ) : (
          <Spinner color={props.color || "#E76975"} />
        )}
    </div>
  )
}
