import React,{useState,Fragment, useContext, useEffect} from 'react';
import './SideBarOff.css';
import profil from '../../assets/Profil.png';
import logo_kemenko from '../../assets/logo_kemenko.png';
import toggle_off from '../../assets/logo/toggle_off.svg';
import toggle_on from '../../assets/logo/toggle_on.svg';
import {Link, NavLink , useHistory} from 'react-router-dom';
import { AuthContext } from '../../context/Auth/AuthContext'
import { LayoutContext } from '../../context/Layout/LayoutContext';
import { NotifContext } from '../../context/Notifikasi/NotifContext';
import axios from 'axios';

const SideBarOff = (props) => {
    const { isAuthenticated, loading, logout, token, user, userDetail, loadUser, getUserDetail, remember, rememberToken } = useContext(AuthContext);
    const { sidebar, setSidebar } = useContext(LayoutContext);
    const history = useHistory();
    const { allReminder, reminder, setAllReminder , getReminder, resetNotif } = useContext(NotifContext)
    const [instansiDetail , setInstansiDetail] = useState({})

    useEffect(()=>{
        if(token) {
            loadUser()
        } else {
            history.push('/')
        }
        
    },[token])
    
    console.log(allReminder)
    console.log(reminder)
    
    const handleClickToggle = () => {
        setSidebar();
    }
    
    const [hide, setHide] = useState(true)

    const onClickToProfileInstansi = (e) => {
        e.preventDefault()
        history.push(`/${user&&user.role === 'owner' ? 'super-admin' : 'admin'}/profile-instansi/` + (userDetail && userDetail.instansi._id))
        setHide(true)
        
    }

    const handleLogout = () => {
        logout();
        if(remember){
            rememberToken()
        }
        resetNotif();
        history.push('/login');
    }

    const [ avatar, setAvatar ] = useState();

    useEffect(() => {
        const getInstansiDetail = async () => {
            const config = {
                headers: {
                    'X-Auth-Token': `aweuaweu ${token}`,
                }
            }
            try {
                const res = await axios.get(`https://test.bariqmbani.me/api/v1/instansi/${userDetail && userDetail.instansi._id}`,config)
                setInstansiDetail(res.data.instansi)
                if(res.data.instansi.alamat === '' || res.data.instansi.kontak === '' || res.data.instansi.website === '' || res.data.instansi.fax === '') {
                    setHide(false)
                } else {
                    setHide(true)
                }
            }
            catch (err) {
                console.log(err)
            }
        }
        getInstansiDetail()
    },[])

    useEffect(() => {
        const wow = `https://test.bariqmbani.me${userDetail&&userDetail.foto}`
        setAvatar(wow)
    },[userDetail])

    console.log(instansiDetail)

        return(
            <Fragment>
                {/* {
                   hide ?
                    '' 
                    :
                    <div className="popup-check">
                        <div className="popup-check-instansi">
                            ISI PROFILE INSTANSI DULU BROW <br/>
                            <NavLink to={`/${user&&user.role === 'owner' ? 'super-admin' : 'admin'}/profile-instansi/` + (userDetail && userDetail.instansi._id)} activeClassName="active">
                                <button className="button-to-instansi">PERGI KE HALAMAN INSTANSI</button>
                            </NavLink>
                        </div>
                    </div>
                } */}

                {
                    sidebar ? 
                    (
                        <div className="side-bar">
                            <div className="side-bar-avatar">
                                <div className='avatar-container'>
                                    {  
                                        userDetail && userDetail.foto ? 
                                            <img src={avatar} className='user-avatar' alt="User Avatar"/>
                                        :
                                            <img src={profil} className='user-avatar' alt="Image Placeholder"/>
                                    }
                                    {  
                                        userDetail && userDetail.instansi.logo ? 
                                            <img src={'https://test.bariqmbani.me'+ (userDetail && userDetail.instansi.logo)} className='logo-instansi-user' alt="Logo Instansi"/>
                                        :
                                            <img src={logo_kemenko} className='logo-instansi-user' alt="Logo Placeholder"/>
                                    }
                                </div>
                                <div className="avatar-identity">
                                    <p className ="user-name">{userDetail && userDetail.nama}</p>
                                    <p className ="user-position">{(user && user.role) === 'owner' ? 'Super Admin' : ((user && user.role) === 'super_admin' ? 'Super Admin' : 'Admin' )}</p>
                                    <p className ="user-ministry">{userDetail && userDetail.instansi.nama_pendek}</p>
                                </div>
                            </div>
                            
                            <div className="side-bar-menu">
                                <div className="side-bar-menu-on">
                                    <ul>
                                        <NavLink to={`/${user&&user.role === 'owner' ? 'super-admin' : 'admin'}/dashboard`} activeClassName="active">
                                            <li className="side-bar-item" > 
                                                <div className="row">
                                                    <div className="col-md-2">
                                                        <div className="home_icon"></div>
                                                    </div>
                                                    <div className="col-md-10">
                                                        <div className="label-menu">Beranda</div>
                                                    </div>
                                                </div>
                                            </li>
                                        </NavLink>        
                                        <NavLink to={`/${user&&user.role === 'owner' ? 'super-admin' : 'admin'}/rencana-pelaksanaan-program`} activeClassName="active">
                                        <li className="side-bar-item">
                                                <div className="row">
                                                    <div className="col-md-2">
                                                        <div className="gnrm_icon"></div>
                                                    </div>
                                                    <div className="col-md-10">
                                                        <div className="label-menu">Rencana Pelaksanaan Program</div>
                                                    </div>
                                                </div>
                                        </li>
                                        </NavLink>
                                        <NavLink to={`/${user&&user.role === 'owner' ? 'super-admin' : 'admin'}/kabar-gnrm`} activeClassName="active">
                                        <li className="side-bar-item">
                                                <div className="row">
                                                    <div className="col-md-2">
                                                        <div className="kabar_gnrm_icon"></div>
                                                    </div>
                                                    <div className="col-md-10">
                                                        <div className="label-menu">Kabar GNRM</div>
                                                    </div>
                                                </div>
                                        </li>
                                        </NavLink>
                                        <NavLink to={`/${user&&user.role === 'owner' ? 'super-admin' : 'admin'}/laporan-monev`} activeClassName="active">
                                        <li className="side-bar-item">
                                                <div className="row">
                                                    <div className="col-md-2">
                                                        <div className="monev_icon"></div>
                                                    </div>
                                                    <div className="col-md-10">
                                                        <div className="label-menu">Laporan Monev</div>
                                                    </div>
                                                </div>
                                        </li>
                                        </NavLink>
                                        {
                                            (user && user.role) === 'owner'? (
                                                <Fragment>
                                                    <NavLink to={`/${user&&user.role === 'owner' ? 'super-admin' : 'admin'}/kelola-instansi`} activeClassName="active">
                                                    <li className="side-bar-item">
                                                            <div className="row">
                                                                <div className="col-md-2">
                                                                    <div className="kelola_instansi_icon"></div>
                                                                </div>
                                                                <div className="col-md-10">
                                                                    <div className="label-menu">Kelola Instansi</div>
                                                                </div>
                                                            </div>
                                                    </li>
                                                    </NavLink> 
                                                    <NavLink to={`/${user&&user.role === 'owner' ? 'super-admin' : 'admin'}/kelola-admin`} activeClassName="active">
                                                    <li className="side-bar-item">
                                                            <div className="row">
                                                                <div className="col-md-2">
                                                                    <div className="kelola_admin_icon"></div>
                                                                </div>
                                                                <div className="col-md-10">
                                                                    <div className="label-menu">Kelola Admin</div>
                                                                </div>
                                                            </div>
                                                    </li>
                                                    </NavLink> 
                                                    <NavLink to={`/${user&&user.role === 'owner' ? 'super-admin' : 'admin'}/notifikasi`} activeClassName="active">
                                                    <li className="side-bar-item">
                                                            <div className="row">
                                                                <div className="col-md-2">
                                                                    <div className="reminder_icon"></div>
                                                                </div>
                                                                <div className="col-md-10">
                                                                    <div className="label-menu">Reminder</div>
                                                                </div>
                                                            </div>
                                                    </li>
                                                    </NavLink>
                                                </Fragment>
                                            ) : 
                                            ''
                                        }
                                        <NavLink to={`/${user&&user.role === 'owner' ? 'super-admin' : 'admin'}/profile-instansi/` + (userDetail && userDetail.instansi._id)} activeClassName="active">
                                            <li className="side-bar-item">
                                                <div className="row">
                                                    <div className="col-md-2">
                                                        <div className="profil_instansi_icon"></div>
                                                    </div>
                                                    <div className="col-md-10">
                                                        <div className="label-menu">Profil Instansi</div>
                                                    </div>
                                                </div>
                                            </li>
                                        </NavLink>
                                        <NavLink to={`/${user&&user.role === 'owner' ? 'super-admin' : 'admin'}/profile/` + (user && user._id)} activeClassName="active">
                                        <li className="side-bar-item">
                                                <div className="row">
                                                    <div className="col-md-2">
                                                        <div className="profil_icon"></div>
                                                    </div>
                                                    <div className="col-md-10">
                                                        <div className="label-menu">Profil</div>
                                                    </div>
                                                </div>
                                        </li>
                                        </NavLink> 
                                        <li className="side-bar-item">
                                            <div className="toggle-button" style={{color:'white'}} onClick={() => handleClickToggle()}>
                                                <div className="row">
                                                    <div className="col-md-2" >
                                                        <div className="toggle_icon_off"></div>
                                                    </div>
                                                    <div className="col-md-10" >
                                                        <div className="label-menu" style={{color:'#FFFFFF'}}>Sembunyikan Toggle</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="side-bar-item">
                                            <div className="logout-button" style={{color:'white'}} onClick={()=>handleLogout()}>
                                                <div className="row" style={{width:'200px'}}>
                                                    <div className="col-md-2" >
                                                        <div className="logout_icon"></div>
                                                    </div>
                                                    <div className="col-md-10" >
                                                        <div className="label-menu">Keluar</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    ) : (

                        <div className="side-bar-off">
                            <div className="avatar-off">
                                {  
                                    userDetail && userDetail.foto ? 
                                        <img src={avatar} className='user-avatar-off' alt="User Avatar"/>
                                    :
                                        <img src={profil} className='user-avatar-off' alt="Image Placeholder"/>
                                }
                                {  
                                    userDetail && userDetail.instansi.logo ? 
                                        <img src={'https://test.bariqmbani.me'+ (userDetail && userDetail.instansi.logo)} className='logo-instansi-user-off' alt="Logo Instansi"/>
                                    :
                                        <img src={logo_kemenko} className='logo-instansi-user-off' alt="Logo Placeholder"/>
                                }
                            </div>
                            <div className="side-bar-menu-off">
                                <div>
                                    <ul>
                                        <NavLink to={`/${user&&user.role === 'owner' ? 'super-admin' : 'admin' }/dashboard`} activeClassName="active">
                                            <li className="side-bar-item">
                                                <div className="row">
                                                    <div className="col-md-2">
                                                        <div className="home_icon">
                                                            <span className="tooltiptext">Beranda</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </NavLink>        
                                        <NavLink to={`/${user&&user.role === 'owner' ? 'super-admin' : 'admin'}/rencana-pelaksanaan-program`} activeClassName="active">
                                            <li className="side-bar-item">
                                                <div className="row">
                                                    <div className="col-md-2">
                                                        <div className="gnrm_icon">
                                                            <span className="tooltiptext">Rencana Pelaksanaan Program</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </NavLink>
                                        <NavLink to={`/${user&&user.role === 'owner' ? 'super-admin' : 'admin'}/kabar-gnrm`} activeClassName="active">
                                            <li className="side-bar-item">
                                                <div className="row">
                                                    <div className="col-md-2">
                                                        <div className="kabar_gnrm_icon">
                                                            <span className="tooltiptext">Kabar GNRM</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </NavLink>
                                        <NavLink to={`/${user&&user.role === 'owner' ? 'super-admin' : 'admin'}/laporan-monev`} activeClassName="active">
                                            <li className="side-bar-item">
                                                <div className="row">
                                                    <div className="col-md-2">
                                                        <div className="monev_icon">
                                                            <span className="tooltiptext">Laporan Monev</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </NavLink>
                                            {
                                                (user && user.role) === 'owner' ? (
                                                    <Fragment>
                                                        <NavLink to={`/${user&&user.role === 'owner' ? 'super-admin' : 'admin'}/kelola-instansi`} activeClassName="active">
                                                            <li className="side-bar-item">
                                                                <div className="row">
                                                                    <div className="col-md-2">
                                                                        <div className="kelola_instansi_icon">
                                                                            <span className="tooltiptext">Kelola Instansi</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </NavLink> 
                                                        <NavLink to={`/${user&&user.role === 'owner' ? 'super-admin' : 'admin'}/kelola-admin`} activeClassName="active">
                                                            <li className="side-bar-item">
                                                                <div className="row">
                                                                    <div className="col-md-2">
                                                                        <div className="kelola_admin_icon">
                                                                            <span className="tooltiptext">Kelola Admin</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </NavLink> 
                                                        <NavLink to={`/${user&&user.role === 'owner' ? 'super-admin' : 'admin'}/notifikasi`} activeClassName="active">
                                                            <li className="side-bar-item">
                                                                <div className="row">
                                                                    <div className="col-md-2">
                                                                        <div className="reminder_icon">
                                                                            <span className="tooltiptext">Notifikasi</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </NavLink>
                                                    </Fragment>
                                                ) : ''
                                            }
                                        <NavLink to={`/${user&&user.role === 'owner' ? 'super-admin' : 'admin'}/profile-instansi/` + (userDetail && userDetail.instansi._id)} activeClassName="active">
                                            <li className="side-bar-item">
                                                <div className="row">
                                                    <div className="col-md-2">
                                                        <div className="profil_instansi_icon">
                                                            <span className="tooltiptext">Profil Instansi</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </NavLink>
                                        <NavLink to={`/${user&&user.role === 'owner' ? 'super-admin' : 'admin'}/profile/` + (user && user._id)}activeClassName="active">
                                            <li className="side-bar-item">
                                                <div className="row">
                                                    <div className="col-md-2">
                                                        <div className="profil_icon">
                                                            <span className="tooltiptext">Profil</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </NavLink> 
                                        <li className="side-bar-item">
                                            <div className="toggle-button-on" style={{color:'white', left:'19px'}}  onClick={() => handleClickToggle()}>
                                                <div className="toggle_icon_on"></div>
                                            </div>
                                        </li>
                                        <li className="side-bar-item">
                                            <div className="logout-button" style={{color:'white', left:'19px'}} onClick={()=>handleLogout()}>
                                                <div className="logout_icon"></div>
                                            </div>
                                        </li> 
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )
                }
            </Fragment>                
        );
}

export default SideBarOff;