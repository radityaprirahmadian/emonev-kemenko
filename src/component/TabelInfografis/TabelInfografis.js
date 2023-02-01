import React, { Component, Fragment, useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/Auth/AuthContext';
import download from '../../assets/download.png';
import edit from '../../assets/edit.png';
import hapus from '../../assets/delete.png';
import upload from '../../assets/upload.png';
import preview from '../../assets/preview.png';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { InfografisContext } from '../../context/Infografis/InfografisContext';

const TabelInfografis = (props) => {
  const { setInfografis } = useContext(InfografisContext);
  const { user, userDetail } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [galleriIndex, setGalleriIndex] = useState(0);
  const [gambar, setGambar] = useState([]);
  const [hapuss, setHapus] = useState(false);

  const history = useHistory();

  const onClickEdit = () => {
    history.push(
      `/${
        userDetail && userDetail.role === 'owner' ? 'super-admin' : 'admin'
      }/formulir-kabar-gnrm-edit/${props.id}`,
    );
  };

  const onOpen = (e) => {
    e.preventDefault();
    setOpen(true);
    const gams = props.gambar.map(
      (gambar) => `http://api.simonev.revolusimental.go.id:8882${gambar.path}`,
    );
    setGambar(gams);
  };

  const tahun1 = new Date(props.tanggal);
  const tahun = tahun1.getFullYear();

  const onDelete = (e) => {
    e.preventDefault();
    setHapus(true);
  };

  const onHapus = (e) => {
    e.preventDefault();
    props.delete(props.id);
    setHapus(false);
  };

  const onTidakHapus = (e) => {
    e.preventDefault();
    setHapus(false);
  };

  return (
    <Fragment>
      {hapuss ? (
        <div
          style={{
            position: 'fixed',
            top: '0',
            bottom: '0',
            left: '0',
            right: '0',
            zIndex: '9998',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}
        >
          <div
            className="popup_delete"
            style={{
              width: '400px',
              height: '300px',
              borderRadius: '10px',
              padding: '28px',
              zIndex: '9998',
              backgroundColor: 'white',
              position: 'fixed',
              top: '20%',
              left: '40%',
            }}
          >
            <h1
              style={{
                textAlign: 'center',
                fontWeight: '700',
                marginBottom: '32px',
                fontSize: '18px',
              }}
            >
              Konfirmasi
            </h1>
            <br />
            <h1
              style={{
                fontSize: '18px',
                textAlign: 'center',
                fontWeight: 'normal',
                lineHeight: '20px',
              }}
            >
              Apakah anda yakin akan menghapus <br /> kabar GNRM ini?
            </h1>
            <div style={{ marginTop: '30px', textAlign: 'center' }}>
              <button
                onClick={onHapus}
                className="preview-gnrm"
                style={{
                  width: '294px',
                  fontSize: '24px',
                  height: '50px',
                  borderRadius: '20px',
                  backgroundColor: '#D4362E',
                  color: 'white',
                  marginBottom: '16px',
                  boxShadow: 'none',
                }}
              >
                Ya
              </button>
              <br />
              <button
                onClick={onTidakHapus}
                className="preview-gnrm"
                style={{
                  width: '294px',
                  fontSize: '24px',
                  height: '50px',
                  borderRadius: '20px',
                  backgroundColor: '#E9E9E9',
                  color: '#656A6A',
                  boxShadow: 'none',
                }}
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
      <tr>
        <td>{props.tahun}</td>
        <td>{props.judul}</td>
        <td className={user && user.role === 'owner' ? '' : 'd-none'}>{props.instansi}</td>
        <td>
          <button className="button-download">
            <img src={preview} onClick={onOpen} />
          </button>
          {open ? (
            <Lightbox
              mainSrc={gambar[galleriIndex]}
              nextSrc={gambar[(galleriIndex + 1) % gambar.length]}
              prevSrc={gambar[(galleriIndex + gambar.length - 1) % gambar.length]}
              onCloseRequest={() => setOpen(false)}
              onMovePrevRequest={() =>
                setGalleriIndex((galleriIndex + gambar.length - 1) % gambar.length)
              }
              onMoveNextRequest={() => setGalleriIndex((galleriIndex + 1) % gambar.length)}
            />
          ) : (
            ''
          )}
        </td>
        <td>
          <button className="button-download">
            <img src={edit} onClick={onClickEdit} />
          </button>
        </td>
        <td>
          <button className="button-download">
            <img src={hapus} onClick={onDelete} />
          </button>
        </td>
      </tr>
    </Fragment>
  );
};

export default TabelInfografis;
