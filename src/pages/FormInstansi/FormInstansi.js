import React,{Component,Fragment,useContext,useState,useEffect} from 'react';
import axios from 'axios';
import trash from '../../assets/trash.png';
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import {useHistory} from 'react-router-dom';
import { AuthContext } from '../../context/Auth/AuthContext'
import Popup from '../../component/Popup/Popup';
import Scroll, { Element } from 'react-scroll'
import objectToFormData from '../../objectToFormDataUtil'
import Spinner from '../../component/Spinner/Spinner'
import bg_1 from '../../assets/decoration/bg_1.png'
import bg_2 from '../../assets/decoration/bg_2.png'
import bg_3 from '../../assets/decoration/bg_3.png'
import bg_4 from '../../assets/decoration/bg_4.png'

const FormInstansi = (props) => {
        const Link = Scroll.Link;
        const { user, token } = useContext(AuthContext);
        const history = useHistory();
        const [allInstansi, setAllInstansi] = useState([])
        const [isEditing , setIsEditing] = useState(false)
        const jenis = ['Kementerian' , 'Pemerintah Daerah']
        const [loading,setLoading] = useState(false)
        
        const [instansiDetail, setInstansiDetail] = useState(null)
        
        const [newInstansi,setNewInstansi] = useState({
            nama: '',
            nama_pendek: '',
            jenis: '',
            kontak: '',
            alamat: '',
            fax: '',
            email: '',
            website: '',
            user_nama: '',
            user_role: 'admin',
            user_username: '',
            user_password: '',
            user_kontak: '',
            deleted_logo: []    
        })

        console.log(newInstansi)

        const [seen, setSeen] = useState(false)
      
        const [media, setMedia] = useState([])
        const [mediaUrl, setMediaUrl] = useState([])
        const [deletedMedia, setDeletedMedia] = useState([])

        const onChangeInstansi = (e) => {
            return setNewInstansi({
                ...newInstansi,
                [e.target.name] : e.target.value
            })
        }

        const onChangeFiles = (event) => {
            setMedia([...media , ...event.target.files])
            event.target.value = null
        }

        useEffect(() => {
            axios.get('https://api.simonev.revolusimental.go.id/api/v1/instansi')
            .then(res => {
                setAllInstansi(res.data.instansi)
                console.log('wow')
            })
            .catch(err => {
                console.log('wow', +err)
            })
        }, [])


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

        const addNewInstansi = async (data) => {
            setLoading(true)
            console.log(data)
            const formData = objectToFormData(data)

            for (let i = 0; i < media.length; i++) {
                formData.append(`logo`, media[i])
            }

            for (let pair of formData.entries()) {
                console.log(pair[0] + ', ' + pair[1])
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-Auth-Token': `aweuaweu ${token}`,
                },
            }

            try {
                const res = await axios.post('https://api.simonev.revolusimental.go.id/api/v1/instansi',formData,config,)
                alert(res.data.message)                
                setLoading(false)
                history.push(`/${user&&user.role === 'owner' ? 'super-admin' : 'admin'}/kelola-instansi`)
            }

            catch(err) {
                alert(err.message)
                setLoading(false)
            }
            
            
        }

        const editInstansi = async (data) => {
            setLoading(true)
            console.log(data)
            const formData = objectToFormData(data)

            if (media.length > 0) {
                for (let i = 0; i < media.length; i++) {
                    formData.append(`logo`, media[i])
                }
            }  else {formData.append('logo', new File([null], 'blob'))}

            for (let pair of formData.entries()) {
                console.log(pair[0] + ', ' + pair[1])
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-Auth-Token': `aweuaweu ${token}`,
                },
            }
            try {
                const res = await axios.put(`https://api.simonev.revolusimental.go.id/api/v1/instansi/${props.match.params.id}`,formData,config,)
                alert(res.data.message)
                setLoading(false)
                history.push(`/${user&&user.role === 'owner' ? 'super-admin' : 'admin'}/kelola-instansi`)
            }
            catch(err) {
                console.log(err)
                alert(err.message)
                setLoading(false)
            }
        }

        const getFileName = (url) => {
            const split = url.split('/')
            return split[split.length - 1]
        }

        const onSubmit = (e) => {
            e.preventDefault()
            addNewInstansi(newInstansi)
        }

        const onEdit = (e) => {
            e.preventDefault()
            console.log('a')
            // editInstansi(newInstansi)
        }

        const handlePassword = (e) => {
            e.preventDefault()
            setSeen(!seen)
        }

        const onDeleteMedia = (isFile, filename, data) => {
            setMediaUrl(mediaUrl.filter(media => getFileName(media) !== filename))
            if (isFile) setMedia(media.filter(media => media !== data))
            else setMedia(media.filter(media => media.name !== filename))
            const deleted = [...deletedMedia, filename]
            setDeletedMedia(deleted)
        }

        
        useEffect(() => {
            if(props.match.params.id){
                getInstansiDetail()
                setIsEditing(true)
            }
        },[props.match.params.id])

        useEffect(() => {
            if (instansiDetail) {
                setNewInstansi({
                    jenis: instansiDetail.jenis,
                    nama: instansiDetail.nama,
                    nama_pendek: instansiDetail.nama_pendek,
                    kontak: instansiDetail.kontak,
                    alamat: instansiDetail.alamat,
                    fax: instansiDetail.fax,
                    email: instansiDetail.email
                })

            if(instansiDetail.logo) {
                const mediaFileUrl = [`https://api.simonev.revolusimental.go.id${instansiDetail.logo}`]
                const files = []
                mediaFileUrl.forEach(url => {
                    fetch(url).then(res => res.blob()).then(blob => {
                        const objectURL = URL.createObjectURL(blob)
                        blob.name = getFileName(url)
                        files.push(blob)
                    })
                })
                
                setMedia(files)
                setMediaUrl(mediaFileUrl)
                }
            }
        },[instansiDetail])

        useEffect(() => {
            setNewInstansi({ ...newInstansi, deleted_logo: deletedMedia})
        }, [deletedMedia])

        return(
            <Fragment>
                <SideBarOff/>
                <Popup notif={props.notif}/>
                <div className="background-after-login">
                    <img src={bg_1} alt='bg1' style={{ position: 'fixed', top: '0', left: '0' }} />
                    <img src={bg_2} alt='bg2' style={{ position: 'fixed', top: '0', right: '0' }} />
                    <img src={bg_3} alt='bg3' style={{ position: 'fixed', bottom: '-200px', left: '0' }} />
                    <img src={bg_4} alt='bg4' style={{ position: 'fixed', bottom: '-50px', right: '0' }} />
                </div>
                <div className="tajuk-page">
                    <h1> FORMULIR INSTANSI</h1>
                </div> 
                {
                    loading ?
                    <div style={{ marginLeft: '68px' }}>
                        <div className="d-flex justify-content-center align-items-center" style={{ width: '100%', height: '60vh', overflow: 'hidden' }}>
                            <Spinner />
                        </div> 
                    </div>
                    :
                    <form id='form-admin' className="form-admin-1" onSubmit={isEditing ? onEdit : onSubmit} style={{width:'fit-content' , height: 'fit-content', margin: 'auto'}}>
                        <Element id="instansi" name="instansi">
                            <div className="admin-1-container">
                                <div>
                                    <label>Nama Instansi</label>
                                    <input 
                                        className="admin-nama" 
                                        type="text" 
                                        name="nama" 
                                        value={newInstansi.nama} 
                                        onChange={onChangeInstansi} 
                                        required={true}
                                        style={{width:'955px', marginLeft:'97px'}}
                                    />
                                </div>
                                <div>
                                    <label>Nama Pendek</label>
                                    <input 
                                        className="admin-nama" 
                                        type="text" 
                                        name="nama_pendek" 
                                        value={newInstansi.nama_pendek} 
                                        onChange={onChangeInstansi}  
                                        required={true}
                                        style={{width:'366px', marginLeft:'101px'}}
                                    />
                                </div>
                                <div>
                                    <label>Jenis</label>
                                    {
                                        instansiDetail && instansiDetail.jenis ?
                                            <select className="admin-instansi" style={{marginLeft:'174px' , border: '1px solid #ACACAC'}}name="jenis" onChange={onChangeInstansi}  required={true}>
                                                <option value="" defaultValue="" hidden></option>
                                                {
                                                jenis.map((jenis, i) => <option key={i} selected={instansiDetail.jenis === jenis && true} title={jenis} value={jenis}>{jenis}</option>)
                                                }
                                            </select>
                                            :
                                            <select className="admin-instansi" style={{marginLeft:'174px' , border: '1px solid #ACACAC'}}name="jenis" onChange={onChangeInstansi}  required={true}>
                                                <option selected={true} hidden></option>
                                                {
                                                jenis.map((jenis, i) => <option key={i} title={jenis} value={jenis}>{jenis}</option>)
                                                }
                                            </select>
                                    }
                                </div>
                                <div>
                                    <label>Kontak Instansi</label>
                                    <input 
                                        className="admin-username" 
                                        type="text" 
                                        name="kontak" 
                                        value={newInstansi.kontak} 
                                        onChange={onChangeInstansi} 
                                        required={true} 
                                        style={{marginLeft:'87px', width:'366px'}}
                                    />
                                </div>
                                <div>
                                    <label>Logo Instansi</label>
                                    <label htmlFor='testing' required={true} className='label_lampiran' style={{marginLeft:'108px'}}><span style={{marginRight:'15px'}}>+</span> PILIH BERKAS</label>
                                    <input 
                                        id="testing"
                                        className="gnrm-penjelasan" 
                                        style={{height: "178px", 
                                                marginLeft: "108px", 
                                                width: "178px"}} 
                                        onChange={onChangeFiles}
                                        type="file"
                                        accept="image/*"
                                        name="logo"
                                    />
                                    <div>
                                    {
                                        media && media.length > 0 ? (
                                            <div style={{height: "178px", 
                                                marginTop:'5px',
                                                marginLeft: "214px", 
                                                width: "178px",
                                                border: '1px solid black',
                                                padding: '10px',
                                                overflow: 'hidden'
                                            }} 
                                            > 
                                                {
                                                    media.map((media,index) => {
                                                        const objectURL = URL.createObjectURL(media)
                                                        return(
                                                            <div key={index}>
                                                                    <div style={{width:'120px', 
                                                                                height:'120px',  
                                                                                margin:'auto', 
                                                                                position:'relative'
                                                                                }}
                                                                        className="d-flex align-items-center justify-content-center"
                                                                    >
                                                                        <div style={{width:'120px', height:'120px', overflow:'hidden', position:'absolute'}}>
                                                                            <img src={objectURL} alt={media.name} className="gnrm-media--image"/>
                                                                        </div>
                                                                        <div style={{position:'absolute', 
                                                                                    backgroundColor:'#C04B3E' , 
                                                                                    width:'25px' , 
                                                                                    height:'25px', 
                                                                                    borderRadius:'50%', 
                                                                                    top:'-7px', 
                                                                                    right:'-7px', 
                                                                                    lineHeight:'25px', 
                                                                                    textAlign:'center',
                                                                                    cursor:'pointer',
                                                                                    color:'white'}}
                                                                        onClick={(e) => onDeleteMedia(true, media.name, media)}> X </div>
                                                                    </div>
                                                                    <div style={{marginTop:'10px' , 
                                                                                width:'150px' , 
                                                                                height:'20px', 
                                                                                wordWrap: 'break-word',
                                                                                lineHeight:'20px',}}
                                                                    >
                                                                        <p className="gnrm-media--name">
                                                                            {media.name.length > 18 ? `${media.name.substr(0, 15)}...` : media.name}
                                                                        </p>
                                                                    </div>
                                                                
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        ) : (
                                            <div style={{height: "178px", 
                                                marginTop:'5px',
                                                marginLeft: "214px", 
                                                width: "178px",
                                                border: '1px solid black',
                                                padding: '10px',
                                                overflow: 'hidden'
                                                }} 
                                            > 
                                                {
                                                    mediaUrl.map((url,index) => {
                                                        return(
                                                            <div key={index}>
                                                                    <div style={{width:'120px', 
                                                                                height:'120px', 
                                                                                margin:'auto', 
                                                                                position:'relative'}}
                                                                        className="d-flex align-items-center justify-content-center"
                                                                    >
                                                                        <div style={{width:'120px', height:'120px', overflow:'hidden', position:'absolute'}}>
                                                                            <img src={url} alt={getFileName(url)} className="gnrm-media--image"/>
                                                                        </div>
                                                                        <div style={{position:'absolute', 
                                                                                    backgroundColor:'#C04B3E' , 
                                                                                    width:'25px' , 
                                                                                    height:'25px', 
                                                                                    borderRadius:'50%', 
                                                                                    top:'-7px', 
                                                                                    right:'-7px', 
                                                                                    lineHeight:'25px', 
                                                                                    textAlign:'center',
                                                                                    cursor:'pointer',
                                                                                    color:'white'}}
                                                                        onClick={(e) => onDeleteMedia(false, getFileName(url))}> X </div>
                                                                    </div>
                                                                    <div style={{marginTop:'10px' , 
                                                                                width:'150px' , 
                                                                                height:'20px', 
                                                                                wordWrap: 'break-word',
                                                                                lineHeight:'20px'}}
                                                                    >
                                                                        <p className="gnrm-media--name">
                                                                            {getFileName(url)}
                                                                        </p>
                                                                    </div>
                                                                
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    }
                                    </div>
                                </div>
                                <div>
                                    <label  style={{textAlign:'right', clear:'both' , float:'left'}}>Alamat</label>
                                    <textarea 
                                        className="admin-username" 
                                        type="text" 
                                        name="alamat" 
                                        value={newInstansi.alamat} 
                                        onChange={onChangeInstansi} 
                                        style={{marginLeft:'156px', width:'955px' , height: '84px'}}
                                    />
                                </div>
                                <div>
                                    <label>Fax</label>
                                    <input 
                                        className="admin-username" 
                                        type="text" 
                                        name="fax" 
                                        value={newInstansi.fax} 
                                        onChange={onChangeInstansi} 
                                        style={{marginLeft:'186px', width:'366px'}}
                                    />
                                </div>
                                <div>
                                    <label>Website</label>
                                    <input 
                                        className="admin-username" 
                                        type="text" 
                                        name="website" 
                                        value={newInstansi.website} 
                                        onChange={onChangeInstansi} 
                                        style={{marginLeft:'150px', width:'366px'}}
                                    />
                                </div>
                                <div>
                                    <label>Email Instansi</label>
                                    <input 
                                        className="admin-username" 
                                        type="email" 
                                        name="email" 
                                        value={newInstansi.email} 
                                        onChange={onChangeInstansi} 
                                        style={{marginLeft:'102px', width:'366px'}}
                                    />
                                </div>

                                {
                                    isEditing ?
                                        <div className="admin-navigation-button">
                                                <input className="button-daftar" form='form-admin' type='submit' value='EDIT'></input>
                                        </div>
                                    :
                                    <div className="gnrm-navigation-button">
                                        <Link 
                                            to="admin_form"
                                            spy={true}
                                            smooth={true}
                                            duration={500}
                                            offset={-30}
                                        >
                                            <button className="forward" style={{right:'-1109px'}}><i className="material-icons">expand_more</i></button>
                                        </Link>
                                    </div>
                                }
                            </div>
                        </Element>

                        {
                            !props.match.params.id ?
                        <Element id="admin_form" name="admin_form">
                            <div className="admin-1-container" style={{marginBottom:'227px'}}>
                            <div className="gnrm-title">
                                FORMULIR ADMIN
                            </div>
                                    <div>
                                        <label>Nama</label>
                                        <input 
                                            className="admin-nama" 
                                            type="text" 
                                            name="user_nama" 
                                            value={newInstansi.user_nama} 
                                            onChange={onChangeInstansi} 
                                            required={true}
                                        />
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
                                            name="user_username" 
                                            value={newInstansi.user_username} 
                                            onChange={onChangeInstansi}
                                            required={true} 
                                        />
                                    </div>
                                    <div>
                                        <label>Kata Sandi</label>
                                        <input 
                                            className="admin-password" 
                                            type={seen ? "text" : "password"} 
                                            name="user_password" 
                                            value={newInstansi.user_password} 
                                            onChange={onChangeInstansi}
                                            required={true} 
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
                                    <div>
                                        <label>Kontak Admin</label>
                                        <input 
                                            className="admin-username" 
                                            type="text" 
                                            name="user_kontak" 
                                            value={newInstansi.user_kontak} 
                                            onChange={onChangeInstansi}
                                            required={true}
                                            style={{marginLeft:'95px'}} 
                                        />
                                    </div>

                                <div className="admin-navigation-button">
                                        <input className="button-daftar" form='form-admin' type='submit' value='DAFTAR'></input>
                                </div>
                            </div>
                        </Element>
                        : 
                            ''
                        }
                    </form>
                }
          </Fragment>  
        );
}

export default FormInstansi;