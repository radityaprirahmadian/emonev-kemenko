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
import facebook from '../../assets/facebook.png';
import twitter from '../../assets/twitter.png';
import instagram from '../../assets/instagram.png';
import youtube from '../../assets/youtube.png';


const Footer = () => {
    const { isAuthenticated, token, loadUser,userDetail} = useContext(AuthContext);

        return(
            <Fragment>
                <nav className="footer">
                    <div className="row" >
                        <div className="col-6" >
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
                                        <div className="row">
                                            <div className="col-sm-1">
                                                <ul>
                                                    <li>
                                                        <a href="https://www.facebook.com/KemenkopmkRI" target="_blank">
                                                            <div className="social-media-container">
                                                                <img src={facebook} alt='facebook'/> 
                                                            </div>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="https://twitter.com/kemenkopmk" target="_blank">
                                                            <div className="social-media-container">
                                                                <img src={twitter} alt='twitter'/> 
                                                            </div>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="https://instagram.com/kemenko_pmk" target="_blank">
                                                            <div className="social-media-container">
                                                                <img src={instagram} alt='instagram'/>  
                                                            </div>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="https://www.youtube.com/channel/UCS_4jzQs7bywNQrJ-AmoWVg/channels" target="_blank">
                                                            <div className="social-media-container">
                                                                <img src={youtube} alt='youtube'/>  
                                                            </div>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="col-sm-11" style={{paddingLeft:'0'}}>
                                                <ul>
                                                    <li>
                                                        <a href="https://www.facebook.com/KemenkopmkRI" target="_blank">
                                                            <h1 style={{fontSize:'14px', lineHeight:'28px', fontWeight:'600'}}>Kementerian Koordinator Bidang Pembangunan Manusia dan Kebudayaan</h1>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="https://twitter.com/kemenkopmk" target="_blank">
                                                            <h1 style={{fontSize:'14px', lineHeight:'28px', fontWeight:'600'}}>@kemenkopmk</h1>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="https://instagram.com/kemenko_pmk" target="_blank">
                                                            <h1 style={{fontSize:'14px', lineHeight:'28px', fontWeight:'600'}}>kemenko_pmk</h1>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="https://www.youtube.com/channel/UCS_4jzQs7bywNQrJ-AmoWVg/channels" target="_blank">
                                                            <h1 style={{fontSize:'14px', lineHeight:'28px', fontWeight:'600'}}>Kemenko PMK</h1>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>  
                                </div>
                            </div>
                        </div>

                        <div className="col-6" style={{height:'360px', display:'inline-block'}}>
                            <img src={line} alt="garis" style={{position:'absolute', left:'0', top:'55px'}}/>
                                    
                            <div className="footer-right">
                                <div className="footer-right-logo">
                                    <img src={logo_kemenko2} alt="gabungan" style={{marginRight:'155.42px', height:'125px'}}/>
                                    <img src={logo_gnrm} alt="gabungan" />
                                </div>

                                <div className="footer-right-info">
                                    <div className="footer-right-title">
                                        <p>
                                        Sekretariat Revolusi Mental<br/>
                                        Kementerian Koordinator Bidang<br/>
                                        Pembangunan Manusia dan Kebudayaan
                                        </p>                
                                    </div>

                                    <div className="footer-right-menu">
                                        <ul>
                                            <img src={home} className="logo-home"/>
                                            <li>Jalan Medan Merdeka Barat No. 3. Jakarta Pusat 10110</li>
                                            <div className="clear"/>

                                            <img src={phone} className="logo-phone"/>
                                            <li> (021) 33506031 ext 528/521</li>
                                            <div className="clear"/>

                                            <img src={mail} className="logo-mail"/>
                                            <li>sekretariat.revolusimentail@gmail.com</li>
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