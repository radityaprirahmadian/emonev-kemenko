import React, { Fragment } from 'react';
import avatar from '../../assets/avatar.png';
import profil1 from '../../assets/Profil1.png';
import logo_kemenko from '../../assets/logo_kemenko.png';

const CardPopup = (props) => {
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
    <Fragment>
      <div
        className="card-popup"
        style={{ borderBottom: '2px solid rgba(0,0,0,0.2)', padding: '10px' }}
      >
        <div className="notifikasi-photo" style={{ margin: '0px' }}>
          <div style={{ position: 'relative', marginTop: '7px' }}>
            {props.foto ? (
              <Fragment>
                <div
                  style={{ width: '70px', height: '70px', borderRadius: '50%', overflow: 'hidden' }}
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
                  style={{ width: '30px', height: '30px' }}
                  className="logo-notif"
                />
              </Fragment>
            ) : (
              <Fragment>
                <div
                  style={{ width: '70px', height: '70px', borderRadius: '50%', overflow: 'hidden' }}
                >
                  <img src={profil1} alt="user-avatar" className="avatar-notif" />
                </div>
                <img
                  src={logo_kemenko}
                  alt="user-logo"
                  style={{ width: '30px', height: '30px' }}
                  className="logo-notif"
                />
              </Fragment>
            )}
          </div>
        </div>
        <div className="card-popup-body">
          {props.nama ? (
            <Fragment>
              <div className="card-popup-isi">
                {props.nama} dari <span style={{ fontWeight: '700' }}>{props.dari}</span> memberi
                pesan kepada anda
              </div>
              <br />
            </Fragment>
          ) : (
            <Fragment>
              <div className="card-popup-isi">
                <span style={{ fontWeight: '700' }}>INFO SIMONEV GNRM</span> memberi pesan kepada
                anda
              </div>
              <br />
            </Fragment>
          )}
          <div className="card-popup-tanggal">{str}</div>
        </div>
      </div>
    </Fragment>
  );
};

export default CardPopup;
