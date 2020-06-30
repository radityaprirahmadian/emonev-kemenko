import React,{Component,Fragment, useState, useEffect, useContext} from 'react';
import ItemsCarousel from 'react-items-carousel';
import axios from 'axios';
import { AuthContext } from '../../context/Auth/AuthContext'
import './Home.css';
import ArtikelHome from '../../component/ArtikelHome/ArtikelHome'
import Topbar from '../../component/Topbar/Topbar';
import Footer from '../../component/Footer/Footer';
import background from '../../assets/background.png';
import logo_kemenko from '../../assets/logo_kemenko.png';
import Card from '../../component/Card/Card';
import Gallery from '../../component/Gallery/Gallery';
import { BrowserRouter as Router, Route, Link, NavLink, useLocation } from "react-router-dom";
import statistik from '../../assets/statistik.png';
import {Bar} from 'react-chartjs-2';
import StatistikGNRM from '../../component/Statistik/StatistikGNRM'
import Spinner from '../../component/Spinner/Spinner'

const Home = () => {
    const [loading, setLoading] = useState(false)

    const datas = {   
        post: [
            {
                id: 1,
                date: '12 April 2020',
                nama: 'KEMENKO PMK',
                title: 'Peningkatan Kapasitas Sumber Daya Manusia Aparatur Sipil Negara',
                img: 'https://img.freepik.com/free-vector/abstract-galaxy-background_1199-247.jpg?size=626&ext=jpg'
            },
            {
                id: 2,
                date: '13 April 2020',
                nama: 'KEMENPAN',
                title: 'Penyempurnaan Standar Pelayanan dan Sistem Pelayanan yang Inovatif',
                img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkiNK6ZQuYpJh2RaTFcdCMw6P9YtL8n8C1hBft9NhKXLNxYHNu&s'
            },
            {
                id: 3,
                date: '14 April 2020',
                nama: 'KEMENKO MARITIM',
                title: 'Peningkatan Perilaku Tertib Penggunaan Ruang Publik',
                img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrszLxVL7_mQnQG7S_hQl_vuMDlovlHu-oSjzaGCrxOw1Guqen&s'
            },
            {
                id: 4,
                date: '15 April 2020',
                nama: 'KEMENDAGRI',
                title: 'Peningkatan Sinergi Penyediaan Sarana dan Prasarana yang Menunjang Perilaku Hidup Bersih dan Sehat Dan Merajai Semua',
                img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3Ax4Or8Tcf0MEGlgRzqSX3LD8Jyq7zPG4AeXJ6qE3SUToPekJIA&s'
            },
            {
                id: 5,
                date: '16 April 2020',
                nama: 'KEMENKO KEMENPAN',
                title: 'Peningkatan Peran Koperasi dan UMKM Terhadap Ekonomi Nasional',
                img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrszLxVL7_mQnQG7S_hQl_vuMDlovlHu-oSjzaGCrxOw1Guqen&s'
            },
            {
                id: 6,
                date: '17 April 2020',
                nama: 'KEMENKO PEREKONOMIAN',
                title: 'Peningkatan Perilaku yang Mendukung Kehidupan Demokrasi Pancasila',
                img: 'https://img.freepik.com/free-vector/abstract-galaxy-background_1199-247.jpg?size=626&ext=jpg'
            },
            {
                id: 7,
                date: '18 April 2020',
                nama: 'KEMENKO MARITIM',
                title: 'Peningkatan Perilaku Tertib Penggunaan Ruang Publik',
                img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3Ax4Or8Tcf0MEGlgRzqSX3LD8Jyq7zPG4AeXJ6qE3SUToPekJIA&s'
            },
            {
                id: 8,
                date: '19 April 2020',
                nama: 'KEMENDAGRI',
                title: 'Peningkatan Kapasitas Sumber Daya Manusia Aparatur Sipil Negara',
                img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkiNK6ZQuYpJh2RaTFcdCMw6P9YtL8n8C1hBft9NhKXLNxYHNu&s'
            }
        ]
    }

    const data = {
        labels: ['Kemendagri', 'Kemenko Maritim', 'Kemenko PMK','Kemenko Perekonomian', `Kemenko Polhukam`, 'Kemenpan RB', ],
        datasets: [
          {
            label: 'Jumlah Kegiatan Kementrian',
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
    const { loadUser, token } = useContext(AuthContext);
    const [documents , setDocuments] = useState([])

    const getAllDocument = async () => {
        try {
                const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/kabar`)
                setDocuments(res.data.kabar)
                console.log(res.data.kabar)
        }
        catch (err) {
            console.log(err)  
        }  
    }

    const [filterCard,setFilterCard] = useState({
        page:'1',
        nama_instansi: '',
    })

    const [datak,setData] = useState([])
    const [documentCard,setDocumentCard] = useState([])
    const [documentCardLenght,setDocumentCardLength] = useState([])
    
    const {
        page,
        nama_instansi
    } = filterCard

    const getDocumentCardLength = async () => {
        try {
            const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/kabar?instansi=${nama_instansi}`)
            setDocumentCardLength(res.data.total)
        }
        catch (err) {
            console.log(err)  
        }  
    }

    // const Statistika = async () => {
    //     try {
    //         const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/statistik?select=Kemendagri,Kemenko PMK,Kemenpan RB,Kemenko Maritim,Kemenko Polhukam,Kemenko Perekonomian&type=gnrm`)
    //         console.log(res.data.statistik)
    //     }
    //     catch (err) {
    //         console.log(err)  
    //     }  
    // }

    const getDocumentCard = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/kabar?limit=2&page=${page}&instansi=${nama_instansi}`)
            setDocumentCard(res.data.kabar)
        }
        catch (err) {
            console.log(err)  
        }  
        setLoading(false)
    }

    const onChange = (e) => {
        setFilterCard({...filterCard,[e.target.name]:e.target.value})
    }
    const { pathname } = useLocation();

    useEffect(() =>{
        // Statistika()
        getAllDocument()
        getDocumentCard()
        getDocumentCardLength()
    },[filterCard])

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    
    const [instansi, setInstansi] = useState([])
    const [instansiDaerah, setInstansiDaerah] = useState([])

    useEffect(() => {
        axios.get('https://api.simonev.revolusimental.go.id/api/v1/instansi?jenis=Kementerian')
        .then(res => {
            setInstansi(res.data.instansi)
            console.log('wow')
        })
        .catch(err => {
            console.log('wow', +err)
        })

        axios.get('https://api.simonev.revolusimental.go.id/api/v1/instansi?jenis=Pemerintah Daerah')
        .then(res => {
            setInstansiDaerah(res.data.instansi)
            console.log('wow')
        })
        .catch(err => {
            console.log('wow', +err)
        })
        getAllDocument()
    }, [])

    const [hidden, setHidden] = useState([
        true,
        false,
        false,
        false,
        false,
        false,
        false
      ]);

      useEffect(() => {
        let cleanup = false;
        setTimeout(() => {
          if (!cleanup) {
            const change = hidden;
            const pop = change.pop();
            change.unshift(pop);
            setHidden([...change]);
          }
        }, 5000);
        return () => {
          cleanup = true;
        };
      }, [hidden]);

      const onClick = index => {
        const change = hidden.map(i => (i = false));
        change[index] = true;
        setHidden([...change]);
      };
    
      const getTrueIndex = () => {
        let trueIndex = 0;
        hidden.forEach((v, i) => {
          if (v) trueIndex = i;
        });
        return trueIndex;
      };
    
      const onPrev = () => {
        const trueIndex = getTrueIndex();
    
        let change = [...hidden];
    
        const minIndex = 0;
        const maxIndex = 6;
    
        change[trueIndex >= minIndex ? trueIndex : minIndex] = false;
        change[trueIndex > minIndex ? trueIndex - 1 : maxIndex] = true;
    
        setHidden([...change]);
      };
    
      const onNext = () => {
        const trueIndex = getTrueIndex();
    
        let change = [...hidden];
    
        const minIndex = 0;
        const maxIndex = 6;
    
        change[trueIndex <= maxIndex ? trueIndex : minIndex] = false;
        change[trueIndex < maxIndex ? trueIndex + 1 : minIndex] = true;
    
        setHidden([...change]);
      };

      console.log(documentCardLenght && documentCardLenght.length)
      const onNextFilter = (e) => {
        if(page < (documentCardLenght && documentCardLenght / 2)) {
            e.preventDefault()
            const a = parseInt(page)
            return setFilterCard({
                ...filterCard,
                page: JSON.stringify(a + 1)
            })
            console.log('tes')
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
      
    let tanggal = new Date(Date.now())
    let bulans = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][tanggal.getMonth()];
    //const [ bulan , setBulan ] = useState('')

    // useEffect(() => {
    //     setBulan(bulans)
    // }, [])
    // const onChangeBulan = (e) => {
    //     return setBulan(e.target.value)
    // }

    const yearsData = [];
    const todaysYear = new Date().getFullYear();
    for (let year = todaysYear; year >= 2020; year--) {
        yearsData.push(year);
    }
    const [tahun, setTahun] = useState(todaysYear)

    const onChangeTahun = e => {
        setTahun(e.target.value)
    }
    
        return(
            <Fragment>
                <Topbar kunci={true}/>
                    <div className="home" style={{margin:'0'}}>
                        <div className="home-section-1">
                            {
                                // datas.post.slice((datas.post.length - 7)).map((data, index) => {
                                documents.slice(0,7).map((document, index) => {
                                    const i = document.gambar.map(infografis => `https://api.simonev.revolusimental.go.id${infografis.path}`)
                                    console.log(i)
                                    return (
                                        <Fragment>
                                            <div key={index} className={hidden[index] ? "home-pic" : "d-none"} style={{height:'768px'}}>
                                                <div style={{backgroundColor:'rgba(0,0,0,0.8)', width:'100%' , height:'768px',  position:'absolute'}}>
                                                </div>
                                                    <img src={i[index]} style={{width: '100%' , height: '768px'}}/>
                                                
                                            </div>
                                        </Fragment>
                                        );
                                    })
                            }

                            <div className="home-desc">
                                {
                                    // datas.post.slice((datas.post.length - 7 )).map((datas,index) => {
                                    documents.slice(0,7).map((document, index) => {
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
                                            );
                                        })
                                }


                                <div className="home-other">
                                    {documents.slice(0,7).map((document, index) => {
                                        const i = `https://api.simonev.revolusimental.go.id${document.instansi.logo}`
                                        return (
                                            <Link to={'/artikel/'+ (document._id)} className={hidden[index] ? "d-none" : "home-other-news"}>
                                                <div key={index}>
                                                    <div className="home-news-logo">
                                                        <img className="logo-bos" src={i} alt='logo_kementerian' style={{}}/>  
                                                    </div>
        
        
                                                    <div className="home-news-title">
                                                        {document.judul.lenght > 25 ? document.judul.substr(0,22)`...` : document.judul }  
                                                    </div>
                                                </div>
                                            </Link>
                                            );
                                        })
                                    }
                                    {/* {
                                        datas.post.slice((datas.post.length - 7)).map((datas, index) => {
                                        return (
                                            <Link to={'/artikel/'+ (datas.index)} className={hidden[index] ? "d-none" : "home-other-news"}>
                                                <div key={index}>
                                                    <div className="home-news-logo">
                                                        <img className="logo-bos" src={logo_kemenko} style={{}}/>  
                                                    </div>
        
        
                                                    <div className="home-news-title">
                                                        {datas.title}  
                                                    </div>
                                                </div>
                                            </Link>
                                            );
                                        })
                                    } */}

                                    <div className="button-home-prev" onClick={onPrev}>
                                        <i className="material-icons" style={{fontSize:'16px' , lineHeight:'24px'}}>arrow_back</i>
                                    </div>
                                    <div className="button-home-next" onClick={onNext}>
                                        <i className="material-icons" style={{fontSize:'16px' , lineHeight:'24px'}}>arrow_forward</i>
                                    </div>
                                </div>
                            </div>                           
                        </div>

                        <div className="home-section-4" style={{margin:'auto'}}>
                            <div className="costum-container container-fluid">
                                <div className="row">
                                    <div className="col-4">
                                        <div className="home-section-4-title">
                                            Filter Kementerian/ Lembaga/ Pemerintah Daerah
                                        </div>

                                        <div className="section-4-filter">
                                            <select className="filter-a" name="nama_instansi" onChange={onChange}>
                                                <option value="" disabled selected hidden>Pilih Kementerian/Lembaga</option>
                                            {
                                                instansi ? 
                                                    instansi.map((instansi,index) => {
                                                        return (
                                                                <option value={instansi.nama_pendek}>{instansi.nama_pendek}</option>
                                                            )
                                                    })
                                                : ''
                                            }    
                                            </select>
                                            <br/>
                                            <select className="filter-a" name="nama_instansi" onChange={onChange}>
                                                <option value="" disabled selected hidden>Pilih Pemerintah Daerah</option>
                                                {
                                                instansiDaerah ? 
                                                    instansiDaerah.map((instansi,index) => {
                                                        return (
                                                                <option value={instansi.nama_pendek}>{instansi.nama_pendek}</option>
                                                            )
                                                    })
                                                : ''
                                            }  
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="col-8" style={{display:'flex' , flexDirection:'row'}}>
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
                                                        <Card key={index}
                                                        doc={doc}
                                                        bgcolor={'none'}
                                                        bgimage={'linear-gradient(to bottom , #59CBA6 , #FDE47F)'}
                                                        color={`black`}/>
                                                        );
                                                    })
                                            }

                                        </Fragment>
                                    }

                                        {
                                            documentCardLenght > 2 ?
                                                <Fragment>
                                                    <div className="button-home-prev" style={{top:'200px'}} onClick={onPrevFilter}>
                                                        <i className="material-icons" style={{fontSize:'16px' , lineHeight:'24px'}}>arrow_back</i>
                                                    </div>
                                                    <div className="button-home-next" style={{top:'200px' , right:'-47px'}} onClick={onNextFilter}>
                                                        <i className="material-icons" style={{fontSize:'16px' , lineHeight:'24px'}}>arrow_forward</i>
                                                    </div>
                                                </Fragment>
                                            :
                                            ''
                                        }
                                    </div>
                                </div>
                            </div>
                            <svg id='curve' data-name='layer 1' xmlns='http://www/w3/org/2000/svg' viewBox=" 0 0 1416.99 174.01"><defs>
                                    <style></style></defs><path style={{fill: '#59CBA6'}} className='cls-1' d='M0,280.8S283.66,59,608.94,163.56s437.93,150.57,808,10.34V309.54H0V280.8Z' transform='translate(0-135.53)'></path></svg>
                        </div>

                        <div className="home-section-2 center">
                            <div className="container">
                                <div className="d-flex justify-content-between mb-5">
                                    <div className="home-section-2-title">
                                        Statistik Tahun {tahun}
                                    </div>
                                    <select className='home-statistik-tahun' type="text" name="tahun" onChange={onChangeTahun} >
                                        <option defaultValue={tahun} hidden>{tahun}</option>
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
                                </div>
                                <div className="home-statistik mt-5 w-100">
                                    <StatistikGNRM 
                                        tahun={tahun}
                                    />
                                </div>
                            </div>
                            <svg id='curve' data-name='layer 1' xmlns='http://www/w3/org/2000/svg' viewBox=" 0 0 1416.99 174.01">
                                <defs><style></style></defs>
                                <path style={{fill: '#fff'}} className='cls-1' d='M0,280.8S283.66,59,608.94,163.56s437.93,150.57,808,10.34V309.54H0V280.8Z' transform='translate(0-135.53) scale(-1,1)' transform-origin='center'>
                                </path>
                            </svg>
                        </div>


                        <div style={{position:"relative"}}>
                            <div className="home-section-3" style={{width:'1300px', height:'fit-content', margin:'auto'}}>
                                <div className="home-section-3-title">
                                    Galeri
                                </div>
                                
                                <Gallery/>
                                
                                <Link to='/galeri'>
                                <button className="button-lihat-gallery">
                                    LIHAT GALERI LAINNYA
                                </button>
                                </Link>
                            </div>
                        </div>

                    <Footer/>
                    </div>
            </Fragment>
        )
    // }
}

export default Home;