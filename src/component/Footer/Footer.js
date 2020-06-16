import React,{Component,Fragment,useContext} from 'react';
import {AuthContext} from '../../context/Auth/AuthContext';
import './Footer.css';
import line from '../../assets/line.png';
import logo_gabungan from '../../assets/logo_gabungan.png';
import logo_gnrm from '../../assets/logo_gnrm.png';
import { BrowserRouter , Route, Link, Switch, NavLink } from "react-router-dom";
import logo_kemenko2 from '../../assets/logo_kemenko2.png';
import home from '../../assets/home.png';
import mail from '../../assets/mail.png';
import phone from '../../assets/phone.png';


const Footer = () => {
    const { isAuthenticated, token, loadUser,userDetail} = useContext(AuthContext);

        return(
            <Fragment>
                <nav className="footer">
                    <div className="row" >
                        <div className="col-5" >
                            <div className="footer-left">
                                <div className="footer-left-menu">
                                    <div className="footer-left-title">
                                        <p>Menu</p>                
                                    </div>

                                    <ul>
                                        <div className="row" style={{marginLeft: 0}}>
                                            <div className="col-4">
                                                <li>
                                                    <NavLink exact to="/" activeClassName="active">
                                                        <p>Beranda</p>
                                                    </NavLink>
                                                </li>
                                                <li>
                                                {
                                                    isAuthenticated && userDetail ? 
                                                         userDetail && !userDetail.login_awal ? (
                                                        <NavLink to="/dashboard" activeClassName="active">
                                                            <p>
                                                                E-Report
                                                            </p>
                                                        </NavLink>
                                                    )
                                                    : (
                                                        <NavLink to="/login" activeClassName="active">
                                                            <p>
                                                                E-Report
                                                            </p>
                                                        </NavLink>
                                                    )
                                            
                                            :
                                            (
                                                <NavLink to="/login" activeClassName="active">
                                                    <p>
                                                        E-Report
                                                    </p>
                                                </NavLink>
                                            )
                                        }
                                                </li>
                                            </div>
                                            <div className="col-8" style={{width:'400px'}}>
                                                <li>
                                                    <NavLink exact to="/" activeClassName="active">
                                                        <p>Pelaksanaan GNRM</p>
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <NavLink to="/gallery" activeClassName="active">
                                                        <p>Gallery</p>
                                                    </NavLink>
                                                </li>
                                            </div>
                                        </div>
                                    </ul>

                                    <div className="footer-left-social" >
                                        <p>Social Media</p>                
                                    </div>

                                    <div className="footer-left-social-logo">
                                        <ul>
                                            <li>
                                                <a href="https://www.facebook.com/KemenkopmkRI" target="_blank">
                                                    <div className="social-media-container">
                                                        <i className='fab fa-facebook-f' style={{fontSize:'24px'}}></i> 
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="https://twitter.com/kemenkopmk" target="_blank">
                                                    <div className="social-media-container">
                                                        <i className='fab fa-twitter' style={{fontSize:'24px'}}></i> 
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="https://instagram.com/kemenko_pmk" target="_blank">
                                                    <div className="social-media-container">
                                                        <i className='fab fa-instagram' style={{fontSize:'24px'}}></i> 
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="https://www.youtube.com/channel/UCS_4jzQs7bywNQrJ-AmoWVg/channels" target="_blank">
                                                    <div className="social-media-container">
                                                        <i className='fab fa-youtube' style={{fontSize:'24px'}}></i> 
                                                    </div>
                                                </a>
                                            </li>

                                        </ul>
                                    </div>  
                                </div>
                            </div>
                        </div>

                        <div className="col-1" style={{height:'360px'}}>
                                <div className="center-line">
                                    <img src={line} alt="garis ganggu"/>
                                </div>
                        </div>

                        <div className="col-6" style={{height:'360px'}}>
                            <div className="footer-right">
                                <div className="footer-right-logo">
                                    <img src={logo_kemenko2} alt="gabungan" style={{marginRight:'155.42px', height:'125px'}}/>
                                    <img src={logo_gnrm} alt="gabungan" />
                                </div>

                                <div className="footer-right-info">
                                    <div className="footer-right-title">
                                        <p>
                                        Kementrian Koordinator Bidang<br/>
                                        Pembangunan Manusia dan Kebudayaan<br/>
                                        Republik Indonesia
                                        </p>                
                                    </div>

                                    <div className="footer-right-menu">
                                        <ul>
                                            <img src={home} className="logo-home"/>
                                            <li>Jl. Medan Merdeka Barat No. 3. Jakarta Pusat</li>
                                            <div className="clear"/>

                                            <img src={phone} className="logo-phone"/>
                                            <li> (+62) 21 345 9444</li>
                                            <div className="clear"/>

                                            <img src={mail} className="logo-mail"/>
                                            <li>roinfohumas@kemenkopmk.go.id</li>
                                            <div className="clear"/>
                                        </ul>
                                    </div>
                                </div>  
                            </div>
                        </div>
                    </div>
                </nav>
            </Fragment>
        );
}

export default Footer;