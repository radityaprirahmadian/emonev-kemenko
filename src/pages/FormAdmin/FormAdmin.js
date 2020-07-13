import React,{Component,Fragment,useContext,useState,useEffect} from 'react';
import './FormAdmin.css';
import axios from 'axios';
import trash from '../../assets/trash.png';
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import {LayoutContext} from '../../context/Layout/LayoutContext'
import {Link, useHistory} from 'react-router-dom';
import { AuthContext } from '../../context/Auth/AuthContext'
import Popup from '../../component/Popup/Popup';
import bg_1 from '../../assets/decoration/bg_1.png'
import bg_2 from '../../assets/decoration/bg_2.png'
import bg_3 from '../../assets/decoration/bg_3.png'
import bg_4 from '../../assets/decoration/bg_4.png'
import Spinner from '../../component/Spinner/Spinner'

const FormAdmin = (props) => {
        const { user, token,userDetail } = useContext(AuthContext);
        const history = useHistory();
        const [allInstansi, setAllInstansi] = useState([])
        const [loading, setLoading] = useState(false)
        const { sidebar } = useContext(LayoutContext)
        const [admin, setAdmin] = useState({
            nama: '',
            instansi: '',
            role: 'admin',
            username: '',
            password: '',
            email: ''
        })

        const [seen, setSeen] = useState(false)

        const { nama, instansi, role, username, password, email } = admin
        console.log(admin)

        const onChange = (e) =>{
            return setAdmin({
                ...admin,
                [e.target.name] : e.target.value
            })
        }

        const onLoad = (e) =>{
            console.log(e)
            return setAdmin({
                ...admin,
                [e.target.name] : e.target.value
            })
        }

        useEffect(() => {
            if(user && user.role === 'super_admin'){
                setAdmin({
                    ...admin,
                    role:'admin',
                    instansi: user && user.instansi.nama_pendek
                })
            }
        },[user])

        useEffect(() => {
            axios.get('https://api.simonev.revolusimental.go.id/api/v1/instansi')
            .then(res => {
                setAllInstansi(res.data.instansi)
                console.log(res.data)
            })
            .catch(err => {
                console.log('wow', +err)
            })
        }, [])


        const addNewAdmin = async (formData) => {
            setLoading(true)
            const config = {
                headers: {
                    'X-Auth-Token': `aweuaweu ${token}`,
                    'Content-Type': 'application/json'
                }
            }
            try {
                const res = await axios.post(`https://api.simonev.revolusimental.go.id/api/v1/user`,formData,config)
                alert(res.data.message)
                history.push(`/${userDetail && userDetail.role === 'owner' ? 'super-admin' : 'admin'}/kelola-admin`)
            }
            catch (err) {
                alert(err.response.data.message)
            }
            setLoading(false)
        }

        const onSubmit = (e) => {
            e.preventDefault()
            addNewAdmin({
                nama,
                instansi,
                role,
                username,
                password,
                email
            })
        }


        const handlePassword = (e) => {
            e.preventDefault()
            setSeen(!seen)
        }

        
    const onKeyPress = (e) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            addNewAdmin({
                nama,
                instansi,
                role,
                username,
                password
            })
        }
      }

        return(
          <Fragment>
            <SideBarOff setId={props.setId}/>
              <Popup notif={props.notif}/>
                <div className="background-after-login">
                    <img src={bg_1} alt='bg1' style={{position: 'fixed' , top:'0' , left: '0'}}/>
                    <img src={bg_2} alt='bg2' style={{position: 'fixed' , top:'0' , right: '0'}}/>
                    <img src={bg_3} alt='bg3' style={{position: 'fixed' , bottom:'-200px' , left: '0'}}/>
                    <img src={bg_4} alt='bg4' style={{position: 'fixed' , bottom:'-50px' , right: '0'}}/>
                </div>
              <div className="tajuk-page">
                  <h1> FORM ADMIN</h1>
              </div>
              {
                    loading ?
                        <div style={{ marginLeft: '68px' }}>
                            <div className="d-flex justify-content-center align-items-center" style={{ width: '100%', height: '60vh', overflow: 'hidden' }}>
                                <Spinner />
                            </div>
                        </div>
                        :
                        <div style={sidebar ? {marginLeft:'188px', transition: 'all 0.3s ease-in-out'} : {transition: 'all 0.3s ease-in-out'}}>
                            <div style={{width:'fit-content' , height:'fit-content' , margin:'auto'}}>
                            <div className="admin-1-container" style={sidebar ? {width:'1050px', transition: 'all 0.3s ease-in-out'} : {transition: 'all 0.3s ease-in-out'}}>
                                    <form id='form-admin' className="form-admin-1" onSubmit={onSubmit} autoComplete="off">
                                        <div>
                                            <label>Nama</label>
                                            <input 
                                                className="admin-nama" 
                                                type="text" 
                                                name="nama" 
                                                value={nama} 
                                                onChange={onChange} 
                                                onKeyPress={onKeyPress}
                                                required
                                            />
                                        </div>
                                        <div>
                                            {
                                                user && user.role === 'owner' ?
                                                <Fragment>
                                                    <label>Instansi</label>
                                                    <select className="admin-instansi" name="instansi" onChange={onChange} onKeyPress={onKeyPress} required>
                                                        <option value="" defaultValue="" hidden></option>
                                                            {
                                                                allInstansi.map((instansi,index) => {
                                                                    return(
                                                                        <option key={index} value={instansi.nama_pendek}>{instansi.nama_pendek}</option>
                                                                    )
                                                                })

                                                            }
                                                    </select>
                                                </Fragment>
                                                : ''
                                            }
                                        </div>
                                        <div>
                                            <label style={{textAlign:'right', clear:'both' , float:'left' , marginTop: '15px'}}>Level</label>
                                            <div className="admin-role" name="role" value='admin' style={{border: '1px solid #ACACAC' , marginLeft:'210px' ,lineHeight:'42px' , paddingLeft: '5px' , fontWeight:'600'}}>
                                                Admin
                                            </div>
                                        </div>
                                        <div>
                                            <label>Username</label>
                                            <input 
                                                className="admin-username" 
                                                type="text" 
                                                name="username" 
                                                value={username} 
                                                onChange={onChange}
                                                required 
                                                onKeyPress={onKeyPress}
                                            />
                                        </div>
                                        <div>
                                            <label>Kata Sandi</label>
                                            <input 
                                                className="admin-password" 
                                                type={seen ? "text" : "password"} 
                                                name="password" 
                                                value={password} 
                                                onChange={onChange}
                                                required 
                                                onKeyPress={onKeyPress}
                                            />
                                            <button className="button-password" style={{border:'none',  padding:'0' , height:'30px', width:'30px' , borderRadius:'3px' , background:'#C4C4C4'}} onKeyPress={onKeyPress} onClick={handlePassword}>
                                                    {
                                                        seen ?
                                                            <i class='fa fa-eye-slash' style={{fontSize:'20px' , textAlign:'center'}}></i>                                        
                                                        :
                                                            <i class='fas fa-eye' style={{fontSize:'20px' , textAlign:'center'}}></i>
                                                    }
                                            </button>
                                        </div>
                                        <div>
                                            <label>Email</label>
                                            <input 
                                                className="admin-role" 
                                                type="email" 
                                                name="email" 
                                                value={email} 
                                                onChange={onChange}
                                                required 
                                                onKeyPress={onKeyPress}
                                            />
                                        </div>
                                    </form>

                                    <div className="admin-navigation-button" style={{textAlign:'right'}}>
                                        <input className="button-daftar" form='form-admin' type='submit' value='DAFTAR'></input>
                                    </div>
                                    </div>
                                </div>
                </div>
              }
          </Fragment>  
        );
}

export default FormAdmin;