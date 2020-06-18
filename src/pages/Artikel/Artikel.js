import React,{Fragment,Component,useContext,useEffect,useState} from 'react';
import './Artikel.css';
import axios from 'axios'
import Topbar from '../../component/Topbar/Topbar';
import logo_kemenko2 from '../../assets/logo_kemenko2.png';
import Footer from '../../component/Footer/Footer';
import { InfografisContext } from '../../context/Infografis/InfografisContext';


const Artikel = (props) => {
    const { infografisDetail, setInfografis } = useContext(InfografisContext)
    const [ gambar , setGambar ] = useState([]); 
    const [ infografisRelated, setInfografisRelated] = useState([])
    
    const tanggal = new Date(infografisDetail && infografisDetail.tanggal_dibuat)
    let hari = tanggal.getDate()
    let bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][tanggal.getMonth()];
    let tahun = tanggal.getFullYear()

    let tanggalFix = `${hari} ${bulan} ${tahun}`

    const download = async () => {
        setTimeout(() => {
            const response = {
                file: `https://api.simonev.revolusimental.go.id/api/v1/infografis/${props.match.params.id}/download`
            }
            window.open(response.file)
        }, 100)
        
        // try {
        //     await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/infografis/${props.match.params.id}/download`)
        // }
        // catch (err) {
        //     console.log(err)
        // }
    }

    const onDownload = (e) => {
        e.preventDefault()
        download()
    }

    useEffect(() => {
        setInfografis(props.match.params.id)
    },[])

    useEffect(() => {
        const wow = infografisDetail && infografisDetail.gambar.map(infografis => `https://api.simonev.revolusimental.go.id${infografis.path}`)
        setGambar(wow)
    },[infografisDetail])

    console.log(gambar)

        return(
            <Fragment>
                <Topbar kunci={false}/>
                    <div className="artikel-container">
                        <div className="judul-artikel">
                            {infografisDetail && infografisDetail.nama_program}
                            <div className="logo-artikel">
                                <img src={logo_kemenko2} style={{width:'90px',height:'85.5px'}}/>
                            </div>
                        </div>
                        <div className="card-artikel">
                            {
                                gambar && gambar.map((gambar,index) => {
                                    return(
                                        <img className='gambar-infografis' src={gambar} alt='infografis' key={index}></img>
                                    )
                                })
                            }
                        </div>
                        <div className="nama-artikel">
                            {infografisDetail && infografisDetail.diunggah_oleh}
                            <div className="tanggal-artikel">
                                {tanggalFix}
                            </div>
                        </div>
                    </div>

                    <div className="artikel-body">
                        <div className="artikel-text">
                            {infografisDetail && infografisDetail.penjelasan_kegiatan}
                        </div>

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
                        <div className="artikel-terkait-head">
                            Infografis Terkait
                        </div>

                        <div className="artikel-terkait-news">
                            <div className="artikel-terkait-card">

                            </div>
                            <div className="artikel-terkait-card">

                            </div>
                            <div className="artikel-terkait-card">

                            </div>
                        </div>
                    </div>
                <Footer/>
            </Fragment>
        )
}

export default Artikel;