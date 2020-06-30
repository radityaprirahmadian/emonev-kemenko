import React, { Component, Fragment, useContext, useEffect, useState } from 'react';
import SearchBar from '../../component/SearchBar/SearchBar';
import Card from "../../component/Card/Card";
import SideBarOff from "../../component/SideBarOff/SideBarOff";
import Gallery from '../../component/Gallery/Gallery';
import SearchBarAdmin from '../../component/SearchBarAdmin/SeacrhBarAdmin';
import './InfoGrafik.css';
import lonceng from '../../assets/lonceng.png';
import statistik from '../../assets/statistik.png';
import { AuthContext } from '../../context/Auth/AuthContext'
import Notification from '../../component/Notification/Notification';
import {Bar} from 'react-chartjs-2';
import Popup from '../../component/Popup/Popup';
import axios from 'axios'
import { NotifContext } from '../../context/Notifikasi/NotifContext';
import bg_1 from '../../assets/decoration/bg_1.png'
import bg_2 from '../../assets/decoration/bg_2.png'
import bg_3 from '../../assets/decoration/bg_3.png'
import bg_4 from '../../assets/decoration/bg_4.png'
import StatistikGNRM from '../../component/Statistik/StatistikGNRM'
import StatistikMonev from '../../component/Statistik/StatistikMonev'
import { useHistory, NavLink } from 'react-router-dom';
import Spinner from '../../component/Spinner/Spinner'

