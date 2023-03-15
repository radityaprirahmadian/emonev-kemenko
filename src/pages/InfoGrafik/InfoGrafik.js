import React, { Component, Fragment, useContext, useEffect, useState } from 'react';
import SearchBar from '../../component/SearchBar/SearchBar';
import Card from '../../component/Card/Card';
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import Gallery from '../../component/Gallery/Gallery';
import SearchBarAdmin from '../../component/SearchBarAdmin/SeacrhBarAdmin';
import './InfoGrafik.css';
import lonceng from '../../assets/lonceng.png';
import statistik from '../../assets/statistik.png';
import { AuthContext } from '../../context/Auth/AuthContext';
import Notification from '../../component/Notification/Notification';
import { Bar } from 'react-chartjs-2';
import Popup from '../../component/Popup/Popup';
import axios from 'axios';
import { NotifContext } from '../../context/Notifikasi/NotifContext';
import bg_1 from '../../assets/decoration/bg_1.png';
import bg_2 from '../../assets/decoration/bg_2.png';
import bg_3 from '../../assets/decoration/bg_3.png';
import bg_4 from '../../assets/decoration/bg_4.png';
import StatistikGNRM from '../../component/Statistik/StatistikGNRMAfterLogin';
import StatistikMonev from '../../component/Statistik/StatistikMonev';
import { useHistory, NavLink } from 'react-router-dom';
import Spinner from '../../component/Spinner/Spinner';
import { LayoutContext } from '../../context/Layout/LayoutContext';
import StatistikKabarGNRM from '../../component/Statistik/StatistikKabarGNRM';
import { PDFDownloadLink } from '@react-pdf/renderer';
import DownloadStatistik from '../../component/Download/DownloadStatistik';

