import React,{Component,Fragment,useContext,useState,useEffect} from 'react';
import axios from 'axios';
import trash from '../../assets/trash.png';
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import {useHistory} from 'react-router-dom';
import { AuthContext } from '../../context/Auth/AuthContext'
import Popup from '../../component/Popup/Popup';
import Scroll, { Element } from 'react-scroll'
import objectToFormData from '../../objectToFormDataUtil'


const FormInstansi = (props) => {
        const Link = Scroll.Link;
        const { user, token } = useContext(AuthContext);
        const history = useHistory();
        const [allInstansi, setAllInstansi] = useState([])
        
        const [instansiDetail, setInstansiDetail] = useState(null)
        
        const [newInstansi,setNewInstansi] = useState({
            nama: '',
            nama_pendek: '',
            jenis: '',
            kontak: ''
        })

        console.log(instansiDetail)

        const [admin, setAdmin] = useState({
            nama: '',
            instansi: '',
            role: '',
            username: '',
            password: ''
        })

        const [seen, setSeen] = useState(false)
        const [logo,setLogo] = useState([])

        const [mediaUrl,setMediaUrl] = useState([])
        console.log(logo)

        const { nama, instansi, role, username, password } = admin
        console.log(admin)

        const onChange = (e) => {
            return setAdmin({
                ...admin,
                instansi: newInstansi.nama_pendek,
                [e.target.name] : e.target.value
            })
        }

        const onChangeInstansi = (e) => {
            return setNewInstansi({
                ...newInstansi,
                [e.target.name] : e.target.value
            })
        }

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

        const onChangeFiles = (event) => {
            setLogo([...event.target.files])
        }

        const getInstansiDetail = async () => {
            const config = {
                headers: {
                    'X-Auth-Token': `aweuaweu ${token}`,
                }
            }
            try {
                const res = await axios.get(`https://test.bariqmbani.me/api/v1/instansi/${props.match.params.id}`,config)
                setInstansiDetail(res.data.instansi)
            }
            catch (err) {
                console.log(err)
            }
        }

        const addNewAdmin = async (formData) => {
            const config = {
                headers: {
                    'X-Auth-Token': `aweuaweu ${token}`,
                    'Content-Type': 'application/json'
                }
            }
            try {
                await axios.post(`https://test.bariqmbani.me/api/v1/user`,formData,config)
            }
            catch (err) {
                console.log(err)
            }
        }

        const addNewInstansi = async (data) => {
            console.log(data)
            const formData = objectToFormData(data)

            for (let i = 0; i < logo.length; i++) {
                formData.append(`logo`, logo[i])
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

            const res = await axios.post('https://test.bariqmbani.me/api/v1/instansi',formData,config,)

            addNewAdmin({
                nama,
                instansi,
                role,
                username,
                password
            })
            
            history.push('/instansi')
        }

        const editInstansi = async (data) => {
            console.log(data)
            const formData = objectToFormData(data)

            for (let i = 0; i < logo.length; i++) {
                formData.append(`logo`, logo[i])
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

            const res = await axios.put(`https://test.bariqmbani.me/api/v1/instansi/${props.match.params.id}`,formData,config,)
            history.push('/instansi')
        }
        const onSubmit = (e) => {
            e.preventDefault()
            addNewInstansi(newInstansi)
        }

        const onEdit = (e) => {
            e.preventDefault()
            editInstansi(newInstansi)
        }

        const handlePassword = (e) => {
            e.preventDefault()
            setSeen(!seen)
        }

        
        const urlToFile = async (url) => {
            const getFileName = (url) => {
                const split = url.split('/')
                return split[split.length -1]
            }
            
            const name = getFileName(url)
            
            try {
                const res = await fetch(url)
                const blob = res.blob()
                return new File([blob],name)
            }
            catch(err) {
                console.log(err)
            }
        }
        
        useEffect(() => {
            if(props.match.params.id){
                getInstansiDetail()
            }
        },[props.match.params.id])

        useEffect(() => {
            if (instansiDetail) {
                setNewInstansi({
                    jenis: instansiDetail.jenis,
                    nama: instansiDetail.nama,
                    nama_pendek: instansiDetail.nama_pendek,
                    kontak: instansiDetail.kontak
                })

                const mediaFileUrl = `https://test.bariqmbani.me${instansiDetail.logo}`
                
                const files = []
                const masuk = async () => {
                    const file = await urlToFile(mediaFileUrl)
                    console.log(file)
                    files.push(file)
                }

                masuk()
                setLogo(files)         
                setMediaUrl(mediaFileUrl)
            }
        },[instansiDetail])

        console.log(logo)

        return(
            <Fragment>
                <SideBarOff/>
                <Popup notif={props.notif}/>
                <div className="tajuk-page">
                    <h1> FORM INSTANSI</h1>
                </div>
                {
                    !props.match.params.id ? 
                    <form id='form-admin' className="form-admin-1" onSubmit={onSubmit}>

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
                                        required
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
                                        required
                                        style={{width:'366px', marginLeft:'101px'}}
                                    />
                                </div>
                                <div>
                                    <label>Jenis</label>
                                        <select className="admin-instansi" style={{marginLeft:'174px'}}name="jenis" onChange={onChangeInstansi}  required>
                                            <option value="" defaultValue="" hidden></option>
                                            <option value='Kementerian'>Kementerian</option>
                                        </select>
                                </div>
                                <div>
                                    <label>Kontak</label>
                                    <input 
                                        className="admin-username" 
                                        type="text" 
                                        name="kontak" 
                                        value={newInstansi.kontak} 
                                        onChange={onChangeInstansi} 
                                        required 
                                        style={{marginLeft:'156px', width:'366px'}}
                                    />
                                </div>
                                <div>
                                    <label>Logo Instansi</label>
                                    <label htmlFor='testing' className='label_lampiran' style={{marginLeft:'108px'}}><span style={{marginRight:'15px'}}>+</span> PILIH FILE</label>
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
                                        required
                                    />
                                    <div>
                                        <div style={{height: "178px", 
                                                    marginTop:'5px',
                                                    marginLeft: "214px", 
                                                    width: "178px",
                                                    border: '1px solid black',
                                                    padding: '10px',
                                                }} 
                                        >
                                        {
                                                    logo.map((logos,index) => {
                                                        return(
                                                            <div key={index}>
                                                                    <div style={{width:'120px', 
                                                                                height:'120px', 
                                                                                backgroundColor:'black', 
                                                                                margin:'auto', 
                                                                                position:'relative'}}
                                                                    >
                                                                    </div>
                                                                    <div style={{margin:'10px auto 0' , 
                                                                                width:'120px', 
                                                                                height:'20px', 
                                                                                overflow:'hidden', 
                                                                                lineHeight:'20px',
                                                                                fontSize:'12px'}}
                                                                    >{logos.name}</div>
                                                            </div>
                                                        )
                                                    })
                                        }
                                        </div>
                                    </div>
                                </div>
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
                            </div>
                        </Element>

                        <Element id="admin_form" name="admin_form">
                            <div className="admin-1-container" style={{marginBottom:'227px'}}>
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
                                                <label>Level</label>
                                                <select className="admin-role" name="role" onChange={onChange} required>
                                                    <option value="" defaultValue="" hidden></option>
                                                    <option value="super_admin">Super Admin</option>
                                                    <option value="admin">Admin</option>
                                                </select>

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
                                            <i class='fas fa-eye' style={{fontSize:'20px' , textAlign:'center'}}></i>
                                        </button>
                                    </div>

                                <div className="admin-navigation-button">
                                    <input className="button-daftar" form='form-admin' type='submit' value='DAFTAR'></input>
                                </div>
                            </div>
                        </Element>
                    </form>

                    :

                    <form id='form-admin' className="form-admin-1" onSubmit={onEdit}>

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
                                    required
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
                                    required
                                    style={{width:'366px', marginLeft:'101px'}}
                                />
                            </div>
                            <div>
                                <label>Jenis</label>
                                    <select className="admin-instansi" style={{marginLeft:'174px'}}name="jenis" onChange={onChangeInstansi}  required>
                                        <option value="" defaultValue="" hidden></option>
                                        <option value='Kementerian'>Kementerian</option>
                                    </select>
                            </div>
                            <div>
                                <label>Kontak</label>
                                <input 
                                    className="admin-username" 
                                    type="text" 
                                    name="kontak" 
                                    value={newInstansi.kontak} 
                                    onChange={onChangeInstansi} 
                                    required 
                                    style={{marginLeft:'156px', width:'366px'}}
                                />
                            </div>
                            <div>
                                <label>Logo Instansi</label>
                                <label htmlFor='testing' className='label_lampiran' style={{marginLeft:'108px'}}><span style={{marginRight:'15px'}}>+</span> PILIH FILE</label>
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
                                    required
                                />
                                <div>
                                    <div style={{height: "178px", 
                                                marginTop:'5px',
                                                marginLeft: "214px", 
                                                width: "178px",
                                                border: '1px solid black',
                                                padding: '10px',
                                            }} 
                                    >
                                    {
                                        logo.map((logo,index) => {
                                            return(
                                                <div key={index}>
                                                        <div style={{width:'120px', 
                                                                    height:'120px', 
                                                                    backgroundColor:'black', 
                                                                    margin:'auto', 
                                                                    position:'relative'}}
                                                        >
                                                        </div>
                                                        <div style={{margin:'10px auto 0' , 
                                                                    width:'120px', 
                                                                    height:'20px', 
                                                                    overflow:'hidden', 
                                                                    lineHeight:'20px',
                                                                    fontSize:'12px'}}
                                                        >{logo.name}</div>
                                                </div>
                                            )
                                        })
                                    }
                                    </div>
                                </div>
                            </div>

                            <div className="admin-navigation-button">
                                <input className="button-daftar" form='form-admin' type='submit' value='SIMPAN PERUBAHAN'></input>
                            </div>
                        </div>
                    </Element>
                </form>
                }
          </Fragment>  
        );
}

export default FormInstansi;