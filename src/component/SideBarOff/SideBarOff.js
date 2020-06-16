import React,{useState,Fragment, useContext, useEffect} from 'react';
import './SideBarOff.css';
import avatar from '../../assets/avatar.png';
import anjay from '../../assets/anjay.png';
import {Link, NavLink , useHistory} from 'react-router-dom';
import { AuthContext } from '../../context/Auth/AuthContext'
import { LayoutContext } from '../../context/Layout/LayoutContext';
import { NotifContext } from '../../context/Notifikasi/NotifContext';



const SideBarOff = (props) => {
    const { isAuthenticated, loading, logout, token, user, userDetail, loadUser, getUserDetail,remember, rememberToken } = useContext(AuthContext);
    const { sidebar, setSidebar } = useContext(LayoutContext);
    // const [ param, setParam ] = useState({
    //     parameter: ''
    // })
    const history = useHistory();

    // const { parameter } = param
    // console.log(parameter)

    // useEffect(() => {
    //     setParam({
    //         ...param,
    //         parameter: user && user._id
    //     })
    // },[])

    const { allReminder, reminder, setAllReminder , getReminder, resetNotif } = useContext(NotifContext)

    // console.log(allReminder)

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

        return(
            <Fragment>
                {
                    sidebar ? 
                    (
                        <div className="side-bar">
                            <div className="side-bar-avatar">
                                <img src={avatar} alt="avatar"/>
                                    <div className="avatar-identity">
                                        <p className ="user-name">{userDetail && userDetail.nama}</p>
                                        <p className ="user-position">{(user && user.role) === 'owner' ? 'Owner' : ((user && user.role) === 'super_admin' ? 'Super Admin' : 'Admin' )}</p>
                                        <p className ="user-ministry">{user && user.instansi.nama_pendek}</p>
                                    </div>
                            </div>
                            
                            <div className="side-bar-menu">
                                <div className="side-bar-menu-on">
                                    <ul>
                                        <li className="side-bar-item" > 
                                            <NavLink to="/dashboard" activeClassName="active">
                                                <div className="row">
                                                    <div className="col-md-2">
                                                        <i className="fas fa-home"></i>
                                                    </div>
                                                    <div className="col-md-10">
                                                        <div className="label-menu">Beranda</div>
                                                    </div>
                                                </div>
                                            </NavLink>        
                                        </li>
                                        <li className="side-bar-item">
                                            <NavLink to="/gnrm" activeClassName="active">
                                                <div className="row">
                                                    <div className="col-md-2">
                                                        <i className="fas fa-home"></i>
                                                    </div>
                                                    <div className="col-md-10">
                                                        <div className="label-menu">Rencana Pelaksaan Program</div>
                                                    </div>
                                                </div>
                                            </NavLink>
                                        </li>
                                        <li className="side-bar-item">
                                            <NavLink to="/infografis" activeClassName="active">
                                                <div className="row">
                                                    <div className="col-md-2">
                                                        <i className="fas fa-home"></i>
                                                    </div>
                                                    <div className="col-md-10">
                                                        <div className="label-menu">Infografis</div>
                                                    </div>
                                                </div>
                                            </NavLink>
                                        </li>
                                        <li className="side-bar-item">
                                            <NavLink to="/monev" activeClassName="active">
                                                <div className="row">
                                                    <div className="col-md-2">
                                                        <i className="far fa-bell"></i>
                                                    </div>
                                                    <div className="col-md-10">
                                                        <div className="label-menu">Laporan Monev</div>
                                                    </div>
                                                </div>
                                            </NavLink>
                                        </li>
                                        {
                                            (user && user.role) === 'owner' || (user && user.role) === 'super_admin' ? (
                                                <Fragment>
                                                    <li className="side-bar-item">
                                                        <NavLink to="/instansi" activeClassName="active">
                                                            <div className="row">
                                                                <div className="col-md-2">
                                                                    <i className="fas fa-user-friends"></i>
                                                                </div>
                                                                <div className="col-md-10">
                                                                    <div className="label-menu">Instansi</div>
                                                                </div>
                                                            </div>
                                                        </NavLink> 
                                                    </li>
                                                    <li className="side-bar-item">
                                                        <NavLink to="/admin" activeClassName="active">
                                                            <div className="row">
                                                                <div className="col-md-2">
                                                                    <i className="fas fa-user-friends"></i>
                                                                </div>
                                                                <div className="col-md-10">
                                                                    <div className="label-menu">Kelola Admin</div>
                                                                </div>
                                                            </div>
                                                        </NavLink> 
                                                    </li>
                                                    <li className="side-bar-item">
                                                        <NavLink to="/reminder" activeClassName="active">
                                                            <div className="row">
                                                                <div className="col-md-2">
                                                                    <i className="far fa-bell"></i>
                                                                </div>
                                                                <div className="col-md-10">
                                                                    <div className="label-menu">Reminder</div>
                                                                </div>
                                                            </div>
                                                        </NavLink>
                                                    </li>
                                                </Fragment>
                                            ) : (
                                                ''
                                            )
                                        }
                                        <li className="side-bar-item">
                                            <NavLink to={`/profile/` + (user && user._id)} activeClassName="active">
                                                <div className="row">
                                                    <div className="col-md-2">
                                                        <i className="far fa-user"></i>
                                                    </div>
                                                    <div className="col-md-10">
                                                        <div className="label-menu">Profile</div>
                                                    </div>
                                                </div>
                                            </NavLink> 
                                        </li>
                                        <li className="side-bar-item">
                                            <div className="toggle-button" style={{color:'black'}} onClick={() => handleClickToggle()}>
                                                <div className="row">
                                                    <div className="col-md-2" >
                                                        <i className="fas fa-toggle-on" style={{color:'black'}} ></i>
                                                    </div>
                                                    <div className="col-md-10" >
                                                        <div className="label-menu">Sembunyikan Toggle</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="side-bar-item">
                                            <div className="logout-button" style={{color:'black'}} onClick={()=>handleLogout()}>
                                                <div className="row">
                                                    <div className="col-md-2" >
                                                        <i className="fas fa-sign-out-alt" style={{color:'black'}} ></i>
                                                    </div>
                                                    <div className="col-md-10" >
                                                        <div className="label-menu">Keluarrrrrrrrrr</div>
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
                                <img src={avatar} alt="avatar bos"/>
                            </div>
                            <div className="side-bar-menu-off">
                                <div>
                                    <ul>
                                        <li className="side-bar-item" > 
                                            <NavLink to="/dashboard" activeClassName="active">
                                                <i className="fas fa-home"></i>
                                            </NavLink>        
                                        </li>
                                        <li className="side-bar-item">
                                            <NavLink to="/gnrm" activeClassName="active">
                                                <i className="fas fa-home"></i>
                                            </NavLink>
                                        </li>
                                        <li className="side-bar-item">
                                            <NavLink to="/infografis" activeClassName="active">
                                                <i className="fas fa-home"></i>
                                            </NavLink>
                                        </li>
                                        <li className="side-bar-item">
                                            <NavLink to="/monev" activeClassName="active">
                                                <i className="far fa-bell"></i>
                                            </NavLink>
                                        </li>
                                            {
                                                (user && user.role) === 'owner' || (user && user.role) === 'super_admin' ? (
                                                    <Fragment>
                                                        <li className="side-bar-item">
                                                                <NavLink to="/instansi" activeClassName="active">
                                                                <i className="fas fa-user-friends"></i>
                                                                </NavLink> 
                                                        </li>
                                                        <li className="side-bar-item">
                                                                <NavLink to="/admin" activeClassName="active">
                                                                <i className="fas fa-user-friends"></i>
                                                                </NavLink> 
                                                        </li>
                                                        <li className="side-bar-item">
                                                            <NavLink to="/reminder" activeClassName="active">
                                                                <i className="far fa-bell"></i>
                                                            </NavLink>
                                                        </li>
                                                    </Fragment>
                                                ) : (
                                                    ''
                                                )
                                            }
                                        <li className="side-bar-item">
                                            <NavLink to={"/profile/" + (user && user._id)}activeClassName="active">
                                                <i className="far fa-user"></i>
                                            </NavLink> 
                                        </li>
                                        <li className="side-bar-item">
                                            <div className="toggle-button" style={{color:'black', left:'22px'}}>
                                                <i className="fas fa-toggle-on"  style={{color:'black'}} onClick={() => handleClickToggle()}></i>
                                            </div>
                                        </li>
                                        <li className="side-bar-item">
                                            <div className="logout-button" style={{color:'black', left:'24px'}} >
                                                <i className="fas fa-sign-out-alt"  style={{color:'black'}} onClick={()=>handleLogout()}></i>
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