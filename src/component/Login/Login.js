import React,{ useState, useContext, Fragment, useEffect } from 'react';
import './Login.css';
import axios from 'axios'
import Topbar from '../Topbar/Topbar';
import login_cover from '../../assets/login_cover.png';
import { Link, useHistory, withRouter } from 'react-router-dom';
import { AuthContext } from '../../context/Auth/AuthContext'
import NewPassword from '../NewPassword/NewPassword';
import { NotifContext } from '../../context/Notifikasi/NotifContext';

const Login = (props) => {
    const { isAuthenticated, login, fail, token, loadUser, user, remember, rememberToken, userDetail } = useContext(AuthContext);
    const {  allReminder, reminder, setAllReminder , getReminder } = useContext(NotifContext)
    const history = useHistory();

    const [users, setUser] = useState ({
        username: '',
        password: ''
    })

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
            props.history.push('/dashboard')
        }
    })

    useEffect(() => {
        console.log('a')
        getReminder()
    },[])

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
                            <div className="login-page-left">
                                <div className="login-page-left-title">
                                    <h1>LOGIN</h1>
                                    <h2>E-Report</h2>
                                </div>
    
                                <form className="form-login" onSubmit={onSubmit}> 
                                    <input 
                                        type="text" 
                                        className="username" 
                                        name="username" 
                                        value={username} 
                                        placeholder="Username" 
                                        required
                                        onChange={onChange}
                                    /> <br/>
    
                                    <input 
                                        type="password" 
                                        className="password" 
                                        name="password" 
                                        value={password}
                                        required
                                        placeholder="Password"
                                        onChange={onChange}
                                    />
    
                                    <br/>
                                    <div >
                                        <label className="ingat-saya">Ingat Saya
                                            <input type="checkbox" className="checkbox" onClick={setChecked}/>
                                            <span className="checkmark"></span>
                                        </label>
                                    </div>
    
                                    <button className="button-login" type="submit">MASUK</button>
                                </form>
                            
                            <Link to='/lupa-password'>
                                <div style={{marginLeft:'300px', fontWeight:'bold' , fontSize:'18px' , marginTop:'10px', cursor:'pointer'}}>Lupa Password?</div>
                            </Link>
                            </div>
                            
    
    
                            
                            <div className="spacer"></div>
                            
                            <div className="login-page-right">
                                <img src={login_cover} className="login-cover"/>
                            </div>
                        </div>
                        </Fragment>
                }

                
            </Fragment>
        );

}

export default Login;