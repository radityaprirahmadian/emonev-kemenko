import React,{Component,Fragment, useContext, useState, useEffect} from 'react';
import './ProfileEdit.css';
import axios from 'axios';
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import lock from '../../assets/lock.png';
import {Link, useHistory} from 'react-router-dom';
import { AuthContext } from '../../context/Auth/AuthContext'
import Popup from '../../component/Popup/Popup';
import bg_1 from '../../assets/decoration/bg_1.png'
import bg_2 from '../../assets/decoration/bg_2.png'
import bg_3 from '../../assets/decoration/bg_3.png'
import bg_4 from '../../assets/decoration/bg_4.png'
import Spinner from '../../component/Spinner/Spinner'
import Notification from '../../component/Notification/Notification';

const ProfileEdit = (props) => {

    const { token, getUserDetail,user, userDetail } = useContext(AuthContext);
    const history = useHistory();
    const [ loading , setLoading ] = useState(true)
    const [seen, setSeen] = useState(false)
    const [foto, setFoto] = useState([])

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
    })

    const [ isFoto , setIsFoto ] = useState(false)

    const { nama, email, kontak } = userData;
    console.log(userData)
    console.log(nama)
    console.log(email)
    console.log(kontak)

    const [ fotos, setFotos] = useState();
    const onChangeFiles = (event) => {
        setIsFoto(true)
        setFoto([...event.target.files])
        if(event.target.files && event.target.files[0]){
            setFotos(URL.createObjectURL(event.target.files[0]))
        }
    }

    const getUserToUpdate = async () => {
        setLoading(true)
        const config = {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`
            }
        }
        try {
            const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/user/${props.match.params.id}`,config)
            console.log(res.data)
            setUserData({nama: res.data.user.nama , email:res.data.user.email , kontak: res.data.user.kontak})
        }
        catch (err) {
            console.log(err)
        }
        setLoading(false)
    }

    useEffect (() => {
        getUserToUpdate()
    }, [props.match.params.id])


    const onChange = (e) => {
        return setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
        
    }

    useEffect(() => {
        const wow = `https://api.simonev.revolusimental.go.id${userDetail&&userDetail.foto}`
        setFotos(wow)
    },[userDetail])

    const updateUserData = async (formData) => {
        setLoading(true)
        console.log(formData)
        const config = {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`,
                'Content-Type': 'application/json'
            }
        }
        try {
            const res = await axios.put(`https://api.simonev.revolusimental.go.id/api/v1/user/${props.match.params.id}`,formData,config)
            alert(res.data.message)
            if(isFoto) {
                updateUserPhoto()
            } else {
                history.push(`/${userDetail&&userDetail.role === 'owner' ? 'super-admin' : 'admin'}/profile/${props.match.params.id}`)
                window.location.reload()
            }
            console.log(res)
        }
        catch (err) {
            alert(err.message)
            console.log(err)
        }
        setLoading(true)
    }

    const updateUserPhoto = async () => {
		const formData = new FormData()

        if (foto.length > 0) {
            for (let i = 0; i < foto.length; i++) {
                formData.append(`foto`, foto[i])
            }
        }  else {formData.append('foto', new File([null], 'blob'))}

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
            const res = await axios.put(`https://api.simonev.revolusimental.go.id/api/v1/user/${props.match.params.id}/foto`,formData,config)
            alert(res.data.message)
            history.push(`/${userDetail&&userDetail.role === 'owner' ? 'super-admin' : 'admin'}/profile/${props.match.params.id}`)
            window.location.reload()
        }
        catch (err) {
            alert(err.message)
        }
    }

    const onSubmitEdit = (e) => {
        e.preventDefault();
        updateUserData({nama,email,kontak})
    }

    const handlePassword = (e) => {
        e.preventDefault()
        setSeen(!seen)
    }

    console.log(foto)
        return(
            <Fragment>
                <SideBarOff/>
                <Popup notif={props.notif}/>
                <div className="background-after-login">
                    <img src={bg_1} alt='bg1' style={{position: 'fixed' , top:'0' , left: '0'}}/>
                    <img src={bg_2} alt='bg2' style={{position: 'fixed' , top:'0' , right: '0'}}/>
                    <img src={bg_3} alt='bg3' style={{position: 'fixed' , bottom:'-200px' , left: '0'}}/>
                    <img src={bg_4} alt='bg4' style={{position: 'fixed' , bottom:'-50px' , right: '0'}}/>
                </div>
                <div className="profile-page" style={{marginRight:'20px' , marginTop:'23px'}}>
                    <div className="tajuk-page-2">
                        <div>UBAH PROFIL</div>
                        {
                            user && user.role === 'owner' ?
                                ''
                            :
                                <Notification/>
                        }
                    </div>
                    {
                    loading ?
                        <div style={{ marginLeft: '68px' }}>
                            <div className="d-flex justify-content-center align-items-center" style={{ width: '100%', height: '60vh', overflow: 'hidden' }}>
                                <Spinner />
                            </div> 
                        </div>
                        :
                    <div className="container-fluid">
                            <form id="form-profile" onSubmit={onSubmitEdit}>
                            <div className="row">
                            <div className="col"> 
                            
                                <div className="form-profile-page">
                                    <div className="data">
                                        <label>Nama</label><br/>
                                        <input className="show-profile" type="text" name='nama' value={nama} onChange={onChange}></input>
                                    </div>

                                    <div className="data">
                                        <label>Instansi</label><br/>
                                        <div className="persist" type="text">{userDetail && userDetail.instansi.nama_pendek}</div>
                                        <div className="button-lock" >
                                            <img src={lock} alt="lock" style={{border:'none',  padding:'0' , top:'-40px' , left:'600px' , height:'30px', width:'30px' , backgroundColor: 'none', borderRadius:'3px' , position:'relative'}}/>
                                        </div>
                                    </div>

                                    <div className="data">
                                        <label>Role</label><br/>
                                        <div className="persist" type="text">{(userDetail && userDetail.role) === 'owner' ? 'Owner' : ((userDetail && userDetail.role) === 'super_admin' ? 'Super Admin' : 'Admin' )}</div>
                                        <div className="button-lock" >
                                            <img src={lock} alt="lock" style={{border:'none',  padding:'0' , top:'-40px' , left:'600px' , height:'30px', width:'30px' , backgroundColor: 'none', borderRadius:'3px' , position:'relative'}}/>
                                        </div>
                                    </div>

                                    <div className="data">
                                        <label>Username</label><br/>
                                        <div className="persist" type="text">{userDetail && userDetail.username}</div>
                                        <div className="button-lock" >
                                            <img src={lock} alt="lock" style={{border:'none',  padding:'0' , top:'-40px' , left:'600px' , height:'30px', width:'30px' , backgroundColor: 'none', borderRadius:'3px' , position:'relative'}}/>
                                        </div>
                                    </div>

                                    {/* <div className="data">
                                        <label>Password</label><br/>
                                        <input className="show-profile" type={seen ? "text" : "password"} name='password' value={password} onChange={onChange}></input>
                                        <button className="button-password" style={{border:'none',  padding:'0' , top:'-40px' , left:'600px' , height:'30px', width:'30px' , borderRadius:'3px' , backgroundColor:'white', position:'relative'}} onClick={handlePassword}>
                                            <i class='fas fa-eye' style={{fontSize:'20px' , textAlign:'center'}}></i>
                                        </button>
                                    </div> */}

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

                            <div className="col">
                                <div className="photo-profile-page">
                                    <label>Foto Profil</label><br/>
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
                                    <Link to={`/${userDetail&&userDetail.role === 'owner' ? 'super-admin' : 'admin'}/profile/${userDetail && userDetail._id}`}>
                                    <button 
                                        type="submit"
                                        className="button-submit-profile"    
                                    > BATAL
                                    </button>
                                    </Link>

                                    <input 
                                            form="form-profile"
                                            type="submit"
                                            className="button-submit-profile-edit"
                                            value="SIMPAN"
                                        > 
                                    </input>
                                </div>

                            </div>
                        </div>
                            </form>
                    </div>
                    }
                </div>
            </Fragment>
        );
}

export default ProfileEdit;