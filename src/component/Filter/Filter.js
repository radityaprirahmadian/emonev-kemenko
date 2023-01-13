import React, { Fragment, useContext, useState, useEffect } from 'react';
import './Filter.css';
import axios from 'axios';
import { AuthContext } from '../../context/Auth/AuthContext.js';
import searchIcon from '../../assets/search_icon.png';

const Filter = (props) => {
  const { token, user } = useContext(AuthContext);
  const [kpOptions, setKpOptions] = useState([]);
  const [keyword, setKeyword] = useState('');

  const onChange = (e) => {
    return props.setFilterDoc({
      ...props.filterDoc,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    (async () => {
      const proyekData = await axios.get('https://api.simonev.revolusimental.go.id/api/v1/proyek');

      const { proyek } = proyekData.data;

      setKpOptions(proyek && proyek.map((proyek) => proyek.kp));
    })();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    props.getDocument();
  };

  return (
    <Fragment>
      <div className="filter-container pelaporan">
        <div className="pelaporan-search">
          <img src={searchIcon} alt="search"></img>
          <input
            value={keyword}
            placeholder="Cari nama laporan"
            onChange={(e) => setKeyword(e.target.value)}
          ></input>
        </div>
        <div className="filter-tahun">
          <label className="nama-filter">Tahun</label>
          <select className="input-filter-tahun" name="tahun" onChange={onChange}>
            <option defaultValue="" hidden></option>
            <option value="">Semua</option>
            {props.filterValue &&
              props.filterValue.tahun &&
              props.filterValue.tahun
                .filter((filter) => filter !== '')
                .map((tahun, index) => {
                  return (
                    <option value={tahun} key={index}>
                      {tahun}
                    </option>
                  );
                })}
          </select>
        </div>
        {user && user.role === 'owner' ? (
          <div className="filter-instansi">
            <label className="nama-filter">Instansi</label>
            <select className="input-filter-instansi" name="instansi" onChange={onChange}>
              <option value="" defaultValue="" hidden></option>
              <option value="">Semua Instansi</option>
              {props.filterValue &&
                props.filterValue.instansi &&
                props.filterValue.instansi
                  .filter((filter) => filter !== '')
                  .map((instansi, index) => {
                    return (
                      <option key={index} value={instansi}>
                        {instansi}
                      </option>
                    );
                  })}
            </select>
          </div>
        ) : (
          ''
        )}
        <div className="filter-pelaporan">
          <label className="nama-filter">Kegiatan Prioritas</label>
          <select className="input-filter-pelaporan" name="kp" onChange={onChange}>
            <option defaultValue="" hidden></option>
            <option value="">Semua</option>
            {kpOptions &&
              kpOptions.map((kp, index) => {
                return (
                  <option key={index} value={kp}>
                    {kp.length > 50 ? `${kp.substr(0, 47)}...` : kp}
                  </option>
                );
              })}
          </select>
        </div>

        <button className="button-submit-filter-admin" onClick={onSubmit}>
          FILTER
        </button>
      </div>
    </Fragment>
  );
};

export default Filter;
