import React,{Component,Fragment, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../../assets/logo.png';
import logo_simonev_1 from '../../assets/logo_simonev_1.png';
import logo_kemenko from '../../assets/logo_kemenko.png';
import './Topbar.css';
import { BrowserRouter , Route, Link, Switch, NavLink } from "react-router-dom";
import Login from '../Login/Login';
import FormAdmin from '../../pages/FormAdmin/FormAdmin';
import FormReminder from '../../pages/FormReminder/FormReminder';
import Home from '../../pages/Home/Home';
import logo_gif_1 from '../../assets/log_gif_1.gif'
import $ from 'jquery';
import { AuthContext } from '../../context/Auth/AuthContext'
import Megamenu from '../../component/MegaMenu/MegaMenu'
import KabarMegaMenu from '../../component/KabarMegaMenu/KabarMegaMenu'


// const Bawa = props.kunci;


const Topbar = (props) => {
    
    const { isAuthenticated, token, loadUser,userDetail} = useContext(AuthContext);
    

    const [instansi, setInstansi] = useState([])
    const [ documents , setDocuments] = useState([])

    console.log(isAuthenticated)
    console.log(token)

    console.log(instansi)

    const getAllDocument = async () => {
        try {
                const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/infografis?status=true`)
                setDocuments(res.data.infografis)
        }
        catch (err) {
            console.log(err)  
        }  
    }

    useEffect(() => {
        if(token) {
            loadUser()
        }
    }, [token])

    useEffect(() => {
        axios.get('https://api.simonev.revolusimental.go.id/api/v1/pelaksanaan')
        .then(res => {
            setInstansi(res.data.instansi)
            console.log('wow')
        })
        .catch(err => {
            console.log('wow', +err)
        })
    }, [])

    const datas = {   
        post: [
            {
                id: 1,
                date: '12 April 2020',
                nama: 'KEMENKO PMK',
                title: 'Peningkatan Kapasitas Sumber Daya Manusia Aparatur Sipil Negara',
                img: 'https://img.freepik.com/free-vector/abstract-galaxy-background_1199-247.jpg?size=626&ext=jpg'
            },
            {
                id: 2,
                date: '13 April 2020',
                nama: 'KEMENPAN',
                title: 'Penyempurnaan Standar Pelayanan dan Sistem Pelayanan yang Inovatif',
                img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkiNK6ZQuYpJh2RaTFcdCMw6P9YtL8n8C1hBft9NhKXLNxYHNu&s'
            },
            {
                id: 3,
                date: '14 April 2020',
                nama: 'KEMENKO MARITIM',
                title: 'Peningkatan Perilaku Tertib Penggunaan Ruang Publik',
                img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrszLxVL7_mQnQG7S_hQl_vuMDlovlHu-oSjzaGCrxOw1Guqen&s'
            },
            {
                id: 4,
                date: '15 April 2020',
                nama: 'KEMENDAGRI',
                title: 'Peningkatan Sinergi Penyediaan Sarana dan Prasarana yang Menunjang Perilaku Hidup Bersih dan Sehat Dan Merajai Semua',
                img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3Ax4Or8Tcf0MEGlgRzqSX3LD8Jyq7zPG4AeXJ6qE3SUToPekJIA&s'
            },
            {
                id: 5,
                date: '16 April 2020',
                nama: 'KEMENKO KEMENPAN',
                title: 'Peningkatan Peran Koperasi dan UMKM Terhadap Ekonomi Nasional',
                img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrszLxVL7_mQnQG7S_hQl_vuMDlovlHu-oSjzaGCrxOw1Guqen&s'
            },
            {
                id: 6,
                date: '17 April 2020',
                nama: 'KEMENKO PEREKONOMIAN',
                title: 'Peningkatan Perilaku yang Mendukung Kehidupan Demokrasi Pancasila',
                img: 'https://img.freepik.com/free-vector/abstract-galaxy-background_1199-247.jpg?size=626&ext=jpg'
            },
            {
                id: 7,
                date: '18 April 2020',
                nama: 'KEMENKO MARITIM',
                title: 'Peningkatan Perilaku Tertib Penggunaan Ruang Publik',
                img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3Ax4Or8Tcf0MEGlgRzqSX3LD8Jyq7zPG4AeXJ6qE3SUToPekJIA&s'
            },
            {
                id: 8,
                date: '19 April 2020',
                nama: 'KEMENDAGRI',
                title: 'Peningkatan Kapasitas Sumber Daya Manusia Aparatur Sipil Negara',
                img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkiNK6ZQuYpJh2RaTFcdCMw6P9YtL8n8C1hBft9NhKXLNxYHNu&s'
            }
        ]
    }

        $(window).on("scroll", function(){
            if($(window).scrollTop() > 50){
                $(".top-bar").addClass("scroll");
            } else {
                $(".top-bar").removeClass("scroll");
            }
        });




        return( 
                <Fragment>
                    <header className={props.kunci ? "top-bar" : "top-bar-default"}>
                        <nav className="top-bar-navigation">
                            <div className="top-bar-logo">
                                <img src={logo_gif_1} alt="logo kemenko" className="logo-kemenko" />
                            </div>

                            <div className="spacer"/>

                            <div className="top-bar-menu">
                                <ul>
                                    <li className="top-bar-menu-1">
                                        <NavLink exact to="/" activeClassName="active">
                                            <div className="top-bar-menu-container">
                                                Beranda
                                            </div>
                                        </NavLink>
                                    </li>
                                    
                                    <li  className="top-bar-menu-2">
                                        {/* <NavLink to="/artikel" activeClassName="active"> */}
                                            <div className="top-bar-menu-container no-2">
                                                Pelaksanaan GNRM
                                                <span style={{marginLeft:'10px'}}>
                                                    <i className="fa fa-angle-down" style={{fontSize:'18px'}}></i>
                                                </span>  
                                                <div className="jarak">
                                                </div>

                                                <div className="sub-menu-hover">
                                                    <div className="menu-kementrian">
                                                        <ul>
                                                            {
                                                                instansi.map((instansi,index) => {

                                                                    return (
                                                                        <li key={instansi._id} className="menu-1-kementrian">
                                                                            {
                                                                                instansi.logo ?
                                                                                    <img src={`https://api.simonev.revolusimental.go.id${instansi.logo}`} className='logo-in-megamenu' alt='logo'/>
                                                                                :
                                                                                    <img src={logo_kemenko} className='logo-in-megamenu' alt='logo'/>
                                                                            }
                                                                            <div style={{marginTop:'30px'}}>
                                                                                <a className="nama-instansi-megamenu" >{instansi.nama_pendek.toUpperCase()}</a>
                                                                            </div>
                                                                            <div className="sub-menu-kementrian">
                                                                                <div className='topbar-kabar'>
                                                                                    <div style={{width:'100%',height:'90px'}}>
                                                                                        <h1 style={{textAlign:'center', lineHeight:'90px', fontWeight:'800'}}>
                                                                                            KABAR GNRM
                                                                                        </h1>
                                                                                    </div>
                                                                                    <ul className='topbar-kabar-ul'>
                                                                                        {
                                                                                            instansi.kabar.map((kabar,index) => {
                                                                                                return(
                                                                                                    <KabarMegaMenu
                                                                                                    key={index}
                                                                                                    kabar={kabar}
                                                                                                />
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </ul>
                                                                                </div>
                                                                                <div className="topbar-program">
                                                                                    {
                                                                                        instansi.gerakan ?
                                                                                        <div style={{width:'100%',height:'90px'}}>
                                                                                            <h1 style={{textAlign:'center', lineHeight:'90px',fontWeight:'800'}}>
                                                                                                {instansi.gerakan.toUpperCase()}
                                                                                            </h1>
                                                                                        </div>
                                                                                        :
                                                                                        <div style={{width:'100%',height:'90px'}}>
                                                                                        <h1 style={{textAlign:'center', lineHeight:'90px',fontWeight:'800'}}>
                                                                                        </h1>
                                                                                    </div>
                                                                                    }
                                                                                    <ul className='topbar-program-ul'>
                                                                                        {
                                                                                            instansi.gnrm.map((gnrm,index) => {
                                                                                                return(
                                                                                                    <Megamenu
                                                                                                        key={index}
                                                                                                        gnrm={gnrm}
                                                                                                    />
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </ul>
                                                                                </div>
                                                                            </div>
                                                                    </li>
                                                                    )
                                                                })
                                                            }
                                                        </ul>
                                                    </div>
                                                </div>
                                            
                                            </div>

                                            
                                        {/* </NavLink> */}
                                    </li>
                                    
                                    <li className="top-bar-menu-3">
                                        {
                                            isAuthenticated && userDetail ? 
                                                    userDetail && !userDetail.login_awal ? (
                                                        <NavLink to={`/${userDetail&&userDetail.role === 'owner' ? 'super-admin' : 'admin'}/dashboard`} activeClassName="active">
                                                            <div className="top-bar-menu-container">
                                                                E-Report
                                                            </div>
                                                        </NavLink>
                                                    )
                                                    : (
                                                        <NavLink to="/login" activeClassName="active">
                                                            <div className="top-bar-menu-container">
                                                                E-Report
                                                            </div>
                                                        </NavLink>
                                                    )
                                            
                                            :
                                            (
                                                <NavLink to="/login" activeClassName="active">
                                                    <div className="top-bar-menu-container">
                                                        E-Report
                                                    </div>
                                                </NavLink>
                                            )
                                        }
                                    </li>
                                </ul>
                            </div>

                            <div className="spacer"/>
                            
                            <div className="top-bar-logo-simonev">
                                <img src={logo_simonev_1} alt="logo kemenko" className="logo-simonev"/>
                            </div>
                        </nav>
                        
                    </header>
                    
                    
                </Fragment>

           
        );
}

export default Topbar;