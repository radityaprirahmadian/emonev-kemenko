import React,{Component,Fragment, useContext, useEffect, useState} from 'react';
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import lock from '../../assets/lock.png';
import {Link} from 'react-router-dom';
import { AuthContext } from '../../context/Auth/AuthContext'
import {LayoutContext} from '../../context/Layout/LayoutContext'
import axios from 'axios'
import Popup from '../../component/Popup/Popup';
import bg_1 from '../../assets/decoration/bg_1.png'
import bg_2 from '../../assets/decoration/bg_2.png'
import bg_3 from '../../assets/decoration/bg_3.png'
import bg_4 from '../../assets/decoration/bg_4.png'
import Notification from '../../component/Notification/Notification';
import Spinner from '../../component/Spinner/Spinner'

const ProfileInstansi = (props) => {
    const { token, userDetail,user} = useContext(AuthContext);
    const { sidebar } = useContext(LayoutContext)
    const [ foto, setFoto ] = useState();
    const [ loading, setLoading] = useState(false)
    const [ instansiDetail , setInstansiDetail] = useState({})

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
            setLoading(false)
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(()=> {
        if(props.match.params.id) {
            getInstansiDetail()
            window.scrollTo(0, 0);
        }
    },[props.match.params.id])

    // useEffect(() => {
    //     if (instansiDetail) {
    //         setNewInstansi({
    //             jenis: instansiDetail.jenis,
    //             nama: instansiDetail.nama,
    //             nama_pendek: instansiDetail.nama_pendek,
    //             kontak: instansiDetail.kontak,
    //             alamat: instansiDetail.alamat,
    //             fax: instansiDetail.fax,
    //             email: instansiDetail.email
    //         })
    //     }
    // },[instansiDetail])

    useEffect(() => {
        const wow = `https://api.simonev.revolusimental.go.id${instansiDetail&&instansiDetail.logo}`
        setFoto(wow)
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
                <div className="profile-page" style={{marginRight:'20px' , marginTop:'23px', marginBottom:'80px'}}>
                    <div className="tajuk-page-2">
                        <div>PROFIL INSTANSI</div>
                        {
                            user && user.role === 'owner' ?
                                ''
                            :
                                <Notification/>
                        }
                    </div>
                    <div style={sidebar ? {marginRight: '20px' , transition: 'all 0.3s ease-in-out'} : {transition: 'all 0.3s ease-in-out'}}>
                    <div className="container-fluid">
                        {
                            loading ?  
                            <div style={{ marginLeft: '68px' }}>
                                <div className="d-flex justify-content-center align-items-center" style={{ width: '100%', height: '60vh', overflow: 'hidden' }}>
                                    <Spinner />
                                </div> 
                            </div>
                            :
                            <div className="row">
                                <form id="form-profile">
                                <div className="col"> 
                                
                                <div className="form-profile-page" style={sidebar? {marginLeft:'188px', transition: 'all 0.3s ease-in-out'} : {marginLeft:'0'}}>
                                    {
                                        !sidebar ?
                                            <Fragment>
                                                <div className="data" >
                                                    <label>Nama Instansi</label><br/>
                                                    <div className="show-profile" type="text" style={{height:'84px' , marginBottom:'16px' , lineHeight:'20px' , paddingTop:'10px' , paddingBottom:'10px'}}>{instansiDetail && instansiDetail.nama}</div>
                                                </div>

                                                <div className="data">
                                                    <label style={{marginTop:'32px'}}>Nama Pendek</label><br/>
                                                    <div className="show-profile" type="text" style={{fontWeight:'700'}}>{instansiDetail && instansiDetail.nama_pendek}</div>
                                                </div>

                                                <div className="data">
                                                    <label style={{marginTop:'32px'}}>Kementerian/Lembaga/Pemerintah Daerah</label><br/>
                                                    <div className="show-profile" type="text">{instansiDetail && instansiDetail.jenis}</div>
                                                </div>

                                                <div className="data">
                                                    <label style={{marginTop:'32px'}}>Kontak</label><br/>
                                                    <div className="show-profile" type="text">{instansiDetail && instansiDetail.kontak}</div>
                                                </div>

                                                <div className="data">
                                                    <label style={{marginTop:'32px'}}>Alamat</label><br/>
                                                    <div className="show-profile" type="text" style={{height:'84px' , lineHeight:'20px' , paddingTop:'10px' , paddingBottom:'10px'}}>{instansiDetail && instansiDetail.alamat}</div>
                                                </div>

                                                <div className="data">
                                                    <label style={{marginTop:'64px'}}>Fax</label><br/>
                                                    <div className="show-profile" type="text">{instansiDetail && instansiDetail.fax}</div>
                                                </div>

                                                <div className="data">
                                                    <label style={{marginTop:'64px'}}>Website</label><br/>
                                                    <div className="show-profile" type="email">{instansiDetail && instansiDetail.website}</div>
                                                </div>
                                                <div className="data">
                                                    <label style={{marginTop:'64px'}}>Email</label><br/>
                                                    <div className="show-profile" type="text">{instansiDetail && instansiDetail.email}</div>
                                                </div>
                                            </Fragment>
                                        :
                                            <Fragment>
                                                <div className="data" >
                                                    <label>Nama Instansi</label><br/>
                                                    <div className="show-profile" type="text" style={{height:'84px'  , width:'466px', marginBottom:'16px' , lineHeight:'20px' , paddingTop:'10px', paddingBottom:'10px'}}>{instansiDetail && instansiDetail.nama}</div>
                                                </div>

                                                <div className="data">
                                                    <label style={{marginTop:'32px'}}>Nama Pendek</label><br/>
                                                    <div className="show-profile" type="text" style={{fontWeight:'700' , width:'466px'}}>{instansiDetail && instansiDetail.nama_pendek}</div>
                                                </div>

                                                <div className="data">
                                                    <label style={{marginTop:'32px'}}>Kementerian/Lembaga/Pemerintah Daerah</label><br/>
                                                    <div className="show-profile" style={{width:'466px'}}type="text">{instansiDetail && instansiDetail.jenis}</div>
                                                </div>

                                                <div className="data">
                                                    <label style={{marginTop:'32px'}}>Kontak</label><br/>
                                                    <div className="show-profile" style={{width:'466px'}}type="text">{instansiDetail && instansiDetail.kontak}</div>
                                                </div>

                                                <div className="data">
                                                    <label style={{marginTop:'32px'}}>Alamat</label><br/>
                                                    <div className="show-profile" type="text" style={{height:'84px', width:'466px', lineHeight:'20px' , paddingTop:'10px' , paddingBottom:'10px'}}>{instansiDetail && instansiDetail.alamat}</div>
                                                </div>

                                                <div className="data">
                                                    <label style={{marginTop:'64px'}}>Fax</label><br/>
                                                    <div className="show-profile" style={{width:'466px'}} type="text">{instansiDetail && instansiDetail.fax}</div>
                                                </div>

                                                <div className="data">
                                                    <label style={{marginTop:'64px'}}>Website</label><br/>
                                                    <div className="show-profile" style={{width:'466px'}} type="email">{instansiDetail && instansiDetail.website}</div>
                                                </div>
                                                <div className="data">
                                                    <label style={{marginTop:'64px'}}>Email</label><br/>
                                                    <div className="show-profile" style={{width:'466px'}} type="text">{instansiDetail && instansiDetail.email}</div>
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
                                                <img src={foto}></img>
                                            </div>
                                        </div>
                                        <Link to={`/${userDetail&&userDetail.role === 'owner' ? 'super-admin' : 'admin'}/edit-profile-instansi/${instansiDetail && instansiDetail._id}`}>
                                        <input 
                                            form="form-profile"
                                            type="submit"
                                            className="button-submit-profile"
                                            value="UBAH PROFIL"
                                            style={{backgroundColor: '#E76975'}}
                                        > 
                                        </input>
                                        </Link>
                                    </div>

                                </div>

                            </div>
                        }
                    </div>
                    </div>
                </div>
            </Fragment>
        );
    }

export default ProfileInstansi;