import React,{Component,Fragment, useContext, useEffect, useState} from 'react';
import '../Profile/Profile.css';
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import bg_card from '../../assets/bg_card.png';
import {Link} from 'react-router-dom';
import { AuthContext } from '../../context/Auth/AuthContext'
import axios from 'axios'
import Popup from '../../component/Popup/Popup';
import bg_1 from '../../assets/decoration/bg_1.png'
import bg_2 from '../../assets/decoration/bg_2.png'
import bg_3 from '../../assets/decoration/bg_3.png'
import bg_4 from '../../assets/decoration/bg_4.png'

const ProfileAdmin = (props) => {
    const { token } = useContext(AuthContext);
    const [ userDetail, setUserDetail ] = useState();
    console.log(userDetail)
    const [ avatar, setAvatar ] = useState();
    console.log(avatar)
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
                const wow = `https://test.bariqmbani.me${res.data.user.foto}`
                setAvatar(wow)
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
                <div className="background-after-login">
                    <img src={bg_1} alt='bg1' style={{position: 'fixed' , top:'0' , left: '0'}}/>
                    <img src={bg_2} alt='bg2' style={{position: 'fixed' , top:'0' , right: '0'}}/>
                    <img src={bg_3} alt='bg3' style={{position: 'fixed' , bottom:'-200px' , left: '0'}}/>
                    <img src={bg_4} alt='bg4' style={{position: 'fixed' , bottom:'-50px' , right: '0'}}/>
                </div>
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
                                            <img src={avatar}></img>
                                        </div>
                                    </div>
                                    <Link to={`/${userDetail&&userDetail.role === 'owner' ? 'super-admin' : 'admin'}/edit-admin/${userDetail && userDetail._id}`}>
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