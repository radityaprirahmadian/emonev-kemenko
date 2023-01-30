import React, { Component, Fragment, useState, useEffect, useContext } from "react"
import ItemsCarousel from "react-items-carousel"
import axios from "axios"
import { AuthContext } from "../../context/Auth/AuthContext"
import "./Home.css"
import ArtikelHome from "../../component/ArtikelHome/ArtikelHome"
import Topbar from "../../component/Topbar/Topbar"
import Footer from "../../component/Footer/Footer"
import background from "../../assets/background.png"
import logo_kemenko from "../../assets/logo_kemenko.png"
import Card from "../../component/Card/Card"
import Gallery from "../../component/Gallery/Gallery"
import { BrowserRouter as Router, Route, Link, NavLink, useLocation } from "react-router-dom"
import exclude from "../../assets/Exclude.png"
import exclude2 from "../../assets/Exclude2.png"
import linkTerkait1 from "../../assets/logo_link_terkait_1.png"
import linkTerkait2 from "../../assets/logo_link_terkait_2.png"
import linkInstansi1 from "../../assets/logo_terkait_1.png"
import linkInstansi2 from "../../assets/logo_terkait_2.png"
import linkInstansi3 from "../../assets/logo_terkait_3.png"
import linkInstansi4 from "../../assets/logo_terkait_4.png"
import linkInstansi5 from "../../assets/logo_terkait_5.png"
import { Bar } from "react-chartjs-2"
import StatistikGNRM from "../../component/Statistik/StatistikGNRM"
import Spinner from "../../component/Spinner/Spinner"

