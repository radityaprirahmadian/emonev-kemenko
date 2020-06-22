import React,{Component,Fragment,useContext,useState,useEffect} from 'react';
import './FormAdmin.css';
import axios from 'axios';
import trash from '../../assets/trash.png';
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import {Link, useHistory} from 'react-router-dom';
import { AuthContext } from '../../context/Auth/AuthContext'
import Popup from '../../component/Popup/Popup';
import bg_1 from '../../assets/decoration/bg_1.png'
import bg_2 from '../../assets/decoration/bg_2.png'
import bg_3 from '../../assets/decoration/bg_3.png'
import bg_4 from '../../assets/decoration/bg_4.png'

const FormAdmin = (props) => {
        const { user, token,userDetail } = useContext(AuthContext);
        const history = useHistory();
        const [allInstansi, setAllInstansi] = useState([])

        const [admin, setAdmin] = useState({
            nama: '',
            instansi: '',
            role: 'admin',
            username: '',
            password: ''
        })

        const [seen, setSeen] = useState(false)

        const { nama, instansi, role, username, password } = admin
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
            axios.get('https://test.bariqmbani.me/api/v1/instansi')
            .then(res => {
                setAllInstansi(res.data.instansi)
                console.log('wow')
            })
            .catch(err => {
                console.log('wow', +err)
            })
        }, [])


        const addNewAdmin = async (formData) => {
            const config = {
                headers: {
                    'X-Auth-Token': `aweuaweu ${token}`,
                    'Content-Type': 'application/json'
                }
            }
            try {
                const res = await axios.post(`https://test.bariqmbani.me/api/v1/user`,formData,config)
                alert(res.data.message)
                history.push(`/${userDetail && userDetail.role === 'owner' ? 'super-admin' : 'admin'}/kelola-admin`)
            }
            catch (err) {
                console.log(err)
            }
        }

        const onSubmit = (e) => {
            e.preventDefault()
            addNewAdmin({
                nama,
                instansi,
                role,
                username,
                password
            })
        }

        const handlePassword = (e) => {
            e.preventDefault()
            setSeen(!seen)
        }

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
              <div className="tajuk-page">
                  <h1> FORM ADMIN</h1>
              </div>
              <div className="admin-1-container">
                    <form id='form-admin' className="form-admin-1" onSubmit={onSubmit} autoComplete="off">
                        <div>
                            <label>Nama</label>
                            <input 
                                className="admin-nama" 
                                type="text" 
                                name="nama" 
                                value={nama} 
                                onChange={onChange} 
                                required
                            />
                        </div>
                        <div>
                            {
                                user && user.role === 'owner' ?
                                <Fragment>
                                    <label>Instansi</label>
                                    <select className="admin-instansi" name="instansi" onChange={onChange} required>
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
                            />
                        </div>
                        <div>
                            <label>Password</label>
                            <input 
                                className="admin-password" 
                                type={seen ? "text" : "password"} 
                                name="password" 
                                value={password} 
                                onChange={onChange}
                                required 
                            />
                            <button className="button-password" style={{border:'none',  padding:'0' , height:'30px', width:'30px' , borderRadius:'3px' , background:'#C4C4C4'}} onClick={handlePassword}>
                                    {
                                        seen ?
                                            <i class='fa fa-eye-slash' style={{fontSize:'20px' , textAlign:'center'}}></i>                                        
                                        :
                                            <i class='fas fa-eye' style={{fontSize:'20px' , textAlign:'center'}}></i>
                                    }
                            </button>
                        </div>
                    </form>

                    <div className="admin-navigation-button">
                        <input className="button-daftar" form='form-admin' type='submit' value='DAFTAR'></input>
                    </div>
                </div>
          </Fragment>  
        );
}

export default FormAdmin;