const Dashboard = (props) => {
    const [instansiDetail , setInstansiDetail] = useState({})
    const [loading, setLoading] = useState(false)
    const { isAuthenticated, login, userDetail , role, email, password, user, token } = useContext(AuthContext);
    const { notifNew , setNotifNew } = useContext(NotifContext)
    const history = useHistory()
    const [ statistikActive , setStatistikActive] = useState(true)

    console.log(userDetail)

    useEffect(() => {
      setNotifNew(props.notif)
    },[props.notif])

    const [filterCard,setFilterCard] = useState({
        page:'1',
    })

    const onNextStatistik = (e) => {
      e.preventDefault()
      setStatistikActive(false)
    }

    const onPrevStatistik = (e) => {
      e.preventDefault()
      setStatistikActive(true)
    }

    const [hide , setHide] = useState(true)

    const onClickToProfileInstansi = (e) => {
      e.preventDefault()
      history.push(`/${user&&user.role === 'owner' ? 'super-admin' : 'admin'}/profile-instansi/` + (userDetail && userDetail.instansi._id))
      setHide(true)
      
  }
    const [documentCard,setDocumentCard] = useState([])
    console.log(documentCard)
    const [documentCardLength,setDocumentCardLength] = useState([])
    
    const {
        page,
    } = filterCard

    console.log(page)
    console.log(documentCard)

    const getDocumentCardLength = async () => {
        try {
            const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/kabar?instansi=${userDetail.instansi.nama_pendek}`)
            setDocumentCardLength(res.data.kabar)
        }
        catch (err) {
            console.log(err)  
        }  
    }

    const getDocumentCard = async () => {
      setLoading(true)
      try {
            if(userDetail.role === 'admin'){
                const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/kabar?limit=3&page=${page}&instansi=${userDetail.instansi.nama_pendek}`)
                setDocumentCard(res.data.kabar)
            } else {
                const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/kabar?limit=3&page=${page}`)
                setDocumentCard(res.data.kabar)
            }
      }
      catch(err) {
          console.log(err)
      }  
      setLoading(false)
    }

    useEffect(() =>{
      getDocumentCard()
      getDocumentCardLength()

      fetch("https://api.simonev.revolusimental.go.id/api/v1/instansi")
      .then(res => res.json())
      .then(data => setInstansiData(data.instansi));
      
    },[])

    useEffect(() =>{
        getDocumentCard()
        getDocumentCardLength()
    },[filterCard])

    useEffect(() => {
      const getInstansiDetail = async () => {
          const config = {
              headers: {
                  'X-Auth-Token': `aweuaweu ${token}`,
              }
          }
          try {
              const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/instansi/${userDetail && userDetail.instansi._id}`,config)
              setInstansiDetail(res.data.instansi)
              if(res.data.instansi.alamat === '' || res.data.instansi.kontak === '' || res.data.instansi.website === '' || res.data.instansi.fax === '') {
                  setHide(false)
              } else {
                  setHide(true)
              }
          }
          catch (err) {
              console.log(err)
          }
      }
      getInstansiDetail()
  },[])


      const onNextFilter = (e) => {
        if(page < (documentCardLength && Math.ceil(documentCardLength.length / 3))) {
            e.preventDefault()
            const a = parseInt(page)
            return setFilterCard({
                ...filterCard,
                page: JSON.stringify(a + 1)
            })
        } else { 
            e.preventDefault()
            return filterCard;
        }
    }

    const onPrevFilter = (e) => {
        if(page > 1 ) {
            e.preventDefault()
                const a = parseInt(page)
                return setFilterCard({
                    ...filterCard,
                    page: JSON.stringify(a - 1)
                })
        } else {
            e.preventDefault()
            return filterCard;
        }
    }

  const yearsData = [];
  const todaysYear = new Date().getFullYear();
  for (let year = todaysYear; year >= 2020; year--) {
      yearsData.push(year);
  }
  
  const [periode, setPeriode] = useState('tahun')
  const [waktu, setWaktu] = useState('2020')
  const [tahun, setTahun] = useState(todaysYear)
  const [instansiData, setInstansiData] = useState([])
  const [selectedinstansi, setSelectedinstansi] = useState(null)
  
  const onChangePeriode = e => {
    setPeriode(e.target.value)
  }
  const onChangeWaktu = e => {
    if (periode === 'tahun') setTahun(e.target.value)
    setWaktu(e.target.value)
  }
  const onChangeInstansi = e => {
    setSelectedinstansi(e.target.value)
  }

  return (
      <Fragment>
            <SideBarOff/>
            <Popup notif={props.notif}/>

            {
               hide ?
                '' 
                :
                <div className="popup-check">
                    <div className="popup-check-instansi">
                        <div className='popup-check-instansi-title'>Profile Instansi Belum Lengkap</div> <br/>
                        <div>Untuk dapat mengisi laporan,<br/> harap mengisi profil instansi anda <br/>terlebih dahulu.</div> <br/><br/><br/><br/><br/>
                        <NavLink to={`/${user&&user.role === 'owner' ? 'super-admin' : 'admin'}/profile-instansi/` + (userDetail && userDetail.instansi._id)} activeClassName="active">
                            <button className="button-to-instansi" onClick={onClickToProfileInstansi}>LENGKAPI PROFIL</button>
                        </NavLink>
                    </div>
                </div>
            }
            <div className="background-after-login">
                <img src={bg_1} alt='bg1' style={{position: 'fixed' , top:'0' , left: '0'}}/>
                <img src={bg_2} alt='bg2' style={{position: 'fixed' , top:'0' , right: '0'}}/>
                <img src={bg_3} alt='bg3' style={{position: 'fixed' , bottom:'-200px' , left: '0'}}/>
                <img src={bg_4} alt='bg4' style={{position: 'fixed' , bottom:'-50px' , right: '0'}}/>
            </div>
                <div className="dashboard-page">
                    <div className="tajuk-page-2">
                          <div>STATISTIK TERKINI</div>
                      {
                        user && user.role === 'owner' ?
                        ''
                        :
                        <Notification/>
                      }
                    </div>
                  <div className="dashboard-section">


                      {
                        statistikActive ?
                        <Fragment>
                          <div className="infografik-statistik" style={{position:'relative'}}>
                            <div className="button-home-prev" style={{top:'35%' , left:'-32px'}} onClick={onPrevStatistik}>
                                <i className="material-icons" style={{fontSize:'16px' , lineHeight:'24px'}}>arrow_back</i>
                            </div>
                            <div className="button-home-next" style={{top:'35%' , right:'-32px'}} onClick={onNextStatistik}>
                                <i className="material-icons" style={{fontSize:'16px' , lineHeight:'24px'}}>arrow_forward</i>
                            </div>
                            <StatistikGNRM 
                                color='#8380EA'
                                tahun={tahun}
                                periode={periode}
                                waktu={waktu}
                            />
                            <div className="keterangan">
                              <p className="">
                                Keterangan : 
                              </p>
                              <p className="">
                                Sumbu Y merupakan jumlah gerakan
                              </p>
                            </div>
                          </div>

                          <div className="drop-down-menu">

                            <div className="spacer"></div>

                            <div className="select-waktu-periode">
                              <form> 
                                  <select onChange={onChangePeriode}>
                                    <option value="tahun">Tahun</option>
                                    <option value="caturwulan">Caturwulan</option>
                                  </select>
                                  <br/>
                                  <label>
                                    Periode
                                  </label>
                              </form>
                            </div>

                            <div className="select-waktu-periode">
                              {
                                periode === 'tahun'
                                ?
                                <form> 
                                  <select onChange={onChangeWaktu}>
                                    <option defaultValue hidden>Pilih Tahun</option>
                                    {
                                        yearsData.map((year, i) => {
                                            if (i < 5) {
                                                return (
                                                    <option key={i} value={year}>
                                                        {year}
                                                    </option>
                                                )
                                            }
                                        })
                                    }
                                  </select>
                                  <br/>
                                  <label>
                                    Tahun
                                  </label>
                              </form>
                              :
                              <form> 
                                  <select onChange={onChangeWaktu}>
                                    <option defaultValue hidden>Pilih Caturwulan</option>
                                    <option defaultValue value='caturwulan1' >Caturwulan ke-1</option>
                                    <option defaultValue value='caturwulan2' >Caturwulan ke-2</option>
                                    <option defaultValue value='caturwulan3' >Caturwulan ke-3</option>
                                    <option defaultValue value='caturwulan4' >Caturwulan ke-4</option>
                                    
                                  </select>
                                  <br/>
                                  <label>
                                    Caturwulan
                                  </label>
                              </form>
                              }
                            </div>

                          </div>
                        </Fragment>
                        :
                        <Fragment>
                          <div className="infografik-statistik" style={{position:'relative'}}>
                            <div className="button-home-prev" style={{top:'35%' , left:'-32px'}} onClick={onPrevStatistik}>
                                <i className="material-icons" style={{fontSize:'16px' , lineHeight:'24px'}}>arrow_back</i>
                            </div>
                            <div className="button-home-next" style={{top:'35%' , right:'-32px'}} onClick={onNextStatistik}>
                                <i className="material-icons" style={{fontSize:'16px' , lineHeight:'24px'}}>arrow_forward</i>
                            </div>
                            <StatistikMonev 
                                color='#8380EA'
                                periode={periode}
                                instansi={selectedinstansi}
                            />
                            <div className="keterangan">
                              <p className="">
                                Keterangan : 
                              </p>
                              <p className="">
                                Sumbu Y merupakan progres laporan yang dikerjakan
                              </p>
                            </div>
                          </div>
                          
                          <div className="drop-down-menu">

                            <div className="spacer"></div>

                            <div className="select-waktu-periode">
                              <form> 
                                  <select onChange={onChangePeriode}>
                                    <option defaultValue hidden>Pilih Periode</option>
                                    <option value="tahun">Tahun</option>
                                    <option value="caturwulan">Caturwulan</option>
                                  </select>
                                  <br/>
                                  <label>
                                    Periode
                                  </label>
                              </form>
                            </div>

                            {
                              user && user.role === 'owner' ? 
                                <div className="select-waktu-periode">
                                  <form> 
                                      <select onChange={onChangeInstansi}>
                                        <option defaultValue hidden>Pilih Instansi</option>
                                        {
                                          instansiData.map(ins => (
                                          <option value={ins.nama_pendek}>{ins.nama_pendek}</option>
                                          ))
                                        }
                                      </select>
                                      <br/>
                                      <label>
                                        Instansi
                                      </label>
                                  </form>
                                </div>
                              : ''
                            }
                          </div>

                        </Fragment>
                      }
                  </div>

                  <div className="dashboard-section">
                    <div className="tajuk-page2">
                        <p>KABAR GNRM TERKINI</p>
                    </div>
                    <div style={{display:'flex' , flexDirection:'row' , width:'fit-content' , heigth: 'fit-content' , margin: 'auto' , position: 'relative'}}>
                        {
                          loading ?
                          <div style={{ marginLeft: '68px' }}>
                              <div className="d-flex justify-content-center align-items-center" style={{ width: '100%', height: '60vh', overflow: 'hidden' }}>
                                  <Spinner />
                              </div> 
                          </div>
                          :
                          <Fragment>
                            {
                                documentCard.map((doc, index) => {
                                    return (
                                        <Card 
                                        key={index}
                                        doc={doc}
                                        bgcolor={'white'}
                                        color={'black'}
                                        btimage={'none'}/>
                                        );
                                    })
                            }
                          </Fragment>
                          }
                        {
                          documentCard.length > 2 ?
                            <Fragment>
                              <div className="button-home-prev" style={{top:'200px'}} onClick={onPrevFilter}>
                                  <i className="material-icons" style={{fontSize:'16px' , lineHeight:'24px'}}>arrow_back</i>
                              </div>
                              <div className="button-home-next" style={{top:'200px'}} onClick={onNextFilter}>
                                  <i className="material-icons" style={{fontSize:'16px' , lineHeight:'24px'}}>arrow_forward</i>
                              </div>
                            </Fragment>
                          :
                          ''
                        }
                          
                    </div>
                  </div>
                
                <div style={{marginLeft:'80px'}}>
                    <div className="tajuk-page3">
                        <p>GALERI</p>
                    </div>
                    <Gallery/>
                </div>
              </div>
      </Fragment>
    );
}

export default Dashboard;
