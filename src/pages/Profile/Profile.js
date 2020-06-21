import React,{Component,Fragment, useContext, useEffect, useState} from 'react';
import './Profile.css';
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import lock from '../../assets/lock.png';
import {Link} from 'react-router-dom';
import { AuthContext } from '../../context/Auth/AuthContext'
import axios from 'axios'
import Popup from '../../component/Popup/Popup';

const Profile = (props) => {
    const { token, userDetail,} = useContext(AuthContext);
    const [ foto, setFoto ] = useState();

    useEffect(() => {
        const wow = `https://test.bariqmbani.me${userDetail&&userDetail.foto}`
        setFoto(wow)
    },[userDetail])

    console.log(foto)

        return(
            <Fragment>
                <SideBarOff/>
                <Popup notif={props.notif}/>
                <div className="profile-page">
                    <div className="tajuk-page">
                        PROFIL
                    </div>
                    <div className="container-fluid">
                        <div className="row">
                            <form id="form-profile">
                            <div className="col"> 
                            
                                <div className="form-profile-page">
                                <div className="data">
                                    <label>Nama</label><br/>
                                    <div className="show-profile" type="text">{userDetail && userDetail.nama}</div>
                                </div>

                                <div className="data">
                                    <label>Instansi</label><br/>
                                    <div className="show-profile" type="text">{userDetail && userDetail.instansi.nama_pendek}</div>
                                </div>

                                <div className="data">
                                    <label>Role</label><br/>
                                    <div className="show-profile" type="text">{(userDetail && userDetail.role) === 'owner' ? 'Owner' : ((userDetail && userDetail.role) === 'super_admin' ? 'Super Admin' : 'Admin' )}</div>
                                </div>

                                <div className="data">
                                    <label>Username</label><br/>
                                    <div className="show-profile" type="text">{userDetail && userDetail.username}</div>
                                </div>

                                <div className="data">
                                    <label>Email</label><br/>
                                    <div className="show-profile" type="email">{userDetail && userDetail.email}</div>
                                </div>
                                <div className="data">
                                    <label>Nomor Telepon</label><br/>
                                    <div className="show-profile" type="text">{userDetail && userDetail.kontak}</div>
                                </div>
                                </div>
                            </div>
                            </form>

                            <div className="col">
                                <div className="photo-profile-page">
                                    <label>Photo Profile</label><br/>
                                    <div className="photo-profile-container">
                                        <div className="photo-profile">
                                            <img src={foto}></img>
                                        </div>
                                    </div>
                                    <Link to={`/edit-profile/${userDetail && userDetail._id}`}>
                                    <input 
                                        form="form-profile"
                                        type="submit"
                                        className="button-submit-profile"
                                        value="EDIT PROFIL"
                                    > 
                                    </input>
                                    </Link>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }

export default Profile;