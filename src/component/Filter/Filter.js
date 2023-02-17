import React, { Fragment, useContext, useState, useEffect, useRef } from 'react';
import './Filter.css';
import axios from 'axios';
import { AuthContext } from '../../context/Auth/AuthContext.js';
import searchIcon from '../../assets/search_icon.png';

const Filter = (props) => {
  const { token, user } = useContext(AuthContext);
  const [kpOptions, setKpOptions] = useState([]);
  const [suggestionOpen, setSuggestionOpen] = useState(false);

  const onChange = (e) => {
    return props.setFilterDoc({
      ...props.filterDoc,
      [e.target.name]: e.target.value,
    });
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

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  useEffect(() => {
    (async () => {
      const proyekData = await axios.get(
        'http://api.simonev.revolusimental.go.id:8882/api/v1/proyek',
      );

      const { proyek } = proyekData.data;

      setKpOptions(proyek && proyek.map((proyek) => proyek.kp));
    })();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    props.getDocument();
  };

  // const suggestion = [
  //   { suggest: 'Kesatuan Kesatuan Kesatuan Kesatuan Kesatuan Kesatuan Kesatuan' },
  //   { suggest: 'Kemana ya' },
  //   { suggest: 'Tidak Bisa' },
  //   { suggest: 'Oposisi' },
  //   { suggest: 'Kesatuan Opini Kedua' },
  // ];

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
            autoComplete='off'
            autoCorrect='off'
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
                    {item.length > 30 ? `${item.substr(0, 31)}...` : item}
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

export default Filter;