const Dashboard = (props) => {
  const [instansiDetail, setInstansiDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, login, userDetail, role, email, password, user, token } =
    useContext(AuthContext);
  const { notifNew, setNotifNew } = useContext(NotifContext);
  const { sidebar } = useContext(LayoutContext);
  const history = useHistory();
  const [statistikActive, setStatistikActive] = useState(true);
  const [loadingDownload, setLoadingDownload] = useState(true);
  const [dataToBeDownloaded, setDataToBeDownloaded] = useState([]);

  const [filterCard, setFilterCard] = useState({
    page: '1',
  });

  const onNextStatistik = (e) => {
    e.preventDefault();
    setStatistikActive(false);
  };

  const onPrevStatistik = (e) => {
    e.preventDefault();
    setStatistikActive(true);
  };

  const [hide, setHide] = useState(true);

  const onClickToProfileInstansi = (e) => {
    e.preventDefault();
    history.push(
      `/${user && user.role === 'owner' ? 'super-admin' : 'admin'}/profile-instansi/` +
        (userDetail && userDetail.instansi._id),
    );
    setHide(true);
  };
  const [documentCard, setDocumentCard] = useState([]);
  const [documentCardLength, setDocumentCardLength] = useState([]);

  const { page } = filterCard;

  // const getDocumentCardLength = async () => {
  //     try {
  //         const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/kabar?instansi=${userDetail.instansi.nama_pendek}`)
  //         setDocumentCardLength(res.data.total)
  //     }
  //     catch (err) {
  //         console.log(err)
  //     }
  // }

  const getDocumentCard = async () => {
    setLoading(true);
    try {
      if (userDetail.role === 'admin') {
        const res = await axios.get(
          `https://api.simonev.revolusimental.go.id/api/v1/kabar?limit=3&page=${page}&instansi=${userDetail.instansi.nama_pendek}`,
        );
        setDocumentCard(res.data.kabar);
        setDocumentCardLength(res.data.total);
      } else {
        const res = await axios.get(
          `https://api.simonev.revolusimental.go.id/api/v1/kabar?limit=3&page=${page}`,
        );
        setDocumentCard(res.data.kabar);
        setDocumentCardLength(res.data.total);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getDocumentCard();
  }, [filterCard]);

  const [documentLengthArr, setDocumentLengthArr] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch('https://api.simonev.revolusimental.go.id/api/v1/instansi')
      .then((res) => res.json())
      .then((data) => setInstansiData(data.instansi));
  }, []);

  useEffect(() => {
    getDocumentCard();
  }, [userDetail]);

  const onNextFilter = (e) => {
    if (page < (documentCardLength && Math.ceil(documentCardLength / 3))) {
      e.preventDefault();
      const a = parseInt(page);
      return setFilterCard({
        ...filterCard,
        page: JSON.stringify(a + 1),
      });
    } else {
      e.preventDefault();
      return filterCard;
    }
  };

  const onPrevFilter = (e) => {
    if (page > 1) {
      e.preventDefault();
      const a = parseInt(page);
      return setFilterCard({
        ...filterCard,
        page: JSON.stringify(a - 1),
      });
    } else {
      e.preventDefault();
      return filterCard;
    }
  };

  const yearsData = [];
  const todaysYear = new Date().getFullYear();
  for (let year = todaysYear; year >= 2020; year--) {
    yearsData.push(year);
  }

  const [periode, setPeriode] = useState('tahun');
  const [waktu, setWaktu] = useState('2020');
  const [tahun, setTahun] = useState(todaysYear);
  const [instansi, setInstansi] = useState('');
  const [instansiData, setInstansiData] = useState([]);
  const [selectedinstansi, setSelectedinstansi] = useState(null);

  const [filterStatistikGerakan, setFilterStatistikGerakan] = useState({
    tahun: todaysYear,
    periode: 'Jan-Mei',
  });

  const onChangePeriode = (e) => {
    setPeriode(e.target.value);
  };
  const onChangeWaktu = (e) => {
    if (periode === 'tahun') setTahun(e.target.value);
    setWaktu(e.target.value);
  };
  const onChangeInstansi = (e) => {
    setSelectedinstansi(e.target.value);
  };

  useEffect(() => {
    let arr = [];
    for (let i = 0; i < documentCardLength; i++) {
      arr.push(i);
    }
    setDocumentLengthArr(arr);
  }, [documentCardLength]);

  useEffect(() => {
    if (userDetail && userDetail.role !== 'owner') {
      setInstansi(userDetail && userDetail.instansi.nama_pendek);
    }
  }, [userDetail]);

  useEffect(() => {
    (async () => {
      setLoadingDownload(true);
      try {
        const res = await axios.get(
          `https://api.simonev.revolusimental.go.id/api/v2/charts/gerakan/download?tahun=${filterStatistikGerakan.tahun}&periode=${filterStatistikGerakan.periode}`,
        );
        setDataToBeDownloaded(res.data.results);
        setLoadingDownload(false);
      } catch (err) {
        console.log(err);
        setLoadingDownload(false);
      }
    })();
  }, [filterStatistikGerakan]);

  return (
    <Fragment>
      <SideBarOff setId={props.setId} />
      <Popup notif={props.notif} />
      <div className="background-after-login">
        <img src={bg_1} alt="bg1" style={{ position: 'fixed', top: '0', left: '0' }} />
        <img src={bg_2} alt="bg2" style={{ position: 'fixed', top: '0', right: '0' }} />
        <img src={bg_3} alt="bg3" style={{ position: 'fixed', bottom: '-200px', left: '0' }} />
        <img src={bg_4} alt="bg4" style={{ position: 'fixed', bottom: '-50px', right: '0' }} />
      </div>
      <div className="dashboard-page">
        <div className="tajuk-page-2">
          <div>STATISTIK TERKINI</div>
          {user && user.role === 'owner' ? '' : <Notification />}
        </div>
        <div
          style={
            sidebar
              ? { marginLeft: '188px', marginRight: '20px', transition: 'all 0.3s ease-in-out' }
              : { transition: 'all 0.3s ease-in-out' }
          }
        >
          <div className="dashboard-section">
            {statistikActive ? (
              <Fragment>
                <div className="infografik-statistik" style={{ position: 'relative' }}>
                  <div className="button-home-next2" onClick={onNextStatistik}>
                    <i className="material-icons">arrow_forward</i>
                  </div>
                  {userDetail && userDetail.role === 'owner' ? (
                    <StatistikGNRM color="#8380EA" filter={filterStatistikGerakan} />
                  ) : (
                    <StatistikGNRM
                      color="#8380EA"
                      filter={filterStatistikGerakan}
                      instansi={instansi}
                    />
                  )}
                  <div className="keterangan">
                    <p className="">Keterangan :</p>
                    <p className="">Sumbu vertikal merupakan jumlah gerakan</p>
                  </div>

                  <div className="drop-down-menu gnrm">
                    <div className="statistik-gnrm-filter">
                      <div className="select-waktu-periode">
                        <form>
                          <label>Tahun</label>
                          <br />
                          <select
                            onChange={(e) =>
                              setFilterStatistikGerakan({
                                ...filterStatistikGerakan,
                                tahun: e.target.value,
                              })
                            }
                          >
                            {yearsData.map((year, i) => {
                              if (i < 5) {
                                return (
                                  <option
                                    key={i}
                                    value={year}
                                    selected={year === filterStatistikGerakan.tahun}
                                  >
                                    {year}
                                  </option>
                                );
                              }
                            })}
                          </select>
                        </form>
                      </div>
                      <div className="select-waktu-periode">
                        <form>
                          <label>Periode</label>
                          <br />
                          <select
                            onChange={(e) =>
                              setFilterStatistikGerakan({
                                ...filterStatistikGerakan,
                                periode: e.target.value,
                              })
                            }
                          >
                            <option value="Jan-Mei" selected>
                              Januari - Mei
                            </option>
                            <option value="Jul-Nov">Juli - November</option>
                          </select>
                        </form>
                      </div>
                    </div>
                    {dataToBeDownloaded.length > 0 && (
                      <PDFDownloadLink
                        document={<DownloadStatistik data={dataToBeDownloaded} />}
                        fileName={`grafik-gnrm.pdf`}
                      >
                        <div className="button-download-statistik">Unduh Statistik</div>
                      </PDFDownloadLink>
                    )}
                  </div>
                </div>

                <div className="slider-dashboard">
                  <div className="active-slider-dashboard"></div>
                  <div className="nonactive-slider-dashboard"></div>
                </div>
              </Fragment>
            ) : (
              <Fragment>
                <div className="infografik-statistik" style={{ position: 'relative' }}>
                  <div className="button-home-prev2" onClick={onPrevStatistik}>
                    <i className="material-icons">arrow_back</i>
                  </div>
                  <StatistikMonev color="#8380EA" periode={periode} instansi={selectedinstansi} />
                  <div className="keterangan">
                    <p className="">Keterangan :</p>
                    <p className="">Sumbu vertikal merupakan progres laporan yang dikerjakan</p>
                  </div>
                </div>

                <div className="slider-dashboard">
                  <div className="nonactive-slider-dashboard"></div>
                  <div className="active-slider-dashboard"></div>
                </div>

                <div className="drop-down-menu">
                  <div className="spacer"></div>

                  <div className="select-waktu-periode">
                    <form>
                      <label>Periode</label>
                      <br />
                      <select onChange={onChangePeriode}>
                        <option defaultValue hidden>
                          Pilih Periode
                        </option>
                        <option value="tahun">Tahun</option>
                        <option value="caturwulan">Caturwulan</option>
                      </select>
                    </form>
                  </div>

                  {user && user.role === 'owner' ? (
                    <div className="select-waktu-periode">
                      <form>
                        <label>Instansi</label>
                        <br />
                        <select onChange={onChangeInstansi}>
                          <option defaultValue hidden>
                            Pilih Instansi
                          </option>
                          {instansiData.map((ins) => (
                            <option value={ins.nama_pendek}>{ins.nama_pendek}</option>
                          ))}
                        </select>
                      </form>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </Fragment>
            )}
          </div>

          <div className="dashboard-section">
            <div className="tajuk-page2">
              <p>PEMBENTUKAN GUGUS TUGAS DAERAH</p>
            </div>
            <div
              className="infografik-statistik"
              style={{ position: 'relative', height: 'fit-content' }}
            >
              <StatistikKabarGNRM color="#8380EA" />
              <div className="keterangan">
                <p className="">Keterangan :</p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    flexDirection: 'column',
                    gap: 5,
                    marginTop: 10,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      width: 100,
                    }}
                  >
                    <div style={{ width: 20, height: 20, background: 'rgba(66,79,200,1)' }}></div>
                    <div>Provinsi</div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      width: 100,
                    }}
                  >
                    <div style={{ width: 20, height: 20, background: 'rgba(253,228,127,1)' }}></div>
                    <div>Kab/Kota</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div style={{ marginLeft: '80px', marginBottom: '80px' }}>
            <div className="tajuk-page3">
              <p>GALERI</p>
            </div>
            <Gallery pagination={true} logged_in={true} />
          </div> */}
        </div>
      </div>
    </Fragment>
  );
};

export default Dashboard;
