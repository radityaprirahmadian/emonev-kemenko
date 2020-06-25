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

const data = {
  labels: ['KEMENPAN', `KEMENKO POLHUKAM`, 'KEMENKO MARITIM', 'KEMENKO PEREKONOMIAN', 'KEMENDAGRI', 'KEMENKO PMK'],
  datasets: [
    {
      label: 'Jumlah Kegiatan Kementerian',
      color: 'black',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: [65, 59, 80, 81, 56, 70]
    }
  ]
};


const Dashboard = (props) => {
    const { isAuthenticated, login, userDetail , role, email, password, user } = useContext(AuthContext);
    const { notifNew , setNotifNew } = useContext(NotifContext)

    console.log(userDetail)

    useEffect(() => {
      setNotifNew(props.notif)
    },[props.notif])

    const [filterCard,setFilterCard] = useState({
        page:'1',
    })

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
            const res = await axios.get(`https://test.bariqmbani.me/api/v1/kabar?instansi=${userDetail.instansi.nama_pendek}`)
            setDocumentCardLength(res.data.kabar)
        }
        catch (err) {
            console.log(err)  
        }  
    }

    const getDocumentCard = async () => {
      try {
            if(userDetail.role === 'admin'){
                const res = await axios.get(`https://test.bariqmbani.me/api/v1/kabar?limit=3&page=${page}&instansi=${userDetail.instansi.nama_pendek}`)
                setDocumentCard(res.data.kabar)
            } else {
                const res = await axios.get(`https://test.bariqmbani.me/api/v1/kabar?limit=3&page=${page}`)
                setDocumentCard(res.data.kabar)
            }
      }
      catch(err) {
          console.log(err)
      }  
    }

    useEffect(() =>{
      getDocumentCard()
      getDocumentCardLength()

      fetch("http://localhost:5000/api/v1/instansi")
      .then(res => res.json())
      .then(data => setInstansiData(data.instansi));
      
    },[])

    useEffect(() =>{
        getDocumentCard()
        getDocumentCardLength()
    },[filterCard])

      const onNextFilter = (e) => {
        if(page < (documentCardLength && documentCardLength.length / 2)) {
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
              user && user.role === 'owner' ?
                ''
              :
                <Notification/>
            }
            <div className="background-after-login">
                <img src={bg_1} alt='bg1' style={{position: 'fixed' , top:'0' , left: '0'}}/>
                <img src={bg_2} alt='bg2' style={{position: 'fixed' , top:'0' , right: '0'}}/>
                <img src={bg_3} alt='bg3' style={{position: 'fixed' , bottom:'-200px' , left: '0'}}/>
                <img src={bg_4} alt='bg4' style={{position: 'fixed' , bottom:'-50px' , right: '0'}}/>
            </div>
                <div className="dashboard-page">
                  <div className="dashboard-section">
                      <div className="tajuk-page1">
                          <p>STATISTIK TERKINI</p>
                      </div>
                    
                    <div className="infografik-statistik">
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

                    {/* MONEV */}
                    <div className="infografik-statistik">
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

                    </div>

                  </div>

                  <div className="dashboard-section">
                    <div className="tajuk-page2">
                        <p>KABAR GNRM TERKINI</p>
                    </div>
                    <div style={{display:'flex' , flexDirection:'row' , width:'fit-content' , heigth: 'fit-content' , margin: 'auto' , position: 'relative'}}>
                        {
                            documentCard.map((doc, index) => {
                                return (
                                    <Card 
                                    key={index}
                                    doc={doc}/>
                                    );
                                })
                        }
                          <div className="button-home-prev" style={{top:'200px'}} onClick={onPrevFilter}>
                              <i className="material-icons" style={{fontSize:'16px' , lineHeight:'24px'}}>arrow_back</i>
                          </div>
                          <div className="button-home-next" style={{top:'200px'}} onClick={onNextFilter}>
                              <i className="material-icons" style={{fontSize:'16px' , lineHeight:'24px'}}>arrow_forward</i>
                          </div>
                    </div>
                  </div>
                
                  <div className="tajuk-page3">
                      <p>GALLERY</p>
                  </div>
                  <Gallery/>
                  <div className="gallery-pagination" style={{marginBottom:'61px'}}>
                        <i className="material-icons">chevron_left</i>
                        <ul> 
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                            <li>5</li>
                        </ul>
                        <i className="material-icons">chevron_right</i>
                    </div>
              </div>
      </Fragment>
    );
}

export default Dashboard;
