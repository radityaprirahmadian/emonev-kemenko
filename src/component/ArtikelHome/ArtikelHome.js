import React , {useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import { InfografisContext } from '../../context/Infografis/InfografisContext'

const ArtikelHome = (props) => {
    const {setInfografis } = useContext(InfografisContext)
    const history = useHistory()

    const onClick = (e) => {
        history.push(`./artikel/${props.gnrm_id}`)
    }
    const tanggal = new Date(props.tanggal_dibuat)
    let hari = tanggal.getDate()
    let bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][tanggal.getMonth()];
    let tahun = tanggal.getFullYear()

    let tanggalFix = `${hari} ${bulan} ${tahun}`
    return(
        <div className={props.hidden[props.index] ? "home-news-active" : "d-none"}>
            <div className="home-kementrian">
                {props.instansi}
            </div>
            <div className="home-title">
                {props.nama_program}
            </div>
            <div className="home-date">
                {tanggalFix}
            </div>

            <div className="home-button">
                    <button className="home-button-lanjut" onClick={onClick}>Baca Lebih Lanjut</button>
            </div>
        </div>
    )
}

export default ArtikelHome;