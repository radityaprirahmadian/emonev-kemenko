import React , { Fragment, useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/Auth/AuthContext.js'
import './NewPassword.css'
import axios from 'axios';
import { useHistory } from 'react-router-dom'


const NewPassword = () => {
    const { token, userDetail } = useContext(AuthContext)
    console.log(userDetail)
    const history = useHistory()
    const [seen1, setSeen1] = useState(false)
    const [seen2, setSeen2] = useState(false)
    const [pass , setPassword] = useState({
        password:'',
        confirm: '',
        err: '',
        disable: true,
        login_awal: true
    })

    const {
        password,
        confirm,
        err,
        disable,
        login_awal
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
                    login_awal: false,
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
            console.log(userDetail && userDetail._id)
            console.log(login_awal)
            const config={
                headers: {
                    'X-Auth-Token' : `aweuaweu ${token}`,
                    'Content-Type': 'application/json'
                }
            }
    
            try {
                await axios.put(`https://api.simonev.revolusimental.go.id/api/v1/user/${userDetail && userDetail._id}`,formData,config)
            
            } 
            catch(err){
                console.log(err)
            }
        }

        changePassword({
            password,
            login_awal
        })
        history.push('/dashboard')
    }


    const handlePassword = (e) => {
        e.preventDefault()
        setSeen1(!seen1)
    }

    const confirmPassword = (e) => {
        e.preventDefault()
        setSeen2(!seen2)
    }

    return(
        <Fragment>
            <div className="container-ubah">
                <div className="header-ubah">
                    <h1>UBAH PASSWORD</h1>
                </div>
                <div className="body-ubah">
                    <h1>Halo {userDetail && userDetail.nama},</h1>
                    <h1>Untuk menjaga akun Anda harap mengganti password Anda terlebih dahulu.</h1>

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
                                    <button className="button-ubah" type="submit" disabled style={{backgroundColor:'grey'}}>UBAH PASSWORD</button>
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
        </Fragment>
    )
}

export default NewPassword;