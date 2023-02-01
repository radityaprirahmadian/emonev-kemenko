import React, { Component, Fragment, useState, useEffect, useContext, useRef } from 'react';
import '../Filter/Filter.css';
import axios from 'axios';
import { AuthContext } from '../../context/Auth/AuthContext.js';
import searchIcon from '../../assets/search_icon.png';

const FilterMonev = (props) => {
  const { token, user } = useContext(AuthContext);
  const [keyword, setKeyword] = useState('');
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  const onChange = (e) => {
    return props.setFilterDoc({
      ...props.filterDoc,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    props.getDocument();
  };

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setSuggestionOpen(false);
        }
      }
      // Bind the event listener
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  }

  return (
    <Fragment>
      <div className="filter-container pelaporan">
        <div
          className="pelaporan-search"
          ref={wrapperRef}
          // onBlur={() => setTimeout(setSuggestionOpen(false), 10000)}
        >
          <img src={searchIcon} alt="search"></img>
          <input
            value={props.filterDoc.keyword}
            name="keyword"
            placeholder="Cari nama laporan"
            onChange={(e) => onChange(e)}
            onFocus={() => setSuggestionOpen(true)}
            // onBlur={() => setSuggestionOpen(false)}
          ></input>
          {suggestionOpen && (
            <div className="suggestion-laporan">
              {props.suggestion.map((item, index) => {
                return (
                  <div
                    className="item"
                    key={index}
                    onClick={() => {
                      onChange({ target: { name: 'keyword', value: item } });
                      setSuggestionOpen(false);
                    }}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          )}
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

        <div className="filter-pelaporan">
          <label className="nama-filter">Periode Pelaporan</label>
          <select className="input-filter-pelaporan" name="periode" onChange={onChange}>
            <option defaultValue="" hidden></option>
            <option value="">Semua</option>
            {props.filterValue &&
              props.filterValue.periode &&
              props.filterValue.periode
                .filter((filter) => filter !== '')
                .map((periode, index) => {
                  return (
                    <option key={index} value={periode}>
                      {periode}
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

        <button className="button-submit-filter-admin" onClick={onSubmit}>
          FILTER
        </button>
      </div>
    </Fragment>
  );
};

export default FilterMonev;
