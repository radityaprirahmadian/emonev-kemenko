import React,{Component,Fragment, useContext, useEffect, useState} from 'react';
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import lock from '../../assets/lock.png';
import {Link,useHistory} from 'react-router-dom';
import { AuthContext } from '../../context/Auth/AuthContext'
import {LayoutContext} from '../../context/Layout/LayoutContext'
import axios from 'axios'
import Popup from '../../component/Popup/Popup';
import bg_1 from '../../assets/decoration/bg_1.png'
import bg_2 from '../../assets/decoration/bg_2.png'
import bg_3 from '../../assets/decoration/bg_3.png'
import bg_4 from '../../assets/decoration/bg_4.png'
import objectToFormData from '../../objectToFormDataUtil'
import Spinner from '../../component/Spinner/Spinner'
import Notification from '../../component/Notification/Notification';

const ProfileInstansiEdit = (props) => {
    const { token, userDetail,user} = useContext(AuthContext);
    const { sidebar } = useContext(LayoutContext)
    const history = useHistory()
    const [ foto, setFoto ] = useState([])
    const [loading , setLoading ] = useState(false)
    const [ instansiDetail , setInstansiDetail] = useState({})
    const jenis = ['Kementerian' , 'Pemerintah Daerah']

    const [newInstansi,setNewInstansi] = useState({
        nama: '',
        nama_pendek: '',
        jenis: '',
        kontak: '',
        alamat: '',
        fax: '',
        email: '',
        website: '',  
    })

    const [mediaUrl, setMediaUrl] = useState([])
    const [ fotos, setFotos] = useState();
    const onChangeFiles = (event) => {
        setFoto([...event.target.files])
        if(event.target.files && event.target.files[0]){
            setFotos(URL.createObjectURL(event.target.files[0]))
        }
    }

    const getInstansiDetail = async () => {
        setLoading(true)
        const config = {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`,
            }
        }
        try {
            const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/instansi/${props.match.params.id}`,config)
            setInstansiDetail(res.data.instansi)
        }
        catch (err) {
            console.log(err)
        }
        setLoading(false)
    }

    const editInstansi = async (data) => {
        setLoading(true)
        const formData = objectToFormData(data)

        for (let i = 0; i < foto.length; i++) {
            formData.append(`logo`, foto[i])
        }

        // for (let pair of formData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1])
        // }

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-Auth-Token': `aweuaweu ${token}`,
            },
        }

        try {
            const res = await axios.put(`https://api.simonev.revolusimental.go.id/api/v1/instansi/${props.match.params.id}`,formData,config,)
            alert(res.data.message)                
            history.push(`/${userDetail&&userDetail.role === 'owner' ? 'super-admin' : 'admin'}/profile-instansi/${props.match.params.id}`)
            window.location.reload()
        }

        catch(err) {
            alert(err.data.message)
        }
        setLoading(false)   
    }

    const onChangeInstansi = (e) => {
        return setNewInstansi({
            ...newInstansi,
            [e.target.name] : e.target.value
        })
    }

    useEffect(()=> {
        if(props.match.params.id) {
            getInstansiDetail()
        }
    },[props.match.params.id])

    const onSubmit = (e) => {
        e.preventDefault()
        editInstansi(newInstansi)
    }

    useEffect(() => {
        if (instansiDetail) {
            setNewInstansi({
                jenis: instansiDetail.jenis,
                nama: instansiDetail.nama,
                nama_pendek: instansiDetail.nama_pendek,
                kontak: instansiDetail.kontak,
                alamat: instansiDetail.alamat,
                fax: instansiDetail.fax,
                email: instansiDetail.email,
                website: instansiDetail.website
            })
            
            const wow = `https://api.simonev.revolusimental.go.id${instansiDetail&&instansiDetail.logo}`
            setFotos(wow)
        }
    },[instansiDetail])

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
                <div className="profile-page" style={{marginBottom:'80px' , marginRight:'20px' , marginTop:'23px'}}>
                    <div className="tajuk-page-2">
                        <div>PROFIL INSTANSI</div>
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
                            <div style={sidebar ? {marginRight: '20px' , transition: 'all 0.3s ease-in-out'} : {transition: 'all 0.3s ease-in-out'}}>
                            <div className="container-fluid">
                                <div className="row">
                                    <form id="form-profile">
                                        <div className="col"> 
                                        <div className="form-profile-page" style={sidebar? {marginLeft:'188px' ,transition: 'all 0.3s ease-in-out'} : {marginLeft:'0'}}>
                                            {
                                                !sidebar ?
                                                    <Fragment>
                                                        <div className="data" >
                                                            <label>Nama Instansi</label><br/>
                                                            <textarea className="show-profile" type="text" style={{height:'84px' , marginBottom:'16px', lineHeight: '20px', paddingTop: '10px'}} name="nama" value={newInstansi.nama} onChange={onChangeInstansi}></textarea>
                                                        </div>

                                                        <div className="data">
                                                            <label style={{marginTop:'32px'}}>Nama Pendek</label><br/>
                                                            <input className="show-profile" type="text" style={{fontWeight:'700'}} name="nama_pendek" value={newInstansi.nama_pendek} onChange={onChangeInstansi}></input>
                                                        </div>

                                                        <div className="data">
                                                            <label style={{marginTop:'32px'}}>Jenis</label><br/>
                                                            <select className="show-profile" type="text" name="jenis" onChange={onChangeInstansi}>
                                                                {  
                                                                    jenis.map((jenis, i) => <option key={i} selected={instansiDetail.jenis === jenis && true} title={jenis} value={jenis}>{jenis}</option>)
                                                                }
                                                            </select>
                                                        </div>

                                                        <div className="data">
                                                            <label style={{marginTop:'32px'}}>Kontak</label><br/>
                                                            <input className="show-profile" type="text" name="kontak" value={newInstansi.kontak} onChange={onChangeInstansi}></input>
                                                        </div>

                                                        <div className="data">
                                                            <label style={{marginTop:'32px'}}>Alamat</label><br/>
                                                            <textarea className="show-profile" type="text" style={{height:'84px',lineHeight: '20px', paddingTop: '10px'}} name="alamat" value={newInstansi.alamat} onChange={onChangeInstansi}></textarea>
                                                        </div>

                                                        <div className="data">
                                                            <label style={{marginTop:'64px'}}>Fax</label><br/>
                                                            <input className="show-profile" type="text" name="fax" value={newInstansi.fax} onChange={onChangeInstansi}></input>
                                                        </div>

                                                        <div className="data">
                                                            <label style={{marginTop:'64px'}}>Website</label><br/>
                                                            <input className="show-profile" type="text" name="website" value={newInstansi.website} onChange={onChangeInstansi}></input>
                                                        </div>
                                                        <div className="data">
                                                            <label style={{marginTop:'64px'}}>Email</label><br/>
                                                            <input className="show-profile" type="email" name="email" value={newInstansi.email} onChange={onChangeInstansi}></input>
                                                        </div>
                                                    </Fragment>
                                                :
                                                    <Fragment>
                                                        <div className="data" >
                                                            <label>Nama Instansi</label><br/>
                                                            <textarea className="show-profile" type="text" style={{height:'84px' ,  width:'466px', marginBottom:'16px', lineHeight: '20px', paddingTop: '10px' , paddingBottom:'10px'}} name="nama" value={newInstansi.nama} onChange={onChangeInstansi}></textarea>
                                                        </div>

                                                        <div className="data">
                                                            <label style={{marginTop:'32px'}}>Nama Pendek</label><br/>
                                                            <input className="show-profile" type="text" style={{fontWeight:'700' ,  width:'466px'}} name="nama_pendek" value={newInstansi.nama_pendek} onChange={onChangeInstansi}></input>
                                                        </div>

                                                        <div className="data">
                                                            <label style={{marginTop:'32px'}}>Jenis</label><br/>
                                                            <select className="show-profile" style={{ width:'466px'}}type="text" name="jenis" onChange={onChangeInstansi}>
                                                                {  
                                                                    jenis.map((jenis, i) => <option key={i} selected={instansiDetail.jenis === jenis && true} title={jenis} value={jenis}>{jenis}</option>)
                                                                }
                                                            </select>
                                                        </div>

                                                        <div className="data">
                                                            <label style={{marginTop:'32px'}}>Kontak</label><br/>
                                                            <input className="show-profile" style={{ width:'466px'}}type="text" name="kontak" value={newInstansi.kontak} onChange={onChangeInstansi}></input>
                                                        </div>

                                                        <div className="data">
                                                            <label style={{marginTop:'32px'}}>Alamat</label><br/>
                                                            <textarea className="show-profile" type="text" style={{minHeight:'84px', maxHeight:'fit-content', width:'466px', lineHeight:  '20px', paddingTop: '10px' , paddingBottom: '10px'}} name="alamat" value={newInstansi.alamat} onChange={onChangeInstansi}></textarea>
                                                        </div>

                                                        <div className="data">
                                                            <label style={{marginTop:'64px'}}>Fax</label><br/>
                                                            <input className="show-profile" style={{width:'466px'}} type="text" name="fax" value={newInstansi.fax} onChange={onChangeInstansi}></input>
                                                        </div>

                                                        <div className="data">
                                                            <label style={{marginTop:'64px'}}>Website</label><br/>
                                                            <input className="show-profile" style={{width:'466px'}} type="text" name="website" value={newInstansi.website} onChange={onChangeInstansi}></input>
                                                        </div>
                                                        <div className="data">
                                                            <label style={{marginTop:'64px'}}>Email</label><br/>
                                                            <input className="show-profile" style={{width:'466px'}} type="email" name="email" value={newInstansi.email} onChange={onChangeInstansi}></input>
                                                        </div>
                                                    </Fragment>
                                                    }
                                            </div>
                                        </div>
                                    </form>

                                    <div className="col">
                                        <div className="photo-profile-page">
                                            <label>Foto Profil Instansi</label><br/>
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
                                            <Link to={`/${userDetail&&userDetail.role === 'owner' ? 'super-admin' : 'admin'}/profile-instansi/${instansiDetail && instansiDetail._id}`}>
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
                                                    onClick={onSubmit}
                                                > 
                                            </input>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                    }
                </div>
            </Fragment>
        );
    }

export default ProfileInstansiEdit;