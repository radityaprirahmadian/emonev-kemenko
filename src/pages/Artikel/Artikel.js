import React,{Fragment,Component,useContext,useEffect,useState} from 'react';
import './Artikel.css';
import axios from 'axios'
import Topbar from '../../component/Topbar/Topbar';
import logo_kemenko2 from '../../assets/logo_kemenko2.png';
import Footer from '../../component/Footer/Footer';
import { InfografisContext } from '../../context/Infografis/InfografisContext';
import {Link} from 'react-router-dom'
import Spinner from '../../component/Spinner/Spinner'

const Artikel = (props) => {
    const { infografisDetail, setInfografis, loading, setLoadingFalse, setLoadingTrue } = useContext(InfografisContext)
    const [ gambar , setGambar ] = useState([]); 
    const [ gambarIndex , setGambarIndex] = useState(0)
    const [ logo , setLogo] = useState();
    const [ infografisRelated, setInfografisRelated] = useState([])
    
    const tanggal = new Date(infografisDetail && infografisDetail.tanggal_dibuat)
    let hari = tanggal.getDate()
    let bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][tanggal.getMonth()];
    let tahun = tanggal.getFullYear()

    let tanggalFix = `${hari} ${bulan} ${tahun}`

    const getAllDocument = async () => {
        try {
                const res = await axios.get(`https://test.bariqmbani.me/api/v1/kabar?instansi=${infografisDetail&&infografisDetail.instansi.nama_pendek}`)
                setInfografisRelated(res.data.kabar.filter(info => info._id !== props.match.params.id))
                console.log(res.data.kabar)
        }
        catch (err) {
            console.log(err)  
        }  
    }
    const download = async () => {
        setTimeout(() => {
            const response = {
                file: `https://test.bariqmbani.me/api/v1/kabar/${props.match.params.id}/download`
            }
            window.open(response.file)
        }, 100)
    }

    const onNext = (e) => {
        e.preventDefault()
        setLoadingTrue()
        if(gambarIndex < (gambar && gambar.length - 1)){
            setGambarIndex(gambarIndex+1)
            console.log(gambarIndex)
            setLoadingFalse()
        }
    }

    const onPrev = (e) => {
        e.preventDefault()
        setLoadingTrue()
        if(gambarIndex > 0){
            setGambarIndex(gambarIndex-1)
            console.log(gambarIndex)
            setLoadingFalse()
        }
    }

    const onDownload = (e) => {
        e.preventDefault()
        download()
    }

    useEffect(() => {
        setInfografis(props.match.params.id)
    },[props.match.params.id])

    useEffect(() => {
        setLoadingTrue()
        const wow = infografisDetail && infografisDetail.gambar.map(infografis => `https://test.bariqmbani.me${infografis.path}`)
        setGambar(wow)
        setLoadingFalse()
        getAllDocument()
    },[infografisDetail])

    console.log(gambar)

        return(
            <Fragment>
                <Topbar kunci={false}/>
                {
                    loading ? 
                        <div style={{ marginLeft: '68px' }}>
                            <div className="d-flex justify-content-center align-items-center" style={{ width: '100%', height: '60vh', overflow: 'hidden' }}>
                                <Spinner />
                            </div> 
                        </div>
                    :
                        <div className="artikel-container">
                            <div className="judul-artikel">
                                {infografisDetail && infografisDetail.judul}
                                <div className="logo-artikel">
                                    <img src={`https://test.bariqmbani.me${infografisDetail&&infografisDetail.instansi.logo}`} alt='logo_kementerian' style={{width:'90px',height:'85.5px'}}/>
                                </div>
                            </div>
                            <div className="card-artikel">
                                {
                                    gambar && gambar.length > 1 ? 
                                        <Fragment>
                                            <div className="button-artikel-prev" onClick={onPrev}>
                                                <i className="material-icons" style={{fontSize:'16px' , lineHeight:'24px'}}>arrow_back</i>
                                            </div>
                                            <div className="button-artikel-next" onClick={onNext}>
                                                <i className="material-icons" style={{fontSize:'16px' , lineHeight:'24px'}}>arrow_forward</i>
                                            </div>
                                        </Fragment>
                                        :
                                        ''
                                }
                                        <img className='gambar-infografis' src={gambar&&gambar[gambarIndex]} alt='infografis' ></img>
                            </div>
                            <div className="nama-artikel">
                                {infografisDetail && infografisDetail.diunggah_oleh}
                                <div className="tanggal-artikel">
                                    {tanggalFix}
                                </div>
                            </div>
                        </div>
                }

                    <div className="artikel-body">
                    {
                        loading ? 
                            <div style={{ marginLeft: '68px' }}>
                                <div className="d-flex justify-content-center align-items-center" style={{ width: '100%', height: '60vh', overflow: 'hidden' }}>
                                    <Spinner />
                                </div> 
                            </div>
                        :
                            <div className="artikel-text">
                                {infografisDetail && infografisDetail.deskripsi}
                            </div>
                    }
                        <div className="artikel-media">
                            <div className="artikel-unduh" onClick={onDownload}>
                                Unduh Artikel
                            </div>

                            <div className="spacer"></div>

                            <div className="artikel-social">
                            <ul>
                                            <li>
                                                <a href="https://www.facebook.com/KemenkopmkRI" target="_blank">
                                                    <div className="artikel-social-media-logo">
                                                        <i className='fab fa-facebook-f' style={{fontSize:'18px'}}></i> 
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="https://twitter.com/kemenkopmk" target="_blank">
                                                    <div className="artikel-social-media-logo">
                                                        <i className='fab fa-twitter' style={{fontSize:'18px'}}></i> 
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="https://instagram.com/kemenko_pmk" target="_blank">
                                                    <div className="artikel-social-media-logo">
                                                        <i className='fab fa-instagram' style={{fontSize:'18px'}}></i> 
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="https://www.youtube.com/channel/UCS_4jzQs7bywNQrJ-AmoWVg/channels" target="_blank">
                                                    <div className="artikel-social-media-logo">
                                                        <i className='fab fa-youtube' style={{fontSize:'18px'}}></i> 
                                                    </div>
                                                </a>
                                            </li>
                                        </ul>
                            </div>
                        </div>
                    </div>

                    <div className="artikel-terkait">
                        {
                            infografisRelated.length > 0 ?
                            <Fragment>
                                <div className="artikel-terkait-head">
                                    Infografis Terkait
                                </div>
                                    
                                <div className="artikel-terkait-news">
                                    {
                                        infografisRelated.slice(0,3).map((info,index) => {
                                            const wow = info.gambar.map(infografis => `https://test.bariqmbani.me${infografis.path}`)
                                            return(
                                                <Link to={`/artikel/${info._id}`}>
                                                    <div className="artikel-terkait-card">
                                                        <div style={{backgroundColor:'rgba(0,0,0,0.4)' , width:'300px' , height:'150px' , position:'absolute'}}></div>
                                                        <img src={wow[0]} alt='infografis-terkait' style={{width:'300px' , height:'150px'}}/>
                                                        <img src={`https://test.bariqmbani.me${info.instansi.logo}`} alt='infografis-logo-instansi' style={{width:'75px' , height: '75px', position:'absolute' , top: '5px' , left:'5px'}}/>
                                                        <div style={{fontSize:'14px', color:'white', fontWeight:'600' ,position:'absolute' , bottom : '5px' , left: '10px' , width:'250px' , height:'20px' , lineHeight: '20px'}} >{info.judul.length > 30 ? `${info.judul.substr(0, 27)}...` : info.judul}</div>
                                                    </div>
                                                </Link>
                                            )
                                        })
                                    }
                                </div>
                            </Fragment>
                        :
                            <div className="artikel-terkait-head">
                                Tidak Ada Infografis Terkait
                            </div>
                        }
                    </div>
                <Footer/>
            </Fragment>
        )
}

export default Artikel;