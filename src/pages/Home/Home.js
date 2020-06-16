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


const data = {
    labels: ['KEMENPAN', `KEMENKO POLHUKAM`, 'KEMENKO MARITIM', 'KEMENKO PEREKONOMIAN', 'KEMENDAGRI', 'KEMENKO PMK'],
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

const Home = () => {
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

    const { pathname } = useLocation();

    useEffect(() =>{
        getAllDocument()
    },[])

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    

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
        }, 2000);
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
                                            Filter Kementrian
                                        </div>

                                        <div className="section-4-filter">
                                            <select className="filter-a">
                                                <option value="" disabled selected hidden>Pilih Kementrian</option>
                                                <option value="kemenko-pmk">KEMENKO PMK</option>
                                                <option value="kemenpan">KEMENPAN</option>
                                                <option value="kemenko-polhukam">KEMENKO POLHUKAM</option>
                                                <option value="kemenko-maritim">KEMENKO MARITIM</option>
                                                <option value="kemenko-perekonomian">KEMENKO PEREKONOMIAN</option>
                                                <option value="kemendagri">KEMENDAGRI</option>
                                            </select>
                                            <br/>
                                            <select className="filter-a">
                                                <option value="" disabled selected hidden>Waktu</option>
                                                <option value="triwulan">TRIWULAN</option>
                                                <option value="enambulan">NAMBULAN</option>
                                                <option value="bulanan">BULANAN</option>
                                                <option value="tahunan">TAHUNAN</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="col-8">
                                        {/* {
                                            datas.post.slice(0,7).map((post, index) => {
                                                return (
                                                    <Link to={'/artikel/'+ (post.id)} className={hidden[index] ? "home-other-news" : "d-none"}>
                                                        <Card kunci={post.id}/>
                                                    </Link>
                                                    );
                                                })
                                        } */}
                                        {/* <div style={{ padding: `0 ${chevronWidth}px` }}>
                                            <ItemsCarousel
                                            
                                            requestToChangeActive={setActiveItemIndex}
                                            activeItemIndex={activeItemIndex}
                                            numberOfCards={2}
                                            gutter={20}
                                            leftChevron={<button>{'<'}</button>}
                                            rightChevron={<button>{'>'}</button>}
                                            outsideChevron
                                            chevronWidth={chevronWidth}
                                        >
                                            <div style={{ height: 200, background: '#EEE' }}>First card</div>
                                            <div style={{ height: 200, background: '#EEE' }}>Second card</div>
                                            <div style={{ height: 200, background: '#EEE' }}>Third card</div>
                                            <div style={{ height: 200, background: '#EEE' }}>Fourth card</div>
                                                
                                                
                                            </ItemsCarousel>
                                        </div> */}
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