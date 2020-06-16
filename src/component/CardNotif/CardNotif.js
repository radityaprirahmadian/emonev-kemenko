import React from 'react';
import avatar from '../../assets/avatar.png'

const CardNotif = (props) => {
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
        <div className="notifikasi-card-body">
            <div className="notifikasi-photo">
                <img src={avatar}/>
            </div>
            <div className="notifikasi-detail">
                <p className="judul-notifikasi">{props.judul}</p>
                <div className="isi-notifikasi">
                    <h1>
                        {props.isi}
                    </h1>
                </div>
                <div className="pengirim-notifikasi">
                    <h1>{props.nama} dari <span>{props.dari}</span></h1>
                    <div className="tanggal-notifikasi">
                        <h1>{str}</h1>
                    </div>
                </div>
            </div>
        </div> 
    )
}

export default CardNotif