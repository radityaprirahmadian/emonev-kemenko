import React, { Component, Fragment, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import logo_simonev_1 from '../../assets/logo_simonev_1.png';
import logo_kemenko from '../../assets/logo_kemenko.png';
import './Topbar.css';
import { BrowserRouter, Route, Link, Switch, NavLink } from 'react-router-dom';
import gif_logo from '../../assets/fix_logo_gif.gif';
import $ from 'jquery';
import { AuthContext } from '../../context/Auth/AuthContext';
import Megamenu from '../../component/MegaMenu/MegaMenu';
import KabarMegaMenu from '../../component/KabarMegaMenu/KabarMegaMenu';
import { LayoutContext } from '../../context/Layout/LayoutContext';

// const Bawa = props.kunci;

const Topbar = (props) => {
  const { isAuthenticated, token, loadUser, userDetail } = useContext(AuthContext);
  const { megamenu, setMegamenuHide, setMegamenuShow } = useContext(LayoutContext);

  const [instansi, setInstansi] = useState([]);
  const [documents, setDocuments] = useState([]);
  const getAllDocument = async () => {
    try {
      const res = await axios.get(
        `http://api.simonev.revolusimental.go.id:8882/api/v1/infografis?status=true`,
      );
      setDocuments(res.data.infografis);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (token) {
      loadUser();
    }
  }, [token]);

  useEffect(() => {
    axios
      .get('http://api.simonev.revolusimental.go.id:8882/api/v1/pelaksanaan')
      .then((res) => {
        setInstansi(res.data.instansi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  $(window).on('scroll', function () {
    if ($(window).scrollTop() > 50) {
      $('.top-bar').addClass('scroll');
    } else {
      $('.top-bar').removeClass('scroll');
    }
  });

  const onTop = (e) => {
    window.scrollTo(0, 0);
  };

  return (
    <Fragment>
      <header className={props.kunci ? 'top-bar' : 'top-bar-default'}>
        <nav className="top-bar-navigation">
          <div className="top-bar-logo">
            <NavLink exact to="/" activeClassName="active" onClick={onTop}>
              <img src={gif_logo} alt="logo kemenko" className="logo-kemenko" />
            </NavLink>
          </div>

          <div className="spacer" />

          <div className="top-bar-menu">
            <ul>
              <li className="top-bar-menu-1">
                <NavLink exact to="/" activeClassName="active">
                  <div className="top-bar-menu-container">Beranda</div>
                </NavLink>
              </li>

              <li className="top-bar-menu-2">
                {/* <NavLink to="/artikel" activeClassName="active"> */}
                <div className="top-bar-menu-container no-2">
                  Pelaksanaan GNRM
                  <span style={{ marginLeft: '10px' }}>
                    <i className="fa fa-angle-down"></i>
                  </span>
                  <div className="jarak"></div>
                  <div className={megamenu ? 'sub-menu-hover active' : 'sub-menu-hover'}>
                    <div className="menu-kementrian" onMouseOver={setMegamenuHide}>
                      <ul>
                        {instansi.map((instansi, index) => {
                          return (
                            <li key={instansi._id} className="menu-1-kementrian">
                              {instansi.nama_pendek.length > 25 ? (
                                <div
                                  className="nama-instansi-megamenu"
                                  style={{ paddingTop: '10px', top: '-10px' }}
                                >
                                  <a>{instansi.nama_pendek}</a>
                                </div>
                              ) : (
                                <Fragment>
                                  {instansi.nama_pendek.length > 15 ? (
                                    <div
                                      className="nama-instansi-megamenu"
                                      style={{ paddingTop: '20px', top: '-20px' }}
                                    >
                                      <a>{instansi.nama_pendek}</a>
                                    </div>
                                  ) : (
                                    <div className="nama-instansi-megamenu">
                                      <a>{instansi.nama_pendek}</a>
                                    </div>
                                  )}
                                </Fragment>
                              )}
                              {instansi.logo ? (
                                <div className="logo-megamenu">
                                  <img
                                    src={`http://api.simonev.revolusimental.go.id:8882${instansi.logo}`}
                                    className="logo-in-megamenu"
                                    alt="logo"
                                  />
                                </div>
                              ) : (
                                <div className="logo-megamenu">
                                  <img src={logo_kemenko} className="logo-in-megamenu" alt="logo" />
                                </div>
                              )}
                              <div className="sub-menu-kementrian">
                                <div className="topbar-kabar">
                                  <div className="topbar-kabar-head">
                                    <h1 className="topbar-head-head">KABAR GNRM</h1>
                                  </div>
                                  <ul className="topbar-kabar-ul">
                                    {instansi.kabar.map((kabar, index) => {
                                      return <KabarMegaMenu key={index} kabar={kabar} />;
                                    })}
                                  </ul>
                                </div>
                                <div className="topbar-program">
                                  {instansi.gerakan ? (
                                    <div className="topbar-kabar-head">
                                      <h1 className="topbar-head-head">
                                        {instansi.gerakan.toUpperCase()}
                                      </h1>
                                    </div>
                                  ) : (
                                    <div className="topbar-kabar-head">
                                      <h1 className="topbar-head-head"></h1>
                                    </div>
                                  )}
                                  <ul className="topbar-program-ul">
                                    {instansi.gnrm
                                      .filter((gnrm) => gnrm.form.kegiatan.nama_program !== '')
                                      .map((gnrm, index) => {
                                        return <Megamenu key={index} gnrm={gnrm} />;
                                      })}
                                  </ul>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* </NavLink> */}
              </li>

              <li className="top-bar-menu-3">
                {isAuthenticated && userDetail ? (
                  userDetail && !userDetail.login_awal ? (
                    <NavLink
                      to={`/${
                        userDetail && userDetail.role === 'owner' ? 'super-admin' : 'admin'
                      }/dashboard`}
                      activeClassName="active"
                    >
                      <div className="top-bar-menu-container">E-Report</div>
                    </NavLink>
                  ) : (
                    <NavLink to="/login" activeClassName="active">
                      <div className="top-bar-menu-container">E-Report</div>
                    </NavLink>
                  )
                ) : (
                  <NavLink to="/login" activeClassName="active">
                    <div className="top-bar-menu-container">E-Report</div>
                  </NavLink>
                )}
              </li>
            </ul>
          </div>

          <div className="spacer" />

          <div className="top-bar-logo-simonev">
            <img src={logo_simonev_1} alt="logo kemenko" className="logo-simonev" />
          </div>
        </nav>
      </header>
    </Fragment>
  );
};

export default Topbar;
