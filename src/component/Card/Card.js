import React,{Component,Fragment, useEffect, useState, useContext} from 'react';
import './Card.css';
import bg_card from '../../assets/bg_card.png';
import {Link} from 'react-router-dom'
import { AuthContext } from '../../context/Auth/AuthContext';


const Card = (props) => {
    const { token } = useContext(AuthContext)
    const [nama,setNama] = useState('')
    const [gambar,setGambar] = useState([])


    const truncate = (str, n) => {
        return (str.length > n) ? setNama(str.substr(0, n-1) + '...') : setNama(str);
    }

    useEffect(() => {
        truncate(props.doc.nama_program , 30)
        const i = props.doc.gambar.map(infografis => `https://api.simonev.revolusimental.go.id${infografis.path}`)
        setGambar(i)
    },[props])

    const mydate = new Date(props.doc.tanggal_dibuat);
    const date = mydate.getDate();
    let month = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][mydate.getMonth()];
    let tanggal = date + ' ' + month + ' ' + mydate.getFullYear();

    console.log(props)
        return(
            <Fragment>
                <div className="card-container" style={{marginRight:'20px'}}>
                    <div className="top-card">
                        <div className="card-background">
                            <img src={gambar[0]} style={{width:'400px', height:'400px' , overflow:'hidden'}} />
                        </div>
                    </div>

                    <div className="bottom-card">
                        <div className="card-title-bottom">
                            <h4>{nama}</h4>
                        </div>

                        <div className="date-and-button">
                                <div className="card-date">
                                    <h4>{tanggal}</h4>
                                </div>
                                <div className="spacer"></div>
                                {
                                    !token ?
                                        <Link to={`/artikel/` + (props.doc.gnrm_id)}>
                                            <button className="detail-button">
                                                        LIHAT DETAIL
                                            </button>   
                                        </Link>
                                    : ''
                                }
                        </div>
                    </div>
                </div>
        </Fragment>
        );
}

export default Card;