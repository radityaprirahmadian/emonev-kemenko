import React,{useState,Fragment, useContext, useEffect} from 'react';
import './SideBarOff.css';
import profil from '../../assets/Profil.png';
import logo_kemenko from '../../assets/logo_kemenko.png';
import {Link, NavLink , useHistory} from 'react-router-dom';
import { AuthContext } from '../../context/Auth/AuthContext'
import { LayoutContext } from '../../context/Layout/LayoutContext';
import { NotifContext } from '../../context/Notifikasi/NotifContext';



const SideBarOff = (props) => {
    const { isAuthenticated, loading, logout, token, user, userDetail, loadUser, getUserDetail, remember, rememberToken } = useContext(AuthContext);
    const { sidebar, setSidebar } = useContext(LayoutContext);
    const history = useHistory();
    const { allReminder, reminder, setAllReminder , getReminder, resetNotif } = useContext(NotifContext)

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
        const wow = `https://test.bariqmbani.me${userDetail&&userDetail.foto}`
        setAvatar(wow)
    },[userDetail])

        return(
            <Fragment>
                {
                    sidebar ? 
                    (
                        <div className="side-bar">
                            <div className="side-bar-avatar">
                                <div className='avatar-container'>
                                    {
                                        userDetail && userDetail.foto === 'NULL' ? (
                                            <Fragment>
                                                <img src={profil} className='user-avatar' alt="avatar"/>
                                                <img src={logo_kemenko} className='logo-instansi-user' alt="avatar"/>
                                            </Fragment>
                                        ) : (
                                            <Fragment>
                                                <img src={avatar} className='user-avatar' alt="avatar"/>
                                                <img src={avatar} className='logo-instansi-user' alt="avatar"/>
                                            </Fragment>  
                                        )

                                    }
                                </div>
                                <div className="avatar-identity">
                                    <p className ="user-name">{userDetail && userDetail.nama}</p>
                                    <p className ="user-position">{(user && user.role) === 'owner' ? 'Super Admin' : ((user && user.role) === 'super_admin' ? 'Super Admin' : 'Admin' )}</p>
                                    <p className ="user-ministry">{user && user.instansi.nama_pendek}</p>
                                </div>
                            </div>
                            
                            <div className="side-bar-menu">
                                <div className="side-bar-menu-on">
                                    <ul>
                                        <NavLink to="/dashboard" activeClassName="active">
                                            <li className="side-bar-item" > 
                                                <div className="row">
                                                    <div className="col-md-2">
                                                        <i className="fas fa-home"></i>
                                                    </div>
                                                    <div className="col-md-10">
                                                        <div className="label-menu">Beranda</div>
                                                    </div>
                                                </div>
                                            </li>
                                        </NavLink>        
                                        <NavLink to="/gnrm" activeClassName="active">
                                        <li className="side-bar-item">
                                                <div className="row">
                                                    <div className="col-md-2">
                                                        <i className="far fa-hospital"></i>
                                                    </div>
                                                    <div className="col-md-10">
                                                        <div className="label-menu">Rencana Pelaksanaan Program</div>
                                                    </div>
                                                </div>
                                        </li>
                                        </NavLink>
                                        <NavLink to="/infografis" activeClassName="active">
                                        <li className="side-bar-item">
                                                <div className="row">
                                                    <div className="col-md-2">
                                                        <i className="far fa-file"></i>
                                                    </div>
                                                    <div className="col-md-10">
                                                        <div className="label-menu">Infografis</div>
                                                    </div>
                                                </div>
                                        </li>
                                        </NavLink>
                                        <NavLink to="/monev" activeClassName="active">
                                        <li className="side-bar-item">
                                                <div className="row">
                                                    <div className="col-md-2">
                                                        <i className="far fa-file-alt"></i>
                                                    </div>
                                                    <div className="col-md-10">
                                                        <div className="label-menu">Laporan Monev</div>
                                                    </div>
                                                </div>
                                        </li>
                                        </NavLink>
                                        {
                                            (user && user.role) === 'owner' || (user && user.role) === 'super_admin' ? (
                                                <Fragment>
                                                    <NavLink to="/instansi" activeClassName="active">
                                                    <li className="side-bar-item">
                                                            <div className="row">
                                                                <div className="col-md-2">
                                                                    <i className="fas fa-building"></i>
                                                                </div>
                                                                <div className="col-md-10">
                                                                    <div className="label-menu">Kelola Instansi</div>
                                                                </div>
                                                            </div>
                                                    </li>
                                                    </NavLink> 
                                                    <NavLink to="/admin" activeClassName="active">
                                                    <li className="side-bar-item">
                                                            <div className="row">
                                                                <div className="col-md-2">
                                                                    <i className="fas fa-user-friends"></i>
                                                                </div>
                                                                <div className="col-md-10">
                                                                    <div className="label-menu">Kelola Admin</div>
                                                                </div>
                                                            </div>
                                                    </li>
                                                    </NavLink> 
                                                    <NavLink to="/reminder" activeClassName="active">
                                                    <li className="side-bar-item">
                                                            <div className="row">
                                                                <div className="col-md-2">
                                                                    <i className="far fa-bell"></i>
                                                                </div>
                                                                <div className="col-md-10">
                                                                    <div className="label-menu">Reminder</div>
                                                                </div>
                                                            </div>
                                                    </li>
                                                    </NavLink>
                                                </Fragment>
                                            ) : (
                                                ''
                                            )
                                        }
                                        <NavLink to={`/profile/` + (user && user._id)} activeClassName="active">
                                        <li className="side-bar-item">
                                                <div className="row">
                                                    <div className="col-md-2">
                                                        <i className="far fa-user"></i>
                                                    </div>
                                                    <div className="col-md-10">
                                                        <div className="label-menu">Profile</div>
                                                    </div>
                                                </div>
                                        </li>
                                        </NavLink> 
                                        <li className="side-bar-item">
                                            <div className="toggle-button" style={{color:'white'}} onClick={() => handleClickToggle()}>
                                                <div className="row">
                                                    <div className="col-md-2" >
                                                        <i className="fas fa-toggle-on" style={{color:'white'}} ></i>
                                                    </div>
                                                    <div className="col-md-10" >
                                                        <div className="label-menu">Sembunyikan Toggle</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="side-bar-item">
                                            <div className="logout-button" style={{color:'white'}} onClick={()=>handleLogout()}>
                                                <div className="row" style={{width:'200px'}}>
                                                    <div className="col-md-2" >
                                                        <i className="fas fa-sign-out-alt" style={{color:'white'}} ></i>
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
                                        userDetail && userDetail.foto !== 'NULL' ? (
                                            <Fragment>
                                                <img src={profil} className='user-avatar-off' alt="avatar"/>
                                                <img src={logo_kemenko} className='logo-instansi-user-off' alt="avatar"/>
                                            </Fragment>
                                        ) : (
                                            <Fragment>
                                                <img src={avatar} className='user-avatar-off' alt="avatar"/>
                                                <img src={avatar} className='logo-instansi-user-off' alt="avatar"/>
                                            </Fragment>  
                                        )

                                    }
                            </div>
                            <div className="side-bar-menu-off">
                                <div>
                                    <ul>
                                        <NavLink to="/dashboard" activeClassName="active">
                                            <li className="side-bar-item" > 
                                                <i className="fas fa-home"></i>
                                            </li>
                                        </NavLink>        
                                        <NavLink to="/gnrm" activeClassName="active">
                                            <li className="side-bar-item">
                                                <i className="far fa-hospital"></i>
                                            </li>
                                        </NavLink>
                                        <NavLink to="/infografis" activeClassName="active">
                                            <li className="side-bar-item">
                                                <i className="far fa-file"></i>
                                            </li>
                                        </NavLink>
                                        <NavLink to="/monev" activeClassName="active">
                                            <li className="side-bar-item">
                                                <i className="far fa-file-alt"></i>
                                            </li>
                                        </NavLink>
                                            {
                                                (user && user.role) === 'owner' || (user && user.role) === 'super_admin' ? (
                                                    <Fragment>
                                                        <NavLink to="/instansi" activeClassName="active">
                                                            <li className="side-bar-item">
                                                                <i className="fas fa-building"></i>
                                                            </li>
                                                        </NavLink> 
                                                        <NavLink to="/admin" activeClassName="active">
                                                            <li className="side-bar-item">
                                                                <i className="fas fa-user-friends"></i>
                                                            </li>
                                                        </NavLink> 
                                                        <NavLink to="/reminder" activeClassName="active">
                                                            <li className="side-bar-item">
                                                                <i className="far fa-bell"></i>
                                                            </li>
                                                        </NavLink>
                                                    </Fragment>
                                                ) : (
                                                    ''
                                                )
                                            }
                                        <NavLink to={"/profile/" + (user && user._id)}activeClassName="active">
                                            <li className="side-bar-item">
                                                <i className="far fa-user"></i>
                                            </li>
                                        </NavLink> 
                                        <li className="side-bar-item">
                                            <div className="toggle-button" style={{color:'white', left:'22px'}}>
                                                <i className="fas fa-toggle-on"  style={{color:'white'}} onClick={() => handleClickToggle()}></i>
                                            </div>
                                        </li>
                                        <li className="side-bar-item">
                                            <div className="logout-button" style={{color:'white', left:'24px'}} >
                                                <i className="fas fa-sign-out-alt"  style={{color:'white'}} onClick={()=>handleLogout()}></i>
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