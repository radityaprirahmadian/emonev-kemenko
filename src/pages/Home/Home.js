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



const Home = () => {
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
                const res = await axios.get(`https://test.bariqmbani.me/api/v1/infografis`)
                console.log(res.data.infografis)
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
            const res = await axios.get(`https://test.bariqmbani.me/api/v1/infografis?status=true&instansi=${nama_instansi}`)
            setDocumentCardLength(res.data.infografis)
        }
        catch (err) {
            console.log(err)  
        }  
    }

    const Statistika = async () => {
        try {
            const res = await axios.get(`https://test.bariqmbani.me/api/v1/statistik?select=Kemendagri,Kemenko PMK,Kemenpan RB,Kemenko Maritim,Kemenko Polhukam,Kemenko Perekonomian&type=gnrm`)
            console.log(res.data.statistik)
        }
        catch (err) {
            console.log(err)  
        }  
    }

    const getDocumentCard = async () => {
        try {
            const res = await axios.get(`https://test.bariqmbani.me/api/v1/infografis?status=true&limit=2&page=${page}&instansi=${nama_instansi}`)
            setDocumentCard(res.data.infografis)
        }
        catch (err) {
            console.log(err)  
        }  
    }

    const onChange = (e) => {
        setFilterCard({...filterCard,[e.target.name]:e.target.value})
    }
    const { pathname } = useLocation();

    useEffect(() =>{
        Statistika()
        getAllDocument()
        getDocumentCard()
        getDocumentCardLength()
    },[filterCard])

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    
    const [instansi, setInstansi] = useState([])

    useEffect(() => {
        axios.get('https://test.bariqmbani.me/api/v1/instansi')
        .then(res => {
            setInstansi(res.data.instansi)
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
        if(page < (documentCardLenght && documentCardLenght.length / 2)) {
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
      
    let tanggal = new Date(Date.now())
    let bulans = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][tanggal.getMonth()];
    const [ bulan , setBulan ] = useState('')

    useEffect(() => {
        setBulan(bulans)
    }, [])
    const onChangeBulan = (e) => {
        return setBulan(e.target.value)
    }
        return(
            <Fragment>
                <Topbar kunci={true}/>
                    <div className="home" style={{margin:'0'}}>
                        <div className="home-section-1">
                            {
                                datas.post.slice((datas.post.length - 7)).map((data, index) => {
                                // documents.slice((documents.length - 7)).map((document, index) => {
                                //     const i = document.gambar.map(infografis => `https://test.bariqmbani.me${infografis.path}`)
                                //     console.log(i)
                                    return (
                                        <Fragment>
                                            <div key={index} className={hidden[index] ? "home-pic" : "d-none"} style={{height:'768px'}}>
                                                <div style={{backgroundColor:'rgba(0,0,0,0.4)', width:'100%' , height:'768px',  position:'absolute'}}>
                                                </div>
                                                    <img src={data.img} style={{width: '100%' , height: '768px'}}/>
                                                
                                            </div>
                                        </Fragment>
                                        );
                                    })
                            }

                            <div className="home-desc">
                                {
                                    datas.post.slice((datas.post.length - 7 )).map((datas,index) => {
                                    // documents.slice((documents.length - 7)).map((document, index) => {
                                    return (
                                            // <ArtikelHome
                                            //     key={index}
                                            //     document={document}
                                            //     hidden={hidden}
                                            //     index={index}
                                            //     tanggal_dibuat={document.tanggal_dibuat}
                                            //     nama_program={document.nama_program}
                                            //     instansi={document.instansi}
                                            //     gnrm_id={document.gnrm_id}    
                                            // />
                                            <ArtikelHome
                                                key={index}
                                                document={datas}
                                                hidden={hidden}
                                                index={index}
                                                tanggal_dibuat={datas.date}
                                                nama_program={datas.title}
                                                instansi={datas.nama}
                                                gnrm_id={index}  />
                                            );
                                        })
                                }


                                <div className="home-other">
                                    {/* {documents.slice((documents.length - 7)).map((document, index) => {
                                        return (
                                            <Link to={'/artikel/'+ (document.gnrm_id)} className={hidden[index] ? "d-none" : "home-other-news"}>
                                                <div key={index}>
                                                    <div className="home-news-logo">
                                                        <img className="logo-bos" src={logo_kemenko} style={{}}/>  
                                                    </div>
        
        
                                                    <div className="home-news-title">
                                                        {document.nama_program}  
                                                    </div>
                                                </div>
                                            </Link>
                                            );
                                        })
                                    } */}
                                    {
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
                                    }

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
                                                <option value="" disabled selected hidden>Pilih Kementerian</option>
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
                                            <select className="filter-a">
                                                <option value="" disabled selected hidden>Pilih Pemerintah Daerah</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="col-8" style={{display:'flex' , flexDirection:'row'}}>
                                        {
                                            datas.post.slice(6).map((doc, index) => {
                                                return (
                                                    // <Card key={index}
                                                    // doc={doc}/>
                                                    <Card/>
                                                    );
                                                })
                                        }
                                    <div className="button-home-prev" style={{top:'200px'}} onClick={onPrevFilter}>
                                        <i className="material-icons" style={{fontSize:'16px' , lineHeight:'24px'}}>arrow_back</i>
                                    </div>
                                    <div className="button-home-next" style={{top:'200px' , right:'-47px'}} onClick={onNextFilter}>
                                        <i className="material-icons" style={{fontSize:'16px' , lineHeight:'24px'}}>arrow_forward</i>
                                    </div>
                                    </div>
                                </div>
                            </div>
                            <svg id='curve' data-name='layer 1' xmlns='http://www/w3/org/2000/svg' viewBox=" 0 0 1416.99 174.01"><defs>
                                    <style></style></defs><path style={{fill: '#59CBA6'}} className='cls-1' d='M0,280.8S283.66,59,608.94,163.56s437.93,150.57,808,10.34V309.54H0V280.8Z' transform='translate(0-135.53)'></path></svg>
                        </div>

                        <div className="home-section-2">
                            <div>
                                <div className="home-section-2-title" style={{display:'inline-block', position:'absolute'}}>
                                    Statistik Bulan {bulan}
                                </div>
                                <select className="reminder-tujuan" type="text" name="bulan" onChange={onChangeBulan} style={{display:'inline-block', marginLeft:'1000px', borderRadius:'10px' , width: '212px' , height: '56px'}}>
                                    <option defaultValue='' hidden></option>
                                    <option value="Januari">Januari</option>
                                    <option value="Februari">Februari</option>
                                    <option value="Maret">Maret</option>
                                    <option value="April">April</option>
                                    <option value="Mei">Mei</option>
                                    <option value="Juni">Juni</option>
                                    <option value="Juli">Juli</option>
                                    <option value="Agustus">Agustus</option>
                                    <option value="September">September</option>
                                    <option value="Oktober">Oktober</option>
                                    <option value="November">November</option>
                                    <option value="Desember">Desember</option>

                                </select>
                            </div>
                            <div className="home-statistik">
                                <Bar
                                    data={data}
                                    width={10}
                                    height={445}
                                    options={{
                                        maintainAspectRatio: false
                                    }}
                                />
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
                                    Gallery
                                </div>
                                
                                <Gallery/>
                                
                                <Link to='/gallery'>
                                <button className="button-lihat-gallery">
                                    LIHAT GALLERY LAINNYA
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