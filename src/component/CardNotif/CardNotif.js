import React, { Fragment } from 'react';
import avatar from '../../assets/avatar.png';
import profil1 from '../../assets/Profil1.png';
import logo_kemenko from '../../assets/logo_kemenko.png';

const CardNotif = (props) => {
  const addZero = (i) => {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  };

  const mydate = new Date(props.jadwal);
  const hour = addZero(mydate.getHours());
  const minute = addZero(mydate.getMinutes());
  const date = mydate.getDate();
  let month = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ][mydate.getMonth()];
  let str = date + ' ' + month + ' ' + mydate.getFullYear() + ' , ' + hour + ':' + minute;

  return (
    <div className="notifikasi-card-body">
      <div className="notifikasi-photo">
        <div style={{ position: 'relative', marginTop: '7px' }}>
          {props.foto ? (
            <Fragment>
              <div
                style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden' }}
              >
                <img
                  src={`https://api.simonev.revolusimental.go.id${props.foto}`}
                  alt="user-avatar"
                  className="avatar-notif"
                />
              </div>
              <img
                src={`https://api.simonev.revolusimental.go.id${props.logo}`}
                alt="user-logo"
                className="logo-notif"
              />
            </Fragment>
          ) : (
            <Fragment>
              <div
                style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden' }}
              >
                <img src={profil1} alt="user-avatar" className="avatar-notif" />
              </div>
              <img src={logo_kemenko} alt="user-logo" className="logo-notif" />
            </Fragment>
          )}
        </div>
      </div>
      <div className="notifikasi-detail">
        <p className="judul-notifikasi">{props.judul}</p>
        <div className="isi-notifikasi">
          <h1>{props.isi}</h1>
        </div>
        <div className="pengirim-notifikasi">
          {props.nama ? (
            <Fragment>
              <h1>
                {props.nama} dari <span>{props.dari}</span>
              </h1>
            </Fragment>
          ) : (
            <Fragment>
              <h1 style={{ fontWeight: '700' }}>INFO SIMONEV GNRM</h1>
            </Fragment>
          )}
          <div className="tanggal-notifikasi">
            <h1>{str}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardNotif;
