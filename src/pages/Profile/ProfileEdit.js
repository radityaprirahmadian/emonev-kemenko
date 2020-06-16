import React,{Component,Fragment, useContext, useState, useEffect} from 'react';
import './ProfileEdit.css';
import axios from 'axios';
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import bg_card from '../../assets/bg_card.png';
import {Link, useHistory} from 'react-router-dom';
import { AuthContext } from '../../context/Auth/AuthContext'
import Popup from '../../component/Popup/Popup';

const ProfileEdit = (props) => {

    const { token, getUserDetail, userDetail } = useContext(AuthContext);
    const history = useHistory();
    const [seen, setSeen] = useState(false)

    // const [user, setUser] = useState ({
    //     name: name,
    //     password: password,
    //     email: email,
    //     nohp: nohp
    // })

    // useEffect (() => {
    //     setUser(user)
    // },[name,email,password,nohp])

    // const onChange = (e) => {
    //     return setUser({
    //         ...user,
    //         [e.target.name]: e.target.value
    //     })
        
    // }

    // const onEdit = (e) => {
    //     e.preventDefault();
    //     edit ({
    //         user
    //     });
    //     history.push('/profile');
    // }

    // console.log(user)
    const [userData, setUserData] = useState ({
        nama: '',
        email: '',
        kontak: '',
        password: ''
    })

    const { nama, email, kontak, password } = userData;
    console.log(userData)
    console.log(nama)
    console.log(email)
    console.log(kontak)

    console.log(props.match.params.id)

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
        updateUserData({nama,email,kontak,password})
        history.push(`/profile/${props.match.params.id}`)
        
    }

    const handlePassword = (e) => {
        e.preventDefault()
        setSeen(!seen)
    }
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
                            <form id="form-profile" onSubmit={onSubmitEdit}>
                            <div className="col"> 
                            
                                <div className="form-profile-page">
                                    <div className="data">
                                        <label>Nama</label><br/>
                                        <input className="show-profile" type="text" name='nama' value={nama} onChange={onChange}></input>
                                    </div>

                                    <div className="data">
                                        <label>Instansi</label><br/>
                                        <div className="persist" type="text">{userDetail && userDetail.instansi.nama}</div>
                                    </div>

                                    <div className="data">
                                        <label>Role</label><br/>
                                        <div className="persist" type="text">{(userDetail && userDetail.role) === 'owner' ? 'Owner' : ((userDetail && userDetail.role) === 'super_admin' ? 'Super Admin' : 'Admin' )}</div>
                                    </div>

                                    <div className="data">
                                        <label>Username</label><br/>
                                        <div className="persist" type="text">{userDetail && userDetail.username}</div>
                                    </div>

                                    <div className="data">
                                        <label>Password</label><br/>
                                        <input className="show-profile" type={seen ? "text" : "password"} name='password' value={password} onChange={onChange}></input>
                                        <button className="button-password" style={{border:'none',  padding:'0' , height:'30px', width:'30px' , borderRadius:'3px' , backgroundColor:'white'}} onClick={handlePassword}>
                                            <i class='fas fa-eye' style={{fontSize:'20px' , textAlign:'center'}}></i>
                                        </button>
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
                                        type="submit"
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

export default ProfileEdit;