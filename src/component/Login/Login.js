import React,{ useState, useContext, Fragment, useEffect } from 'react';
import './Login.css';
import axios from 'axios'
import Topbar from '../Topbar/Topbar';
import login_cover from '../../assets/login_cover.png';
import { Link, useHistory, withRouter } from 'react-router-dom';
import { AuthContext } from '../../context/Auth/AuthContext'
import NewPassword from '../NewPassword/NewPassword';
import { NotifContext } from '../../context/Notifikasi/NotifContext';
import aset_1 from '../../assets/decoration/aset_1.png'
import aset_2 from '../../assets/decoration/aset_2.png'
import aset_3 from '../../assets/decoration/aset_3.png'
import aset_4 from '../../assets/decoration/aset_4.png'
import aset_5 from '../../assets/decoration/aset_5.png'
import aset_6 from '../../assets/decoration/aset_6.png'
import aset_7 from '../../assets/decoration/aset_7.png'
import Spinner from '../../component/Spinner/Spinner'


const Login = (props) => {
    const { isAuthenticated, login, fail, token, loadUser, user, remember, rememberToken, userDetail, loading } = useContext(AuthContext);
    const history = useHistory();

    const [users, setUser] = useState ({
        username: '',
        password: ''
    })

    const [seen, setSeen] = useState(false)

    const [lupaPassword , setLupaPassword ] = useState(false)

    const { username, password } = users;

    const onChange = (e) => {
        return setUser({
            ...users,
            [e.target.name]: e.target.value
        })
        
    }

    const onLupaPassword = (e) => {
        e.preventDefault()
        setLupaPassword(true)
    }

    const handlePassword = (e) => {
        e.preventDefault()
        setSeen(!seen)
    }


    const setChecked = (e) => {
        rememberToken()
    }

    useEffect(() => {
		if (isAuthenticated || token) {
            loadUser()
        }
		//eslint-disable-next-line
    }, [isAuthenticated, props.history])
    
    useEffect(() => {
        console.log(userDetail)
        if(userDetail && !userDetail.login_awal) {
            props.setId(userDetail._id)
            props.history.push(`/${userDetail.role === 'owner' ? 'super-admin' : 'admin'}/dashboard`)
        }
    })

    const onSubmit = (e) => {
        e.preventDefault();
        login ({
            username,
            password,
        });
    }

        return(
            <Fragment>
                <Topbar kunci={false}/>
                {
                    userDetail  ? 
                        <Fragment>
                            {
                                userDetail && userDetail.login_awal ?
                                    <NewPassword/> 
                                :
                                ''    
        
                            }
                        </Fragment>

                    :

                    <Fragment>
                        <div className="login-page">
                        {
                            loading ?  
                            <div style={{ marginLeft: '68px' }}>
                                <div className="d-flex justify-content-center align-items-center" style={{ width: '100%', height: '60vh', overflow: 'hidden' }}>
                                    <Spinner />
                                </div> 
                            </div>
                            :
                            <div className="row" style={{margin:'auto' , width:'1134px', height:'506px', marginTop:'173px'}}>
                                <div className="col-5 login" style={{width:'424px'}}>
                                    <div className="login-page-left-title">
                                        <h1>LOGIN</h1>
                                        <h1>E-REPORT</h1>
                                    </div>
                                    <img src={aset_1} alt='decoration 1' style={{bottom:'23px' , left: '16px'}}/>
                                    <img src={aset_2} alt='decoration 2' style={{top:'17px' , right: '18px'}}/>
                                    <img src={aset_3} alt='decoration 3' style={{bottom:'23px' , right: '34px'}}/> 
                                </div>

                                
                                <div className="col-7 login" style={{width:'693px'}}>
                                    <form className="form-login" autoComplete="off" onSubmit={onSubmit}> 
                                        <label style={{fontSize:"24px" , fontWeight:'700', marginTop:'32px', marginLeft:'15px'}}>Nama Akun</label><br/>
                                        <input 
                                            type="text" 
                                            className="username" 
                                            name="username" 
                                            value={username} 
                                            required
                                            onChange={onChange}
                                        /> <br/>

                                        <label style={{fontSize:"24px" , fontWeight:'700', marginTop:'27px',marginLeft:'15px'}}>Kata Sandi</label><br/>
                                        <input 
                                            type={seen? "text" : "password"} 
                                            className="password" 
                                            name="password" 
                                            value={password}
                                            required
                                            onChange={onChange}
                                        />
                                        <button className="button-password" style={{border:'none',  padding:'0' , height:'30px', width:'30px' , borderRadius:'3px' , backgroundColor:'white'}} onClick={handlePassword}>
                                                        {
                                                            seen ?
                                                                <i class='fa fa-eye-slash' style={{fontSize:'20px' , textAlign:'center'}}></i>                                        
                                                            :
                                                                <i class='fas fa-eye' style={{fontSize:'20px' , textAlign:'center'}}></i>
                                                        }
                                        </button>
                                        <br/>
                                        <div >
                                            <label className="ingat-saya">Tetap Masuk
                                                <input type="checkbox" className="checkbox" onClick={setChecked}/>
                                                <span className="checkmark"></span>
                                            </label>
                                        </div>
        
                                        <button className="button-login" type="submit">MASUK</button>
                                    </form>
                                    <Link to='/lupa-password'>
                                        <div style={{marginLeft:'224px' , fontSize:'18px' , marginTop:'10px', cursor:'pointer'}}>Lupa Kata Sandi?</div>
                                    </Link>

                                    <img src={aset_4} alt='decoration 4' style={{bottom:'0' , left: '39px'}}/>
                                    <img src={aset_5} alt='decoration 5' style={{bottom:'-27px' , right: '-16px'}}/>
                                    <img src={aset_6} alt='decoration 6' style={{top:'0' , right: '32px'}}/>
                                    <img src={aset_7} alt='decoration 7' style={{top:'8px' , left: '39px'}}/> 
                                </div>
                            
                            </div>
                            }
                        </div>
                        </Fragment>

                }

                
            </Fragment>
        );

}

export default Login;