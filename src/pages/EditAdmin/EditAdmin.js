import React,{Component,Fragment, useContext, useState, useEffect} from 'react';
import '../Profile/ProfileEdit.css';
import axios from 'axios';
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import lock from '../../assets/lock.png';
import {Link, useHistory} from 'react-router-dom';
import { AuthContext } from '../../context/Auth/AuthContext'
import Popup from '../../component/Popup/Popup';

const EditAdmin = (props) => {
    const { user, token, getUserDetail, userDetail } = useContext(AuthContext);
    const history = useHistory();
    const [foto, setFoto] = useState([])

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

    const [ fotos, setFotos] = useState();
    const onChangeFiles = (event) => {
        setFoto([...event.target.files])
        if(event.target.files && event.target.files[0]){
            setFotos(URL.createObjectURL(event.target.files[0]))
        }
    }

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
            const res = await axios.put(`https://test.bariqmbani.me/api/v1/user/${props.match.params.id}`,formData,config)
            alert(res.data.message)
            history.push(`/admin`)
        }
        catch (err) {
            console.log(err)
        }
    }

    const updateUserPhoto = async () => {
		const formData = new FormData()

		for (let i = 0; i < foto.length; i++) {
			formData.append(`foto`, foto[i])
		}

		for (let pair of formData.entries()) {
			console.log(pair[0] + ', ' + pair[1])
        }
        
        const config = {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        }
        try {
            const res = await axios.put(`https://test.bariqmbani.me/api/v1/user/${props.match.params.id}/foto`,formData,config)
            console.log(res.data.message)
        }
        catch (err) {
            console.log(err.data)
        }
    }

    const onSubmitEdit = (e) => {
        e.preventDefault();
        updateUserPhoto()
        updateUserData({nama,email,kontak,role,username})
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
                                        <div className="button-lock" >
                                            <img src={lock} alt="lock" style={{border:'none',  padding:'0' , top:'-40px' , left:'600px' , height:'30px', width:'30px' , backgroundColor: 'none', borderRadius:'3px' , position:'relative'}}/>
                                        </div>
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
                                                <img src={fotos}></img>
                                            </div>
                                            <u><h1><label htmlFor='testing' className='upload_foto'>Ganti Foto</label></h1></u>
                                            <input 
                                                id="testing"
                                                className="gnrm-penjelasan" 
                                                style={{height: "42px", 
                                                        marginLeft: "28px", 
                                                        width: "955px"}} 
                                                onChange={onChangeFiles}
                                                type="file"
                                                accept="image/*"
                                                name="media"
                                            />
                                        </div>
                                    <button 
                                        disabled
                                        style={{pointer:'none'}}
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