const Home = () => {
    const [loading, setLoading] = useState(false)

    const { loadUser, token } = useContext(AuthContext)
    const [documents, setDocuments] = useState([])

    const getAllDocument = async () => {
        try {
            const res = await axios.get(`http://api.simonev.revolusimental.go.id:8882/api/v1/kabar`)
            setDocuments(res.data.kabar)
        } catch (err) {
            console.log(err)
        }
    }

    const [filterCard, setFilterCard] = useState({
        page: "1",
        nama_instansi: "",
    })

    const [datak, setData] = useState([])
    const [documentCard, setDocumentCard] = useState([])
    const [documentCardLenght, setDocumentCardLength] = useState([])

    const { page, nama_instansi } = filterCard

    const getDocumentCardLength = async () => {
        try {
            const res = await axios.get(
                `http://api.simonev.revolusimental.go.id:8882/api/v1/kabar?instansi=${nama_instansi}`
            )
            setDocumentCardLength(res.data.total)
        } catch (err) {
            console.log(err)
        }
    }

    // const Statistika = async () => {
    //     try {
    //         const res = await axios.get(`http://api.simonev.revolusimental.go.id:8882/api/v1/statistik?select=Kemendagri,Kemenko PMK,Kemenpan RB,Kemenko Maritim,Kemenko Polhukam,Kemenko Perekonomian&type=gnrm`)
    //         console.log(res.data.statistik)
    //     }
    //     catch (err) {
    //         console.log(err)
    //     }
    // }

    const getDocumentCard = async () => {
        setLoading(true)
        try {
            const res = await axios.get(
                `http://api.simonev.revolusimental.go.id:8882/api/v1/kabar?limit=2&page=${page}&instansi=${nama_instansi}`
            )
            setDocumentCard(res.data.kabar)
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }

    const [selected1, setSelected1] = useState(true)
    const [selected2, setSelected2] = useState(true)

    const onChange = (e, index) => {
        setFilterCard({ ...filterCard, [e.target.name]: e.target.value })
        if (index === 1) {
            setSelected1(false)
            setSelected2(true)
        } else {
            setSelected1(true)
            setSelected2(false)
        }
    }
    const { pathname } = useLocation()

    useEffect(() => {
        // Statistika()
        getAllDocument()
        getDocumentCard()
        getDocumentCardLength()
    }, [filterCard, getDocumentCard, getDocumentCardLength])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    const [instansi, setInstansi] = useState([])
    const [instansiDaerah, setInstansiDaerah] = useState([])
    const [instansiLembaga, setLembaga] = useState([])
    const [instansiLembagaKementerian, setLembagaKementerian] = useState([])

    useEffect(() => {
        axios
            .get("http://api.simonev.revolusimental.go.id:8882/api/v1/instansi?jenis=Kementerian")
            .then((res) => {
                setInstansi(res.data.instansi)
            })
            .catch((err) => {
                console.log(err)
            })

        axios
            .get("http://api.simonev.revolusimental.go.id:8882/api/v1/instansi?jenis=Lembaga")
            .then((res) => {
                setLembaga(res.data.instansi)
            })
            .catch((err) => {
                console.log(err)
            })

        axios
            .get("http://api.simonev.revolusimental.go.id:8882/api/v1/instansi?jenis=Pemerintah Daerah")
            .then((res) => {
                setInstansiDaerah(res.data.instansi)
            })
            .catch((err) => {
                console.log(err)
            })
        getAllDocument()
    }, [])

    useEffect(() => {
        let lembaga = instansi.concat(instansiLembaga)
        setLembagaKementerian(lembaga)
    }, [instansiLembaga, instansi])

    const [hidden, setHidden] = useState([])

    useEffect(() => {
        if (documents && documents.length < 7) {
            let arr = [true]
            for (let i = 0; i < documents.length - 1; i++) {
                arr.push(false)
            }

            setHidden(arr)
        } else {
            setHidden([true, false, false, false, false, false, false])
        }
    }, [documents])

    useEffect(() => {
        let cleanup = false
        setTimeout(() => {
            if (!cleanup) {
                const change = hidden
                const pop = change.pop()
                change.unshift(pop)
                setHidden([...change])
            }
        }, 5000)
        return () => {
            cleanup = true
        }
    }, [hidden])

    const onClick = (index) => {
        const change = hidden.map((i) => (i = false))
        change[index] = true
        setHidden([...change])
    }

    const getTrueIndex = () => {
        let trueIndex = 0
        hidden.forEach((v, i) => {
            if (v) trueIndex = i
        })
        return trueIndex
    }

    const onPrev = () => {
        const trueIndex = getTrueIndex()

        let change = [...hidden]

        const minIndex = 0
        let maxIndex = ""
        if (documents && documents.length < 7) {
            maxIndex = documents.length - 1
        } else {
            maxIndex = 6
        }

        change[trueIndex >= minIndex ? trueIndex : minIndex] = false
        change[trueIndex > minIndex ? trueIndex - 1 : parseInt(maxIndex)] = true

        setHidden([...change])
    }

    const onNext = () => {
        const trueIndex = getTrueIndex()

        let change = [...hidden]

        const minIndex = 0
        let maxIndex = ""
        if (documents && documents.length < 7) {
            maxIndex = documents.length - 1
        } else {
            maxIndex = 6
        }

        change[trueIndex <= parseInt(maxIndex) ? trueIndex : minIndex] = false
        change[trueIndex < parseInt(maxIndex) ? trueIndex + 1 : minIndex] = true

        setHidden([...change])
    }

    const onNextFilter = (e) => {
        if (page < (documentCardLenght && documentCardLenght / 2)) {
            e.preventDefault()
            const a = parseInt(page)
            return setFilterCard({
                ...filterCard,
                page: JSON.stringify(a + 1),
            })
        } else {
            e.preventDefault()
            return filterCard
        }
    }

    const onPrevFilter = (e) => {
        if (page > 1) {
            e.preventDefault()
            const a = parseInt(page)
            return setFilterCard({
                ...filterCard,
                page: JSON.stringify(a - 1),
            })
        } else {
            e.preventDefault()
            return filterCard
        }
    }

    let tanggal = new Date(Date.now())
    let bulans = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ][tanggal.getMonth()]
    const yearsData = []
    const todaysYear = new Date().getFullYear()
    for (let year = todaysYear; year >= 2020; year--) {
        yearsData.push(year)
    }
    const [tahun, setTahun] = useState(todaysYear)

    const onChangeTahun = (e) => {
        setTahun(e.target.value)
    }

    const [documentLengthArr, setDocumentLengthArr] = useState([])

    useEffect(() => {
        let arr = []
        for (let i = 0; i < documentCardLenght; i++) {
            arr.push(i)
        }
        setDocumentLengthArr(arr)
    }, [documentCardLenght])
    return (
        <Fragment>
            <Topbar kunci={true} />
            <div className="home" style={{ margin: "0" }}>
                <div className="home-section-1" style={documents && documents.length === 0 ? { height: "8vh" } : {}}>
                    {documents && documents.length > 6
                        ? documents.slice(0, 7).map((document, index) => {
                              const i = document.gambar.map(
                                  (infografis) => `http://api.simonev.revolusimental.go.id:8882${infografis.path}`
                              )
                              return (
                                  <Fragment>
                                      <div key={index} className={hidden[index] ? "home-pic" : "d-none"}>
                                          <div className="opacity-8"></div>
                                          <img src={i[0]} className="home-pic-img" />
                                      </div>
                                  </Fragment>
                              )
                          })
                        : documents.slice(0, documents.length).map((document, index) => {
                              const i = document.gambar.map(
                                  (infografis) => `http://api.simonev.revolusimental.go.id:8882${infografis.path}`
                              )
                              return (
                                  <Fragment>
                                      <div key={index} className={hidden[index] ? "home-pic" : "d-none"}>
                                          <div className="opacity-8"></div>
                                          <img src={i[0]} className="home-pic-img" />
                                      </div>
                                  </Fragment>
                              )
                          })}

                    <div className="home-desc">
                        {documents && documents.length > 6
                            ? documents.slice(0, 7).map((document, index) => {
                                  return (
                                      <ArtikelHome
                                          key={index}
                                          document={document}
                                          hidden={hidden}
                                          index={index}
                                          tanggal_dibuat={document.tanggal_dibuat}
                                          judul={document.judul}
                                          instansi={document.instansi.nama_pendek}
                                          _id={document._id}
                                      />
                                      // <ArtikelHome
                                      //     key={index}
                                      //     document={datas}
                                      //     hidden={hidden}
                                      //     index={index}
                                      //     tanggal_dibuat={datas.date}
                                      //     nama_program={datas.title}
                                      //     instansi={datas.nama}
                                      //     gnrm_id={index}  />
                                  )
                              })
                            : documents.slice(0, documents.length).map((document, index) => {
                                  return (
                                      <ArtikelHome
                                          key={index}
                                          document={document}
                                          hidden={hidden}
                                          index={index}
                                          tanggal_dibuat={document.tanggal_dibuat}
                                          judul={document.judul}
                                          instansi={document.instansi.nama_pendek}
                                          _id={document._id}
                                      />
                                      // <ArtikelHome
                                      //     key={index}
                                      //     document={datas}
                                      //     hidden={hidden}
                                      //     index={index}
                                      //     tanggal_dibuat={datas.date}
                                      //     nama_program={datas.title}
                                      //     instansi={datas.nama}
                                      //     gnrm_id={index}  />
                                  )
                              })}

                        <div className="home-other">
                            {documents && documents.length > 6
                                ? documents.slice(0, 7).map((document, index) => {
                                      const i = `http://api.simonev.revolusimental.go.id:8882${document.instansi.logo}`
                                      return (
                                          <Fragment>
                                              <Link
                                                  to={"/artikel/" + document._id}
                                                  className={hidden[index] ? "d-none" : "home-other-news"}
                                              >
                                                  <div
                                                      className={
                                                          hidden[index - 1]
                                                              ? "test-progress"
                                                              : hidden[index + 6]
                                                              ? "test-progress"
                                                              : "d-none"
                                                      }
                                                  >
                                                      <span className="span-progress" style={{ borderRadius: "0px" }}>
                                                          <span
                                                              className="progress"
                                                              style={{ borderRadius: "0px" }}
                                                          ></span>
                                                      </span>
                                                  </div>
                                                  <div key={index}>
                                                      <div className="home-news-logo">
                                                          <img
                                                              className="logo-bos"
                                                              src={i}
                                                              alt="logo_kementerian"
                                                              style={{}}
                                                          />
                                                      </div>

                                                      <div className="home-news-title">
                                                          {document.judul.lenght > 25
                                                              ? document.judul.substr(0, 22)`...`
                                                              : document.judul}
                                                      </div>
                                                  </div>
                                              </Link>
                                          </Fragment>
                                      )
                                  })
                                : documents.slice(0, documents.length).map((document, index) => {
                                      const i = `http://api.simonev.revolusimental.go.id:8882${document.instansi.logo}`
                                      return (
                                          <Fragment>
                                              <Link
                                                  to={"/artikel/" + document._id}
                                                  className={hidden[index] ? "d-none" : "home-other-news"}
                                              >
                                                  <div
                                                      className={
                                                          hidden[index - 1]
                                                              ? "test-progress"
                                                              : hidden[index + documents.length - 1]
                                                              ? "test-progress"
                                                              : "d-none"
                                                      }
                                                  >
                                                      <span className="span-progress" style={{ borderRadius: "0px" }}>
                                                          <span
                                                              className="progress"
                                                              style={{ borderRadius: "0px" }}
                                                          ></span>
                                                      </span>
                                                  </div>
                                                  <div key={index}>
                                                      <div className="home-news-logo">
                                                          <img
                                                              className="logo-bos"
                                                              src={i}
                                                              alt="logo_kementerian"
                                                              style={{}}
                                                          />
                                                      </div>

                                                      <div className="home-news-title">
                                                          {document.judul.lenght > 25
                                                              ? document.judul.substr(0, 22)`...`
                                                              : document.judul}
                                                      </div>
                                                  </div>
                                              </Link>
                                          </Fragment>
                                      )
                                  })}

                            {documents && documents.length > 1 ? (
                                <Fragment>
                                    <div className="button-home-prev a" onClick={onPrev}>
                                        <i className="material-icons">arrow_back</i>
                                    </div>
                                    <div className="button-home-next a" onClick={onNext}>
                                        <i className="material-icons">arrow_forward</i>
                                    </div>
                                </Fragment>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                </div>

                <div className="home-section-4">
                    <div className="costum-container container-fluid">
                        <div className="row">
                            <div className="col" style={{ width: "40%" }}>
                                <div className="home-section-4-title">
                                    Filter Kementerian/ Lembaga/ Pemerintah Daerah
                                </div>

                                <div className="section-4-filter">
                                    <div className="filter-categories">
                                        <div calssName="filter-select">
                                            <select
                                                className="filter-a"
                                                name="nama_instansi"
                                                onChange={(e) => onChange(e, 1)}
                                            >
                                                <option value="" disabled selected={selected1} hidden>
                                                    Pilih Kementerian/Lembaga
                                                </option>
                                                {instansiLembagaKementerian
                                                    ? instansiLembagaKementerian.map((instansi, index) => {
                                                          return (
                                                              <option value={instansi.nama_pendek}>
                                                                  {instansi.nama_pendek}
                                                              </option>
                                                          )
                                                      })
                                                    : ""}
                                            </select>
                                        </div>
                                    </div>
                                    <br />
                                    <div className="filter-categories">
                                        <div calssName="filter-select">
                                            <select
                                                className="filter-a"
                                                name="nama_instansi"
                                                onChange={(e) => onChange(e, 2)}
                                            >
                                                <option value="" disabled selected={selected2} hidden>
                                                    Pilih Pemerintah Daerah
                                                </option>
                                                {instansiDaerah
                                                    ? instansiDaerah.map((instansi, index) => {
                                                          return (
                                                              <option value={instansi.nama_pendek}>
                                                                  {instansi.nama_pendek}
                                                              </option>
                                                          )
                                                      })
                                                    : ""}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col" style={{ width: "60%" }}>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    {loading ? (
                                        <div style={{ marginLeft: "68px" }}>
                                            <div
                                                className="d-flex justify-content-center align-items-center"
                                                style={{ width: "100%", height: "60vh", overflow: "hidden" }}
                                            >
                                                <Spinner />
                                            </div>
                                        </div>
                                    ) : (
                                        <Fragment>
                                            {documentCard.map((doc, index) => {
                                                return (
                                                    <Card
                                                        key={index}
                                                        doc={doc}
                                                        bgcolor={"none"}
                                                        bgimage={"linear-gradient(to bottom , #59CBA6 , #FDE47F)"}
                                                        color={`black`}
                                                        logged_id={false}
                                                    />
                                                )
                                            })}
                                        </Fragment>
                                    )}
                                </div>
                                <div className="container-mark1">
                                    {documentLengthArr &&
                                        documentLengthArr
                                            .slice(0, Math.ceil(documentCardLenght / 2))
                                            .map((gambar, index) => {
                                                return (
                                                    <div
                                                        className={
                                                            index + 1 === parseInt(page)
                                                                ? "slider-mark1 active"
                                                                : "slider-mark1"
                                                        }
                                                    ></div>
                                                )
                                            })}
                                </div>
                                {documentCardLenght > 2 ? (
                                    <Fragment>
                                        {page === "1" ? (
                                            <Fragment>
                                                <div className="button-home-next1" onClick={onNextFilter}>
                                                    <i className="material-icons">arrow_forward</i>
                                                </div>
                                            </Fragment>
                                        ) : (
                                            <Fragment>
                                                {page === JSON.stringify(Math.ceil(documentCardLenght / 2)) ? (
                                                    <div className="button-home-prev1" onClick={onPrevFilter}>
                                                        <i className="material-icons">arrow_back</i>
                                                    </div>
                                                ) : (
                                                    <Fragment>
                                                        <div className="button-home-prev1" onClick={onPrevFilter}>
                                                            <i className="material-icons">arrow_back</i>
                                                        </div>
                                                        <div className="button-home-next1" onClick={onNextFilter}>
                                                            <i className="material-icons">arrow_forward</i>
                                                        </div>
                                                    </Fragment>
                                                )}
                                            </Fragment>
                                        )}
                                    </Fragment>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                    </div>
                    <img src={exclude2} className="curves_home"></img>
                </div>
                <div className="link-terkait-section">
                    <div className="image-instansi">
                        <Link to={{pathname: 'https://www.kemendagri.go.id/'}} target="_blank">
                            <img src={linkInstansi1} className="image-1" alt="kemendagri"></img>
                        </Link>
                        <Link to={{pathname: 'https://polkam.go.id/'}} target="_blank">
                            <img src={linkInstansi2} className="image-2" alt="polkam"></img>
                        </Link>
                        <Link to={{pathname: 'https://maritim.go.id/'}} target="_blank">
                            <img src={linkInstansi3} className="image-1" alt="maritim"></img>
                        </Link>
                        <Link to={{pathname: 'https://www.ekon.go.id/'}} target="_blank">
                            <img src={linkInstansi4} className="image-2" alt="ekon"></img>
                        </Link>
                        <Link to={{pathname: 'https://menpan.go.id/site/'}} target="_blank">
                            <img src={linkInstansi5} className="image-2" alt="menpan"></img>
                        </Link>
                    </div>
                    <div className="image-landing">
                        <Link to={{pathname: 'http://revolusimental.id/'}} target="_blank">
                            <img src={linkTerkait1} className="image-1" alt="gerakan nasional revolusi mental"></img>
                        </Link>
                        <Link to={{pathname: 'http://aksinyata.kemenkopmk.go.id/'}} target="_blank">
                            <img src={linkTerkait2} className="image-2" alt="sepuluh juta pohon"></img>
                        </Link>
                    </div>
                </div>
                <div className="home-section-2 center">
                    <div className="container">
                        <div className="d-flex justify-content-between mb-3">
                            <div className="home-section-2-title">Statistik Tahun {tahun}</div>
                            <select className="home-statistik-tahun" type="text" name="tahun" onChange={onChangeTahun}>
                                <option defaultValue={tahun} hidden>
                                    {tahun}
                                </option>
                                {yearsData.map((year, i) => {
                                    if (i < 5) {
                                        return (
                                            <option key={i} value={year}>
                                                {year}
                                            </option>
                                        )
                                    }
                                })}
                            </select>
                        </div>
                        <div className="home-statistik mt-3" style={{ width: "100%" }}>
                            <StatistikGNRM color="#8380EA" tahun={tahun} aspect={2.8} />
                            <div className="keterangan">
                                <p className="">Keterangan :</p>
                                <p className="">Sumbu vertikal merupakan jumlah kegiatan</p>
                            </div>
                        </div>
                    </div>
                    <img src={exclude2} className="curves_home"></img>
                </div>

                <div style={{ position: "relative" }}>
                    <div className="home-section-3">
                        <div className="home-section-3-title">Galeri</div>

                        <Gallery pagination={false} logged_in={false} />
                    </div>
                </div>

                <Footer />
            </div>
        </Fragment>
    )
    // }
}

export default Home
