import React,{Component,Fragment, useContext, useEffect, useState} from 'react';
import '../Profile/Profile.css';
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import bg_card from '../../assets/bg_card.png';
import {Link} from 'react-router-dom';
import { AuthContext } from '../../context/Auth/AuthContext'
import axios from 'axios'
import Popup from '../../component/Popup/Popup';

const ProfileAdmin = (props) => {
    const { token } = useContext(AuthContext);
    const [ userDetail, setUserDetail ] = useState();
    console.log(userDetail)
    useEffect (() => {
        const getUserToShow = async () => {
            const config = {
                headers: {
                    'X-Auth-Token': `aweuaweu ${token}`
                }
            }
            try {
                const res = await axios.get(`https://test.bariqmbani.me/api/v1/user/${props.match.params.id}`,config)
                console.log(res.data)
                setUserDetail(res.data.user)
            }
            catch (err) {
                console.log(err)
            }
        }
        getUserToShow()
    }, [])

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
                                    <div className="show-profile" type="text">{userDetail && userDetail.instansi.nama}</div>
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
                                    <label>Password</label><br/>
                                    <div className="show-profile" type="password"></div>
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
                                            <img src={bg_card}></img>
                                        </div>
                                    </div>
                                    <Link to={`/edit-admin/${userDetail && userDetail._id}`}>
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

export default ProfileAdmin;