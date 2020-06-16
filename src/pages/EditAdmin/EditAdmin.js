import React,{Component,Fragment, useContext, useState, useEffect} from 'react';
import '../Profile/ProfileEdit.css';
import axios from 'axios';
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import bg_card from '../../assets/bg_card.png';
import {Link, useHistory} from 'react-router-dom';
import { AuthContext } from '../../context/Auth/AuthContext'
import Popup from '../../component/Popup/Popup';

const EditAdmin = (props) => {
    const { user, token, getUserDetail, userDetail } = useContext(AuthContext);
    const history = useHistory();

    const [userData, setUserData] = useState ({
        instansi : {
            nama : '',
            nama_pendek: ''
        },
        nama: '',
        email: '',
        kontak: '',
        role: '',
        username: ''
    })

    const { role, username, nama, email, kontak , instansi, nama_pendek} = userData;
    console.log(nama_pendek)
    console.log(userData)
    console.log(nama)
    console.log(username)

    useEffect (() => {
        const getUserToUpdate = async () => {
            const config = {
                headers: {
                    'X-Auth-Token': `aweuaweu ${token}`
                }
            }
            try {
                const res = await axios.get(`https://test.bariqmbani.me/api/v1/user/${props.match.params.id}`,config)
                console.log(res.data)
                setUserData(res.data.user)
            }
            catch (err) {
                console.log(err)
            }
        }
        getUserToUpdate()
    }, [])


    const onChange = (e) => {
        return setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
        
    }

    const updateUserData = async (formData) => {
        console.log(formData)
        const config = {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`,
                'Content-Type': 'application/json'
            }
        }
        try {
            await axios.put(`https://test.bariqmbani.me/api/v1/user/${props.match.params.id}`,formData,config)
        }
        catch (err) {
            console.log(err)
        }
    }

    const onSubmitEdit = (e) => {
        e.preventDefault();
        updateUserData({nama,email,kontak,role,username})
        history.push(`/admin`)
        
    }

        return(
            <Fragment>
                <SideBarOff/>
                <Popup notif={props.notif}/>
                <div className="profile-page">
                    <div className="tajuk-page">
                        EDIT ADMIN
                    </div>
                    <div className="container-fluid">
                        <div className="row">
                            <form id="form-profile" onSubmit={onSubmitEdit}>
                            <div className="col"> 
                            
                                <div className="form-profile-page">
                                    <div className="data">
                                        <label>Nama</label><br/>
                                        <input className="show-profile" type="text" name='nama' value={nama} onChange={onChange}></input>
                                    </div>

                                    <div className="data">
                                        <label>Instansi</label><br/>
                                        {
                                            user && user.role === 'owner' ?
                                                <input className="show-profile" type="text" name="nama_pendek" value={instansi.nama_pendek} onChange={onChange}></input>
                                            :
                                                <div className="persist">{instansi.nama_pendek}</div>
                                        }
                                    </div>

                                    <div className="data">
                                        <label>Role</label><br/>
                                        {
                                            user && user.role === 'owner' ?
                                                <input className="show-profile" type="text" name='role' value={role} onChange={onChange}></input>
                                            :
                                                <div className="persist">{role}</div>
                                        }
                                    </div>

                                    <div className="data">
                                        <label>Username</label><br/>
                                        <div className="persist">{username}</div>
                                    </div>

                                    <div className="data">
                                        <label>Password</label><br/>
                                        <div className="show-profile" type="text"></div>
                                    </div>

                                    <div className="data">
                                        <label>Email</label><br/>
                                        <input className="show-profile" type="email" name='email' value={email} onChange={onChange}></input>
                                    </div>
                                    <div className="data">
                                        <label>Nomor Telepon</label><br/>
                                        <input className="show-profile" type="text" name='kontak' value={kontak} onChange={onChange}></input>
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
                                            <u><h1>Ganti Foto</h1></u>
                                        </div>
                                    <button 
                                    disabled
                                        className="button-submit-profile"
                                    > EDIT PROFIL
                                    </button>

                                    <input 
                                            form="form-profile"
                                            type="submit"
                                            className="button-submit-profile-edit"
                                            value="SAVE"
                                        > 
                                    </input>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </Fragment>
        );
}

export default EditAdmin;