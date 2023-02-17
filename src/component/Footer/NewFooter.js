import React, { useContext } from 'react';
import './Footer.css';

import { AuthContext } from '../../context/Auth/AuthContext';
import { LayoutContext } from '../../context/Layout/LayoutContext';
import './Footer.css';
import line from '../../assets/line.png';
import logo_gabungan from '../../assets/logo_gabungan.png';
import logo_gnrm_1 from '../../assets/logo_link_terkait_1.png';
import { BrowserRouter, Route, Link, Switch, NavLink } from 'react-router-dom';
import logo_kemenko2 from '../../assets/logo_kemenko2.png';
import home from '../../assets/home.png';
import mail from '../../assets/mail.png';
import phone from '../../assets/phone.png';
import facebook from '../../assets/facebook.png';
import subtract from '../../assets/Subtract.png';
import twitter from '../../assets/twitter.png';
import instagram from '../../assets/instagram.png';
import youtube from '../../assets/youtube.png';
import logo_2 from '../../assets/logo2.png';

const NewFooter = () => {
  const { isAuthenticated, userDetail } = useContext(AuthContext);
  const { setMegamenuShow } = useContext(LayoutContext);

  const onTop = (e) => {
    window.scrollTo(0, 0);
  };

  const onClick = () => {
    setMegamenuShow();
  };

  return (
    <div className="footer">
      <div className="left">
        <div className="left-top">
          <div className="title">Menu</div>
          <div className="menu">
            <NavLink exact to="/" activeClassName="active" onClick={onTop}>
              <p>Beranda</p>
            </NavLink>
            <div onClick={onClick}>Pelaksanaan GNRM</div>
            {isAuthenticated && userDetail ? (
              userDetail && !userDetail.login_awal ? (
                <NavLink
                  to={`/${
                    userDetail && userDetail.role === 'owner' ? 'super-admin' : 'admin'
                  }/dashboard`}
                  activeClassName="active"
                >
                  <p>E-Report</p>
                </NavLink>
              ) : (
                <NavLink to="/login" activeClassName="active">
                  <p>E-Report</p>
                </NavLink>
              )
            ) : (
              <NavLink to="/login" activeClassName="active">
                <p>E-Report</p>
              </NavLink>
            )}
          </div>
        </div>
        <div className="left-bottom">
          <div className="title">Social Media</div>
          <div className="social-media">
            <a href="https://www.facebook.com/revolusimental.id/" target="_blank">
              <img src={facebook} alt="facebook" />
              <div>Revolusi Mental</div>
            </a>
            <a href="https://twitter.com/revmen_id" target="_blank">
              <img src={twitter} alt="twitter" />
              <div>@revmen_id</div>
            </a>
            <a href="https://instagram.com/revolusimental_id" target="_blank">
              <img src={instagram} alt="instagram" />
              <div>revolusimental_id</div>
            </a>
            <a href="https://www.youtube.com/channel/UCzpr28gI11BMvaZVCcPx2jw" target="_blank">
              <img src={youtube} alt="youtube" />
              <div>Revolusi Mental</div>
            </a>
          </div>
        </div>
      </div>
      <div className="right">
        <div className="logo">
          <img src={logo_2} alt="Logo Kemenko" />
          <img src={logo_gnrm_1} className="logo-footer-gnrm" alt="Logo GNRM" />
        </div>
        <div className="sekretariat">
          <div className="item">
            <img src={home} className="logo-home" alt="logo-home" />
            <div>Jalan Medan Merdeka Barat No. 3. Jakarta Pusat 10110</div>
          </div>
          <div className="item">
            <img src={phone} className="logo-phone" alt="logo-phone" />
            <div> (021) 33506031 ext 528/521</div>
          </div>
          <div className="item">
            <img src={mail} className="logo-mail" alt="logo-mail" />
            <div>sekretariat.revolusimental@gmail.com</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewFooter;
