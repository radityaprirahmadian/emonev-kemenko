import React, {useState,Fragment,useEffect} from 'react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import Topbar from '../../component/Topbar/Topbar'

const LupaPassword = (props) => {
    const token = new URLSearchParams(props.location.search).get('token')
    const history = useHistory()
    const [user,setUser] = useState({})
    const [insertPassword,setInsertPassword] = useState(false)
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

    const onSubmit = (e) => {
        e.preventDefault()

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
            await axios.put(`https://api.simonev.revolusimental.go.id/api/v1/user/${user && user._id}`,formData,config)
        
        } 
        catch(err){
            console.log(err)
        }
    }

    changePassword({
            password
        })
        history.push('/login')
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
                    !insertPassword ?
                        <div className="container-ubah" style={{height:'457px'}}>
                            <div className="header-ubah">
                                <h1>LUPA PASSWORD?</h1>
                            </div>
                            <div className="body-ubah">
                                <h1>Masukkan alamat email Anda yang terkait dengan akun Anda</h1>
                                <form onSubmit={onSubmitEmail} autoComplete='off'>
                                    <div>
                                        <input className="input-ubah"  type="email" name="email" value={email} onChange={onChangeEmail} placeholder="Alamat E-Mail"/>
                                    </div>

                                    <button className="button-ubah" type="submit" style={{width:'415px', marginLeft:'78px'}}>KIRIM LINK RESET PASSWORD</button>
                                </form>
                            </div>
                        </div>

                        : 
                        <div className="container-ubah">
                            <div className="header-ubah">
                                <h1>UBAH PASSWORD</h1>
                            </div>
                            <div className="body-ubah">
                                <h1>Halo {user && user.nama},</h1>
                                <h1>Silahkan mengisi password baru anda</h1>

                                <form onSubmit={onSubmit} autoComplete="off">
                                    <div>
                                        <input className="input-ubah"  type={seen1 ? "text" : "password"}  required name='password' value={password} onChange={onChange} placeholder="Password baru"/>
                                        <button className="button-password" style={{border:'none',  padding:'0' , height:'30px', width:'30px' , borderRadius:'3px' , backgroundColor:'#F9F3D0'}} onClick={handlePassword}>
                                            {
                                                seen1 ?
                                                    <i class='fa fa-eye-slash' style={{fontSize:'20px' , textAlign:'center'}}></i>                                        
                                                :
                                                    <i class='fas fa-eye' style={{fontSize:'20px' , textAlign:'center'}}></i>
                                            }
                                        </button>
                                    </div>
                                    <div>
                                        <input className="input-ubah"  type={seen2 ? "text" : "password"}  required name='confirm' value={confirm} onChange={onChange} placeholder="Konfirmasi Password Baru"/>
                                        <button className="button-password" style={{border:'none',  padding:'0' , height:'30px', width:'30px' , borderRadius:'3px',backgroundColor:'#F9F3D0' }} onClick={confirmPassword}>
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
                                                <div className="pesan-ubah" style={{color:'red' , left: '156px'}}>{err}</div>
                                                <button className="button-ubah" type="submit" disabled style={{color:'grey'}}>UBAH PASSWORD</button>
                                            </Fragment>
                                        :
                                            <Fragment>
                                                <div className="pesan-ubah" style={{color:'green' , left: '188px'}}>{err}</div>
                                                <button className="button-ubah" type="submit">UBAH PASSWORD</button>
                                            </Fragment>
                                    }
                                </form>
                            </div>
                        </div>
                }
        </Fragment>
    )
}

export default LupaPassword;