import React, { useContext, useEffect, useState } from 'react';
import { ArtikelContext } from '../../context/Artikel/artikelContext';
import { PDFDownloadLink } from '@react-pdf/renderer';
import download from '../../assets/download.png';
import DownloadGNRM from '../Download/DownloadGNRM';
import axios from 'axios';

const Download = (props) => {
  const { getDocumentDetail, documentDetail, resetDocument, editDocument } =
    useContext(ArtikelContext);

  const id = props.id;
  const type = 'gnrm';
  const token = localStorage.getItem('token');

  const [document, setDocument] = useState({
    document1: '',
    instansi: '',
  });
  const [show, setHide] = useState(false);

  useEffect(() => {
    const getDocumentDetail = async () => {
      const config = {
        headers: {
          'X-Auth-Token': `Bearer ${token}`,
        },
      };
      try {
        const res = await axios.get(
          `http://api.simonev.revolusimental.go.id:8882/api/v1/document/${id}?type=${type}`,
          config,
        );
        setDocument({
          document1: res.data.document,
          instansi: res.data.instansi,
        });
        setHide(true);
      } catch (err) {
        console.log(err);
      }
    };
    getDocumentDetail();
  }, []);

  return (
    <div>
      {show ? (
        <PDFDownloadLink
          document={<DownloadGNRM data={document} />}
          fileName={`${document.document1.form.kegiatan.nama_program}.pdf`}
        >
          <button className="button-download">
            <img src={download} />
          </button>
        </PDFDownloadLink>
      ) : (
        ''
      )}
    </div>
  );
};

export default Download;
