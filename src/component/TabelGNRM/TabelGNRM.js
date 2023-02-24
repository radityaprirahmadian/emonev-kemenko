import React, { Component, Fragment, useContext, useState, useEffect } from 'react';
import { ArtikelContext } from '../../context/Artikel/artikelContext';
import { AuthContext } from '../../context/Auth/AuthContext';
import './TabelGNRM.css';
import { useHistory } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import download from '../../assets/download.png';
import edit from '../../assets/edit.png';
import hapus from '../../assets/delete.png';
import Download from './Download';
import Pagination from '../Pagination/Pagination';

const TabelGNRM = (props) => {
  const { user } = useContext(AuthContext);
  const { getDocumentDetail, documentDetail, resetDocument, editDocument } =
    useContext(ArtikelContext);
  const history = useHistory();
  const [hapuss, setHapus] = useState(false);
  const id = props.id;
  const type = 'gnrm';

  const onClickEdit = () => {
    resetDocument();
    history.push(`./formulir-gnrm-edit/${props.id}`);
  };

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
              Apakah anda yakin akan menghapus <br /> program ini?
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
        <td>
          {props.nama_gerakan.length > 78
            ? `${props.nama_gerakan.substr(0, 75)}...`
            : props.nama_gerakan}
        </td>
        <td>
          {props.nama_program.length > 78
            ? `${props.nama_program.substr(0, 75)}...`
            : props.nama_program}
        </td>
        <td className={user && user.role === 'owner' ? '' : 'd-none'}>{props.instansi}</td>
        <td>
          {props.pihak.map((pihak, index) => {
            return <h1 key={index}>{pihak.lembaga}</h1>;
          })}
        </td>
        <td>{props.pejabat}</td>
        <td>
          <Download id={props.id} />
        </td>
        <td>
          <button className="button-download" style={{ backgroundColor: 'white' }}>
            <img src={edit} onClick={onClickEdit} />
          </button>
        </td>
        <td>
          <button className="button-download" style={{ backgroundColor: 'white' }}>
            <img src={hapus} onClick={onDelete} />
          </button>
        </td>
      </tr>
    </Fragment>
  );
};

export default TabelGNRM;
