import React, {useState,Fragment,useEffect} from 'react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import Topbar from '../../component/Topbar/Topbar'
import aset_1 from '../../assets/decoration/aset_1.png'
import aset_2 from '../../assets/decoration/aset_2.png'
import aset_3 from '../../assets/decoration/aset_3.png'
import aset_4 from '../../assets/decoration/aset_4.png'
import aset_5 from '../../assets/decoration/aset_5.png'
import aset_6 from '../../assets/decoration/aset_6.png'
import aset_7 from '../../assets/decoration/aset_7.png'
import Spinner from '../../component/Spinner/Spinner'

const LupaPassword = (props) => {
    const token = new URLSearchParams(props.location.search).get('token')
    const history = useHistory()
    const [user,setUser] = useState({})
    const [insertPassword,setInsertPassword] = useState(false)
    const [loading , setLoading] = useState(false)
    const [wow,setEmail] = useState({
        email:''
    })
    const {email} = wow

    const onChangeEmail = (e) => {
        return setEmail({
            [e.target.name]: e.target.value
        })
    }

    const postEmail = async (data) => {
        setLoading(true)
        console.log(data)
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        try {
            const res = await axios.post(`https://api.simonev.revolusimental.go.id/api/v1/lupa-password`,data)
            alert(res.data.message)
            history.push('/login')
        }
        catch (err) {
            console.log(err)
            alert(err.data.message)
        }
        setLoading(false)
    }

    const onSubmitEmail = (e) => {
        e.preventDefault()
        postEmail(wow)
    }

    const cekToken = async () => {
        const config= {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`
            }
        }
        try {
            const res = await axios.get('https://api.simonev.revolusimental.go.id/api/v1/auth', config)
            setUser(res.data.user)
        }
        catch (err) {    
            alert('TOKEN KADALUARSA') 
            history.push('/login')
        }
    }

    const [seen1, setSeen1] = useState(false)
    const [seen2, setSeen2] = useState(false)
    const [pass , setPassword] = useState({
        password:'',
        confirm: '',
        err: '',
        disable: true,
    })

    const {
        password,
        confirm,
        err,
        disable,
    } = pass

    console.log(password)
    console.log(confirm)

    const onChange = (e) => {
        return(
            setPassword({
                ...pass,
                [e.target.name]: e.target.value
            })
        )
    }

    useEffect(() => {
        if(password && confirm){
            if(password === confirm) {
                setPassword({
                    ...pass,
                    err: 'Password Sama',
                    disable: false,
                })
            } else {
                setPassword({
                    ...pass,
                    err: 'Password Tidak Sama',
                    disable: true
                })
            }
        } else {
            setPassword({
                ...pass,
                err: '',
                disable: true
            })
        }
    },[confirm,password])

    const changePassword = async (formData) => {
        console.log(formData)
        console.log(user)
        const config={
            headers: {
                'X-Auth-Token' : `aweuaweu ${token}`,
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.put(`https://api.simonev.revolusimental.go.id/api/v1/user/${user && user._id}`,formData,config)
            alert(res.data.message)        
            history.push('/login')
        
        } 
        catch(err){
            console.log(err)
        }
    }

    const onSubmit = (e) => {
        e.preventDefault()
        changePassword({
            password
        })
    }

    const onKeyPress = (e) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            changePassword({
                password
            })
        }
      }


    const handlePassword = (e) => {
        e.preventDefault()
        setSeen1(!seen1)
    }

    const confirmPassword = (e) => {
        e.preventDefault()
        setSeen2(!seen2)
    }

    useEffect(() => {
        if(token) {
            cekToken()
            setInsertPassword(true)
        }
    },[token])


    return(
        <Fragment>
            <Topbar kunci={false}/>

            {
                loading ? 
                    <div style={{ marginLeft: '68px' }}>
                        <div className="d-flex justify-content-center align-items-center" style={{ width: '100%', height: '60vh', overflow: 'hidden' }}>
                            <Spinner />
                        </div> 
                    </div>
                :
                <Fragment>
                {
                    !insertPassword ?
                        <div className="login-page">
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
                                    <div className="header-ubah">
                                        <h1>LUPA KATA SANDI?</h1>
                                    </div>
                                    <div className="body-ubah">
                                    
                                        <h1>Masukkan alamat email Anda yang terkait <br/> dengan akun Anda</h1>
                                        <form onSubmit={onSubmitEmail} autoComplete='off'>
                                            <div>
                                                <input className="input-ubah1" style={{marginLeft:'0'}}  type="email" name="email" value={email} onChange={onChangeEmail} placeholder="Alamat Email"/>
                                            </div>

                                            <button className="button-ubah" type="submit" style={{width:'415px'}}>KIRIM LINK RESET KATA SANDI</button>
                                        </form>


                                        <img src={aset_4} alt='decoration 4' style={{bottom:'0' , left: '39px'}}/>
                                        <img src={aset_5} alt='decoration 5' style={{bottom:'-27px' , right: '-16px'}}/>
                                        <img src={aset_6} alt='decoration 6' style={{top:'0' , right: '32px'}}/>
                                        <img src={aset_7} alt='decoration 7' style={{top:'8px' , left: '12.53px'}}/> 
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="login-page">
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
                                    <div className="header-ubah">
                                        <h1>UBAH KATA SANDI</h1>
                                    </div>
                                    <div className="body-ubah">
                                        <h1>Halo {user && user.nama},</h1>
                                        <h1>Silahkan mengisi kata sandi baru anda</h1>

                                        <form onSubmit={onSubmit} autoComplete="off">
                                            <div>
                                                <input className="input-ubah"  type={seen1 ? "text" : "password"}  required name='password' value={password} onChange={onChange} onKeyPress={onKeyPress} placeholder="Kata sandi baru"/>
                                                <button className="button-password" style={{border:'none',  padding:'0' , height:'30px', width:'30px' , borderRadius:'3px' , backgroundColor:'white'}} onClick={handlePassword}>
                                                        {
                                                            seen1 ?
                                                                <i class='fa fa-eye-slash' style={{fontSize:'20px' , textAlign:'center'}}></i>                                        
                                                            :
                                                                <i class='fas fa-eye' style={{fontSize:'20px' , textAlign:'center'}}></i>
                                                        }
                                                </button>
                                            </div>
                                            <div>
                                                <input className="input-ubah"  type={seen2 ? "text" : "password"}  required name='confirm' value={confirm} onChange={onChange} onKeyPress={onKeyPress} placeholder="Konfirmasi kata sandi baru"/>
                                                <button className="button-password" style={{border:'none',  padding:'0' , height:'30px', width:'30px' , borderRadius:'3px',backgroundColor:'white'}} onClick={confirmPassword}>
                                                        {
                                                            seen2 ?
                                                                <i class='fa fa-eye-slash' style={{fontSize:'20px' , textAlign:'center'}}></i>
                                                            :
                                                                <i class='fas fa-eye' style={{fontSize:'20px' , textAlign:'center'}}></i>
                                                        }
                                                </button>
                                            </div>

                                            

                                            {
                                                disable ?
                                                    <Fragment>
                                                        <div className="pesan-ubah" style={{color:'red' , left: '182px'}}>{err}</div>
                                                        <button className="button-ubah" type="submit" disabled style={{backgroundColor:'grey'}}>UBAH KATA SANDI</button>
                                                    </Fragment>
                                                :
                                                    <Fragment>
                                                        <div className="pesan-ubah" style={{color:'green' , left: '210px'}}>{err}</div>
                                                        <button className="button-ubah" type="submit">UBAH KATA SANDI</button>
                                                    </Fragment>
                                            }
                                        </form>


                                    </div>

                                    <img src={aset_4} alt='decoration 4' style={{bottom:'0' , left: '39px'}}/>
                                    <img src={aset_5} alt='decoration 5' style={{bottom:'-27px' , right: '-16px'}}/>
                                    <img src={aset_6} alt='decoration 6' style={{top:'0' , right: '32px'}}/>
                                    <img src={aset_7} alt='decoration 7' style={{top:'8px' , left: '12.53px'}}/> 
                                </div>
                            
                            </div>
                        </div>
                        }
                    </Fragment>
                }
        </Fragment>
    )
}

export default LupaPassword;