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

    const data = {
        labels: ['Kemendagri', 'Kemenko Maritim', 'Kemenko PMK','Kemenko Perekonomian', `Kemenko Polhukam`, 'Kemenpan RB', ],
        datasets: [
          {
            label: 'Jumlah Program Kementrian',
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
    console.log(documents)

    const getAllDocument = async () => {
        try {
                const res = await axios.get(`https://test.bariqmbani.me/api/v1/infografis`)
                setDocuments(res.data.infografis)
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
    console.log(datak)
    const [documentCard,setDocumentCard] = useState([])
    const [documentCardLenght,setDocumentCardLength] = useState([])
    
    const {
        page,
        nama_instansi
    } = filterCard

    console.log(page)
    console.log(documentCard)

    const getDocumentCardLength = async () => {
        try {
            const res = await axios.get(`https://test.bariqmbani.me/api/v1/infografis?status=false&instansi=${nama_instansi}`)
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
            const res = await axios.get(`https://test.bariqmbani.me/api/v1/infografis?status=false&limit=2&page=${page}&instansi=${nama_instansi}`)
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
      
        return(
            <Fragment>
                <Topbar kunci={true}/>
                    <div className="home">
                        <div className="home-section-1">
                            {
                                documents.slice((documents.length - 7)).map((document, index) => {
                                    return (
                                        <div key={index} className={hidden[index] ? "home-pic" : "d-none"}>
                                            <img src={background} style={{width: '100%' , height: '768px'}}/>
                                        </div>
                                        );
                                    })
                            }

                            <div className="home-desc">
                                {
                                    documents.slice((documents.length - 7)).map((document, index) => {
                                        return (
                                            <ArtikelHome
                                                key={index}
                                                document={document}
                                                hidden={hidden}
                                                index={index}
                                                tanggal_dibuat={document.tanggal_dibuat}
                                                nama_program={document.nama_program}
                                                instansi={document.instansi}
                                                gnrm_id={document.gnrm_id}    
                                            />
                                            );
                                        })
                                }


                                <div className="home-other">
                                    {documents.slice((documents.length - 7)).map((document, index) => {
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

                        <div className="home-section-4">
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
                                            documentCard.map((doc, index) => {
                                                return (
                                                    <Card key={index}
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
                            </div>
                        </div>
                        <div className="home-section-2">
                            <div className="home-section-2-title">
                                Statistik Bulan April
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
                        </div>


                        <div className="home-section-3">
                            <div className="home-section-3-title">
                                Gallery
                            </div>
                            
                            <Gallery/>
                            
                            <Link to='/gallery'>
                            <button className="button-lihat-gallery">
                                LIHAT GALLERY LAINNYA
                            </button>
                            </Link>
                            <Footer/>
                        </div>
                        
                    </div>
                    
  
            </Fragment>
        )
    // }
}

export default Home;