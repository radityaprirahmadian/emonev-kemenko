import React , {Fragment} from 'react'
import avatar from '../../assets/avatar.png';

const CardPopup = (props) => {

    const addZero = (i) => {
        if (i < 10) {
          i = "0" + i;
        }
        return i;
    }

    const mydate = new Date(props.jadwal);
    const hour = addZero(mydate.getHours());
    const minute = addZero(mydate.getMinutes());
    const date = mydate.getDate();
    let month = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][mydate.getMonth()];
    let str = date + ' ' + month + ' ' + mydate.getFullYear() + ' , ' + hour + ':' + minute;

    return(
        <Fragment>
            <div className='card-popup' style={{borderBottom:'2px solid rgba(0,0,0,0.2)' , padding:'10px'}}>
                <div className="notifikasi-photo" style={{margin: '0px'}}>
                    <img src={avatar}/>
                </div>
                <div className='card-popup-body'>
                    <div className='card-popup-isi'>{props.nama} dari <span style={{fontWeight:'700'}}>{props.dari}</span> memberi pesan kepada anda</div><br/>
                    <div className='card-popup-tanggal'>{str}</div>
                </div>
            </div>
        </Fragment>
    )
}

export default CardPopup;