import React, { Fragment, useState, useEffect } from 'react';
import './FilterAdmin.css';
import axios from 'axios';

const FilterAdmin = (props) => {
  const [allInstansi, setAllInstansi] = useState([]);
  const onChange = (e) => {
    return props.setFilter({
      ...props.filterUser,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    axios
      .get('http://api.simonev.revolusimental.go.id:8882/api/v1/instansi')
      .then((res) => {
        setAllInstansi(res.data.instansi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    props.getUser();
  };

  return (
    <Fragment>
      <div className="filter-container">
        <form id="filter-admin">
          <div className="filter-nama">
            <h6 className="nama-filter">Nama</h6>
            <input
              className="input-filter-nama"
              type="text"
              name="nama"
              value={props.nama}
              onChange={onChange}
            ></input>
          </div>
          <div className="filter-nama-instansi">
            <h6 className="nama-filter">Nama Instansi</h6>
            <select className="input-filter-nama-instansi" name="instansi" onChange={onChange}>
              <option value="" defaultValue="" hidden></option>
              <option value="" defaultValue="">
                Semua
              </option>
              {allInstansi.map((instansi, index) => {
                return (
                  <option key={index} value={instansi.nama_pendek}>
                    {instansi.nama_pendek}
                  </option>
                );
              })}
            </select>
          </div>

          <button className="button-submit-filter" onClick={onSubmit}>
            FILTER
          </button>
        </form>
      </div>
    </Fragment>
  );
};

export default FilterAdmin;
