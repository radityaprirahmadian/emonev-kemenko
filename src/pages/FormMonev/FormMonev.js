import React,{ Component,Fragment,useState,useContext,useEffect} from 'react';
import './FormMonev.css';
import logo_kemenko from '../../assets/logo_kemenko.png'
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import { Link,useHistory} from 'react-router-dom';
import axios from 'axios'
import objectToFormData from '../../objectToFormDataUtil'
import { AuthContext } from '../../context/Auth/AuthContext'
import { ArtikelContext } from '../../context/Artikel/artikelContext';
import Scroll , { Element } from 'react-scroll'
import Popup from '../../component/Popup/Popup';

const FormMonev =  (props) => {
    const { documentDetail, getDocumentDetail, resetDocument, isEditing, editDocumentFalse, isPreviewing, preview } = useContext(ArtikelContext)
    const { token } = useContext(AuthContext)
    const history = useHistory()
    const Link = Scroll.Link
    const id = props.match.params.id
    const type = 'monev'

    const [instansi,setInstansi] = useState('')

    const [data, setData] = useState({
        tahun: '',
        id_laporan: '',
        tujuan_pelaporan: '',
        waktu: '',
        tempat: '',
        metode: '',
        hasil: '',
        evaluasi: '',
        ketercapaian: '',
        tindak_lanjut: '',
		penanggung_jawab: {
			nama: '',
			jabatan: '',
			nip: '',
        },
    })

    const {
        tahun,
        id_laporan,
        tujuan_pelaporan,
        waktu,
        tempat,
        metode,
        hasil,
        evaluasi,
        ketercapaian,
        tindak_lanjut,
        penanggung_jawab,
        nama,
        jabatan,
        nip
    }  = data

    const [media, setMedia] = useState([])
    const [berkas,setBerkas] = useState([])
    const [mediaUrl, setMediaUrl] = useState([])
    console.log(berkas)

    const onChangeFiles = (event) => {
		setMedia(event.target.files)
    }

    const onChangeMedia = (event) => {
        setMedia([...media , ...event.target.files])
    }

    const onChangeBerkas = (event) => {
        setBerkas([...berkas , ...event.target.files])
    }
    const onChange = (event, property) => {
		if (property)
			setData({
                ...data, 
                [property]: {
                    ...data[property],
                    [event.target.name]: event.target.value,
                }
			})
		else setData({ ...data, [event.target.name]: event.target.value })
    }
    
    const onSubmit = async (event) => {
		event.preventDefault()

		const formData = objectToFormData(data)

		for (let i = 0; i < media.length; i++) {
			formData.append(`media`, media[i])
        }

        for (let i = 0; i < berkas.length; i++) {
			formData.append(`berkas`, berkas[i])
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
            const res = await axios.post('https://test.bariqmbani.me/api/v1/document?type=monev',formData,config,)
            alert(res.data.message)
            history.push('/monev')
        }
        catch(err){
            alert(err.data.message)
        }
    }
    
    const onEdit = async (event) => {
		event.preventDefault()

		const formData = objectToFormData(data)

		for (let i = 0; i < media.length; i++) {
			formData.append(`media`, media[i])
        }
        
        for (let i = 0; i < berkas.length; i++) {
			formData.append(`berkas`, berkas[i])
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

		const res = await axios.put(`https://test.bariqmbani.me/api/v1/document/${props.match.params.id}?type=monev`,formData,config,)
        history.push('/monev')
        alert(res.data.message)

        editDocumentFalse()
    }

    const setPreview = (e) => {
        e.preventDefault()
        preview()
    }

    useEffect(() => {
        if(props.match.params.id) {
            resetDocument()
            getDocumentDetail({id,type})
            if(isPreviewing){
                preview()
            }
        }
        else {
            editDocumentFalse()
        }
    },[])
    
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
        if (documentDetail) {
            setData(documentDetail && documentDetail.form)
            setInstansi(documentDetail.instansi)
            setMedia(documentDetail.form.lampiran.media)
            setMedia(documentDetail.form.lampiran.berkas)

            const mediaFileUrl = documentDetail.form.lampiran.media.map(media => `https://test.bariqmbani.me${media.path}`)
            const berkasFileUrl = documentDetail.form.lampiran.berkas.map(berkas => `https://test.bariqmbani.me${berkas.path}`)
                        
            console.log(mediaUrl)

            const files = []
            mediaFileUrl.forEach(async url =>{
                const file = await urlToFile(url)
                console.log(file)
                files.push(file)
            })

            const berkas = []
            berkasFileUrl.forEach(async url =>{
                const file = await urlToFile(url)
                console.log(file)
                berkas.push(file)
            })


            setMedia(files)  
            setBerkas(berkas)       
        }
    },[documentDetail])

    return(
    <Fragment>
        <SideBarOff/>
        <Popup notif={props.notif}/>
        {/* -------------------------- FORM SECTION START HERE ---------------------------------*/}
        <div className={isPreviewing ? 'd-none': "form"}>
            <div className="tajuk-page">
                <h1> FORM LAPORAN MONITORING DAN EVALUASI GNRM</h1>
            </div>
            <form>
                <Element id='identitas' name='identitas'>
                    <div className="monev-container">
                        <div className="form-monev">
                            <div>
                                <label>Tahun</label>
                                <input 
                                    className="monev-tahun" 
                                    type="text" 
                                    name="tahun"
                                    value={tahun}
                                    onChange={(event) => onChange(event)} 
                                />
                            </div>
                            <div>
                                <label>ID Laporan</label>
                                <input 
                                    className="monev-id-program" 
                                    type="text" 
                                    name="id_laporan"
                                    value={id_laporan} 
                                    onChange={(event) => onChange(event)}
                                />
                            </div>
                            {/* <div>
                                <label>Instansi</label>
                                <input className="monev-instansi" type="email" name="email" />
                            </div> */}
                        </div>
                        <div className="monev-navigation-button">
                            <Link 
                                to="identitas"
                                spy={true}
                                smooth={true}
                                duration={500}
                                offset={-30}
                            > 
                                <button className="previous"><i className="material-icons" style={{fontSize:'36px'}}>expand_less</i></button>
                            </Link>
                            <Link 
                                to="tujuan_pelaporan"
                                spy={true}
                                smooth={true}
                                duration={500}
                                offset={-30}
                            > 
                                <button className="forward"><i className="material-icons" style={{fontSize:'36px'}}>expand_more</i></button>
                            </Link>
                        </div>
                    </div>
                </Element>

                <Element id='tujuan_pelaporan' name='tujuan_pelaporan'>
                    <div className="monev-container">
                        <div className="monev-title">
                            TUJUAN PELAPORAN
                        </div>
                        <div className="form-monev">
                            <div>
                                <label style={{textAlign:'right', clear:'both' , float:'left'}} >Penjelasan</label>
                                <textarea 
                                    className="monev-penjelasan" 
                                    style={{height:"220px",
                                            width: "955px",
                                            marginLeft: "127px" 
                                    }}
                                    type="text" 
                                    name="tujuan_pelaporan"
                                    value={tujuan_pelaporan}
                                    onChange={(event) => onChange(event)} 
                                />
                            </div>
                        </div>
                        
                        <div className="monev-navigation-button">
                            <Link 
                                to="identitas"
                                spy={true}
                                smooth={true}
                                duration={500}
                                offset={-30}
                            > 
                                <button className="previous"><i className="material-icons" style={{fontSize:'36px'}}>expand_less</i></button>
                            </Link>
                            <Link 
                                to="waktu_tempat"
                                spy={true}
                                smooth={true}
                                duration={500}
                                offset={-30}
                            > 
                                <button className="forward"><i className="material-icons" style={{fontSize:'36px'}}>expand_more</i></button>
                            </Link>
                        </div>
                    </div>
                </Element>

                <Element id='waktu_tempat' name='waktu_tempat'>
                    <div className="monev-container">
                        <div className="monev-title">
                            WAKTU, TEMPAT, DAN METODOLOGI MONEV
                        </div>
                        <div className="form-monev">
                            <div>
                                <label>Waktu</label>
                                <input 
                                    className="monev-waktu" 
                                    style={{height:"42px",
                                            width: "955px",
                                            marginLeft: "160px" 
                                    }}
                                    type="text" 
                                    name="waktu"
                                    value={waktu}
                                    onChange={(event) => onChange(event)}
                                />
                            </div>
                            <div>
                                <label>Tempat</label>
                                <input 
                                    className="monev-tempat" 
                                    style={{height:"42px",
                                            width: "955px",
                                            marginLeft: "151px" 
                                    }}
                                    type="text" 
                                    name="tempat"
                                    value={tempat}
                                    onChange={(event) => onChange(event)} 
                                />
                            </div>
                            <div>
                                <label style={{textAlign:'left', clear:'both' , float:'left'}}>Metodologi Monitoring <br/> dan Evaluasi</label>
                                <textarea 
                                    className="monev-gambaran" 
                                    style={{height:"220px",
                                            width: "955px",
                                            marginLeft: "32px" 
                                    }}
                                    type="text" 
                                    name="metode"
                                    value={metode}
                                    onChange={(event) => onChange(event)} 
                                />
                            </div>
                        </div>
                        
                        <div className="monev-navigation-button">
                            <Link 
                                to="tujuan_pelaporan"
                                spy={true}
                                smooth={true}
                                duration={500}
                                offset={-30}
                            > 
                                <button className="previous"><i className="material-icons" style={{fontSize:'36px'}}>expand_less</i></button>
                            </Link>
                            <Link 
                                to="hasil"
                                spy={true}
                                smooth={true}
                                duration={500}
                                offset={-30}
                            > 
                                <button className="forward"><i className="material-icons" style={{fontSize:'36px'}}>expand_more</i></button>
                            </Link>
                        </div>
                    </div>
                </Element>
                
                <Element id='hasil' name='hasil'>
                    <div className="monev-container">
                        <div className="monev-title">
                            HASIL MONITORING DAN EVALUASI PROGRAM
                        </div>
                        <div className="form-monev">
                            <div>
                                <label style={{textAlign:'right', clear:'both' , float:'left'}}>Hasil Monitoring</label>
                                <textarea 
                                    className="monev-hasil-monitoring" 
                                    style={{height:"400px",
                                            width: "955px",
                                            marginLeft: "83px" 
                                    }}
                                    type="text" 
                                    name="hasil"
                                    value={hasil}
                                    onChange={(event) => onChange(event)}
                                />
                            </div>
                            <div>
                                <label style={{textAlign:'right', clear:'both' , float:'left'}}>Evaluasi Program</label>
                                <textarea 
                                    className="monev-evaluasi-program" 
                                    style={{height:"400px",
                                            width: "955px",
                                            marginLeft: "76px" 
                                    }}
                                    type="text" 
                                    name="evaluasi"
                                    value={evaluasi}
                                    onChange={(event) => onChange(event)} 
                                />
                            </div>
                        </div>
                    
                        <div className="monev-navigation-button">
                            <Link 
                                to="waktu_tempat"
                                spy={true}
                                smooth={true}
                                duration={500}
                                offset={-30}
                            > 
                                <button className="previous"><i className="material-icons" style={{fontSize:'36px'}}>expand_less</i></button>
                            </Link>
                            <Link 
                                to="ketercapaian"
                                spy={true}
                                smooth={true}
                                duration={500}
                                offset={-30}
                            > 
                                <button className="forward"><i className="material-icons" style={{fontSize:'36px'}}>expand_more</i></button>
                            </Link>
                        </div>
                    </div>
                </Element>

                <Element id='ketercapaian' name='ketercapaian'>
                    <div className="monev-container">
                        <div className="monev-title">
                            KETERCAPAIAN TARGET DAN INDIKATOR
                        </div>
                        <div className="form-monev">
                            <div>
                                <label style={{textAlign:'right', clear:'both' , float:'left'}}>Penjelasan</label>
                                <textarea 
                                    className="monev-penjelasan" 
                                    style={{height:"300px",
                                            width: "955px",
                                            marginLeft: "127px" 
                                    }}
                                    type="text" 
                                    name="ketercapaian"
                                    value={ketercapaian}
                                    onChange={(event) => onChange(event)} 
                                />
                            </div>
                        </div>
                        
                        <div className="monev-navigation-button">
                            <Link 
                                to="hasil"
                                spy={true}
                                smooth={true}
                                duration={500}
                                offset={-30}
                            > 
                                <button className="previous"><i className="material-icons" style={{fontSize:'36px'}}>expand_less</i></button>
                            </Link>
                            <Link 
                                to="tindak_lanjut"
                                spy={true}
                                smooth={true}
                                duration={500}
                                offset={-30}
                            > 
                                <button className="forward"><i className="material-icons" style={{fontSize:'36px'}}>expand_more</i></button>
                            </Link>
                        </div>
                    </div>
                </Element>

                <Element id='tindak_lanjut' name='tindak_lanjut'>
                    <div className="monev-container">
                        <div className="monev-title">
                            TINDAK LANJUT HASIL MONITORING DAN EVALUASI
                        </div>
                        <div className="form-monev">
                            <div>
                                <label style={{textAlign:'right', clear:'both' , float:'left'}}>Penjelasan</label>
                                <textarea 
                                    className="monev-penjelasan" 
                                    style={{height:"300px",
                                            width: "955px",
                                            marginLeft: "127px" 
                                    }}
                                    type="text" 
                                    name="tindak_lanjut"
                                    value={tindak_lanjut}
                                    onChange={(event) => onChange(event)} 
                                />
                            </div>
                        </div>
                        
                        <div className="monev-navigation-button">
                            <Link 
                                to="ketercapaian"
                                spy={true}
                                smooth={true}
                                duration={500}
                                offset={-30}
                            > 
                                <button className="previous"><i className="material-icons" style={{fontSize:'36px'}}>expand_less</i></button>
                            </Link>
                            <Link 
                                to="lampiran"
                                spy={true}
                                smooth={true}
                                duration={500}
                                offset={-30}
                            > 
                                <button className="forward"><i className="material-icons" style={{fontSize:'36px'}}>expand_more</i></button>
                            </Link>
                        </div>
                    </div>
                </Element>

                <Element id='lampiran' name='lampiran'>
                    <div className="monev-container">
                        <div className="monev-title">
                            LAMPIRAN
                        </div>
                        <div className="form-monev">
                            <div>
                                <label>Lampiran Media</label>
                                <label htmlFor='testing' className='label_lampiran'><span style={{marginRight:'15px'}}>+</span> PILIH FILE</label>
                                <input 
                                        id="testing"
                                        className="gnrm-penjelasan" 
                                        style={{height: "42px", 
                                                marginLeft: "28px", 
                                                width: "955px"}} 
                                        onChange={onChangeMedia}
                                        type="file"
                                        accept="image/*"
                                        name="media"
                                        multiple
                                    />
                                    <div style={{height: "fit-content", 
                                                marginLeft: "208px", 
                                                width: "955px",
                                                marginTop:'10px',
                                                border: '1px solid black',
                                                padding: '10px',
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                            }} 
                                    >
                                        {
                                        media.map((media,index) => {
                                            return(
                                                <div key={media.lastModified}>
                                                        <div style={{width:'150px', 
                                                                    height:'150px', 
                                                                    backgroundColor:'black', 
                                                                    marginRight:'35px', 
                                                                    position:'relative'}}
                                                        >
                                                            <div style={{position:'absolute', 
                                                                        backgroundColor:'#C04B3E' , 
                                                                        width:'25px' , 
                                                                        height:'25px', 
                                                                        borderRadius:'50%', 
                                                                        top:'-7px', 
                                                                        right:'-7px', 
                                                                        lineHeight:'25px', 
                                                                        textAlign:'center',
                                                                        cursor:'pointer'}}
                                                            > X </div>
                                                        </div>
                                                        <div style={{marginTop:'10px' , 
                                                                    width:'150px' , 
                                                                    height:'20px', 
                                                                    overflow:'hidden', 
                                                                    lineHeight:'20px'}}
                                                        >{media.name}</div>
                                                    
                                                </div>
                                            )
                                        })
                                    }
                                    </div>

                            </div>
                            <div>
                                <label>Lampiran Berkas</label>
                                <label htmlFor='testingg' className='label_lampiran' style={{marginLeft:'74px'}}><span style={{marginRight:'15px'}}>+</span> PILIH FILE</label>
                                    <input 
                                        id="testingg"
                                        className="gnrm-penjelasan" 
                                        style={{height: "42px", 
                                                marginLeft: "23px", 
                                                width: "955px"}} 
                                        onChange={onChangeBerkas}
                                        type="file"
                                        accept="application/pdf"
                                        name="media"
                                        multiple
                                    />
                            </div>
                            
                                    <div style={{height: "fit-content", 
                                                marginLeft: "208px",
                                                marginTop:'10px', 
                                                width: "955px",
                                                border: '1px solid black',
                                                padding: '10px',
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                            }} 
                                    >
                                        {
                                        berkas.map((berkas,index) => {
                                            return(
                                                <div key={berkas.lastModified}>
                                                        <div style={{width:'150px', 
                                                                    height:'150px', 
                                                                    backgroundColor:'black', 
                                                                    marginRight:'35px', 
                                                                    position:'relative'}}
                                                        >
                                                            <div style={{position:'absolute', 
                                                                        backgroundColor:'#C04B3E' , 
                                                                        width:'25px' , 
                                                                        height:'25px', 
                                                                        borderRadius:'50%', 
                                                                        top:'-7px', 
                                                                        right:'-7px', 
                                                                        lineHeight:'25px', 
                                                                        textAlign:'center',
                                                                        cursor:'pointer'}}
                                                            > X </div>
                                                        </div>
                                                        <div style={{marginTop:'10px' , 
                                                                    width:'150px' , 
                                                                    height:'20px', 
                                                                    overflow:'hidden', 
                                                                    lineHeight:'20px'}}
                                                        >{berkas.name}</div>
                                                    
                                                </div>
                                            )
                                        })
                                    }
                                    </div>
                        </div>
                        
                        <div className="monev-navigation-button">
                            <Link 
                                to="tindak_lanjut"
                                spy={true}
                                smooth={true}
                                duration={500}
                                offset={-30}
                            > 
                                <button className="previous"><i className="material-icons" style={{fontSize:'36px'}}>expand_less</i></button>
                            </Link>
                            <Link 
                                to="penanggung_jawab"
                                spy={true}
                                smooth={true}
                                duration={500}
                                offset={-30}
                            > 
                                <button className="forward"><i className="material-icons" style={{fontSize:'36px'}}>expand_more</i></button>
                            </Link>
                        </div>
                    </div>
                </Element>

                <Element id='penanggung_jawab' name='penanggung_jawab'>
                    <div className="monev-container" style={{marginBottom:"296px"}}>
                        <div className="monev-title">
                            PENANGGUNG JAWAB
                        </div>
                        <div className="form-monev">
                            <div>
                                <label>Nama</label>
                                <input 
                                    className="monev-nama" 
                                    style={{height:"42px",
                                            width: "403px",
                                            marginLeft: "164px" 
                                    }}
                                    type="text" 
                                    name="nama"
                                    value={penanggung_jawab.nama}
                                    onChange={(event) => onChange(event,'penanggung_jawab')} 
                                />
                            </div>
                            <div>
                                <label>Jabatan</label>
                                <input 
                                    className="monev-jabatan" 
                                    style={{height:"42px",
                                            width: "403px",
                                            marginLeft: "151px" 
                                    }}
                                    type="text" 
                                    name="jabatan"
                                    value={penanggung_jawab.jabatan} 
                                    onChange={(event) => onChange(event,'penanggung_jawab')} 
                                />
                            </div>
                            <div>
                                <label>NIP</label>
                                <input 
                                    className="monev-nip" 
                                    style={{height:"42px",
                                            width: "403px",
                                            marginLeft: "183px" 
                                    }}
                                    type="text" 
                                    name="nip"
                                    value={penanggung_jawab.nip}
                                    onChange={(event) => onChange(event,'penanggung_jawab')} 
                                />
                            </div>
                        </div>
                        <div className="monev-navigation-button" style={{marginTop:"162px"}}>
                            <Link 
                                to="lampiran"
                                spy={true}
                                smooth={true}
                                duration={500}
                                offset={-30}
                            > 
                                <button className="previous-last-1"><i className="material-icons">expand_less</i></button>
                            </Link>
                            {
                                isEditing ?
                                    <button className="simpan-monev" onClick={onEdit}>SIMPAN PERUBAHAN</button>
                                :
                                    <button className="simpan-monev" onClick={onSubmit}>SIMPAN PERUBAHAN</button>
                            }
                            
                            <button className="preview-monev" onClick={setPreview}>PREVIEW LAPORAN</button>
                            
                        </div>
                    </div>
                </Element>
            </form>
            </div>
        {/* -------------------------- FORM SECTION END HERE ---------------------------------*/}
            
        {/* -------------------------- PREVIEW SECTION START HERE ---------------------------------*/}   
            <div className={isPreviewing ? "preview-page" : "d-none"}>
                    <div className="title-preview-page" style={{color:'#D33732'}}>
                        PREVIEW LAPORAN
                    </div>
                    <div className="preview-picture" style={{padding: '43px 98px'}}>
                        <div className="preview-header">
                            <table>
                                <thead>
                                    <tr>
                                        <th width='105px'></th>
                                        <th width='800px'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{fontSize:"12px"}} >
                                        <td>
                                            <img src={logo_kemenko} style={{width:"100px" , position: 'absolute'}}/>
                                        </td>
                                        <td>
                                            <h1 style={{lineHeight:'16px', fontWeight:'bold'}}>Gerakan Nasional Revolusi Mental</h1>
                                                <h1 style={{lineHeight:'16px', fontWeight:'bold'}}>Sekretariat</h1>
                                                <h1 style={{lineHeight:'16px'}}>Jl. Medan Merdeka Barat No. 3, Jakarta Pusat 10110 <br/>
                                                Gedung Kementerian Koordinator Bidang Pembangunan Manusia & Kebudayaan <br/>
                                                Telp (021) 34830544; Fax (021) 34830745; <br/>
                                                website : www.revolusimental.go.id, email: halo@revolusimental.go.id</h1>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <hr style={{backgroundColor: 'black'}}/>
                            <br/>
                            <div className="judul-preview" style={{textAlign:"center", fontSize:'12px'}}>
                                <h1 style={{lineHeight:'25px', fontWeight:'bold'}}>
                                    Proteksi Input Program Gerakan Nasioal Revolusi Mental (GNRM) Tahun 
                                    <span style={{color:'#D33732'}}> {data.tahun}</span>
                                </h1>

                                <h1 style={{lineHeight:'25px', fontWeight:'bold'}}>
                                    GERAKAN NASIONAL REVOLUSI MENTAL (GNRM) Tahun 
                                    <span style={{color:'#D33732'}}> {data.tahun}</span>
                                </h1><br/>
                                
                                <h1 style={{lineHeight:'15px'}}>Dilarang menyalin, menyimpan, memperbanyakan sebagian atau seluruh isi laporan ini dalam bentuk <br/> apapun kecuali oleh Koordinator Pelaksana Gerakan (KPG) dan Sekretariat Revolusi Mental</h1><br/>

                                <h1 style={{lineHeight:'35px', fontWeight:'bold'}}>
                                    LAPORAN MONITORING DAN EVALUASI<br/>
                                    GNRM 2020
                                </h1><br/>
                                
                                <h1 style={{lineHeight:'15px'}}> 
                                    ID Laporan : 
                                    <span style={{color:'#D33732'}}> {data.id_laporan}</span>
                                </h1>

                                <h1 style={{lineHeight:'15px'}}> 
                                    Laporan Triwulan ke 1 Tahun ke
                                    <span style={{color:'#D33732'}}> 2 </span> 
                                    GNRM Tahun 2020 <br/>
                                    <span style={{color:'#D33732'}}> {instansi} </span>
                                </h1>
                            </div>
                        </div>

                            <div className="preview-body" style={{margin:'20px auto 0', fontSize:'12px', lineHeight:'16px'}}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th width="54px"></th>
                                            <th width="997px"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                       <tr style={{fontWeight:'bold'}}>
                                            <td>1.</td>
                                            <td >Instansi</td> 
                                       </tr>
                                       <tr>
                                            <td></td>
                                            <td style={{paddingTop:'12px', paddingBottom:'32px'}}>{instansi}</td> 
                                       </tr>
                                       <tr style={{fontWeight:'bold'}}>
                                            <td>2.</td>
                                            <td>Tujuan Pelaporan</td> 
                                       </tr>
                                       <tr>
                                            <td></td>
                                            <td style={{paddingTop:'12px', paddingBottom:'32px'}}>
                                                {data.tujuan_pelaporan}
                                            </td> 
                                       </tr>
                                       <tr style={{fontWeight:'bold'}}>
                                            <td>3.</td>
                                            <td>Waktu, Tempat, dan Metodologi Monev</td> 
                                       </tr>
                                       <tr>
                                            <td></td>
                                            <td style={{paddingTop:'12px', paddingBottom:'32px'}}>
                                                {data.waktu} <br/>
                                                {data.tempat} <br/>
                                                {data.metode}
                                            </td> 
                                       </tr>
                                       <tr style={{fontWeight:'bold'}}>
                                            <td>4.</td>
                                            <td>Hasil Monitoring dan Evaluasi Program (Pelaporan Kinerja)</td> 
                                       </tr>
                                       <tr>
                                            <td></td>
                                            <td style={{paddingTop:'12px', paddingBottom:'32px'}}>
                                            {data.hasil} <br/>
                                            {data.evaluasi}
                                            </td> 
                                       </tr>
                                       <tr style={{fontWeight:'bold'}}>
                                            <td>5.</td>
                                            <td>ketercapaian Indikator dan Target (Pengukuran Kinerja)</td> 
                                       </tr>
                                       <tr>
                                            <td></td>
                                            <td style={{paddingTop:'12px', paddingBottom:'32px'}}>
                                            {data.ketercapaian} <br/>
                                            {data.target}
                                            </td> 
                                       </tr>
                                       <tr style={{fontWeight:'bold'}}>
                                            <td>6.</td>
                                            <td>Tindak Lanjut Hasil Monitoring dan Evaluasi</td> 
                                       </tr>
                                       <tr>
                                            <td></td>
                                            <td style={{paddingTop:'12px', paddingBottom:'32px'}}>
                                            {data.tindak_lanjut} <br/>
                                            </td> 
                                       </tr>
                                       <tr style={{fontWeight:'bold'}}>
                                            <td>7.</td>
                                            <td>Lampiran Media dan Berkas</td> 
                                       </tr>
                                       <tr>
                                            <td></td>
                                            <td style={{paddingTop:'12px', paddingBottom:'32px'}}>Nam augue neque fermentum non, magnis. Nibh eu sed vel eleifend cursus arcu faucibus sapien integer. Aenean duis convallis enim lobortis. Venenatis cursus nibh porta magnis orci, nunc. Massa ut feugiat posuere facilisi. Imperdiet sed felis faucibus mattis et, nunc non. Pharetra non vitae purus non pharetra commodo rutrum enim. Eu viverra magna dictum non vitae velit amet. Nibh at aliquet ultrices proin suscipit sit. Nisl auctor leo, tincidunt non volutpat iaculis est nibh non. Massa sed blandit facilisi pharetra faucibus sed non ac. Sit aliquam tellus morbi a faucibus. 
                                            Ullamcorper ultrices porta nulla erat in magna ante. Aliquet vel eget id interdum ornare. Ut ipsum ullamcorper at vel orci arcu laoreet in. Sed tempor tortor mattis augue pellentesque consectetur. Elit elementum vel consectetur purus.
                                            </td> 
                                       </tr>
                                       <tr>
                                            <td></td>
                                            <td style={{paddingTop:'154px'}}>
                                            Demikian hasil laporan monitoring dan evaluasi triwulan ke 1 tahun 
                                            <span style={{color:'#D33732'}}> {data.tahun} </span> 
                                            ini dibuat dan dapat dikoordinasikan untuk dilaksanakan sebagaimana mestinya. <br/>
                                            Atas perhatiannya diucapkan terimakasih.</td> 
                                       </tr>
                                    </tbody> 
                                </table>
                            </div>
                                <div className="preview-ttd" style={{marginTop:'10px', marginBottom:'119px' , fontSize:'12px'}}>
                                    <div style={{textAlign:'left' , marginLeft:'893px'}}>
                                        <h1>..................., ...................</h1><br/>
                                        <h1>{data.penanggung_jawab.nama}</h1>
                                        <br/>
                                        <br/>
                                        <br/>
                                        <h1>TTD</h1>
                                        <h1>{data.penanggung_jawab.nip}</h1>
                                    </div>
                                </div>

                            
                            
                            <button className="button-edit-kembali" onClick={setPreview}>EDIT KEMBALI</button>
                            {
                                isEditing ?
                                    <button className="button-unggah" onClick={onEdit}>UNGGAH LAPORAN</button>
                                :
                                    <button className="button-unggah" onClick={onSubmit}>UNGGAH LAPORAN</button>
                            }
                    </div>
                </div>
                {/* -------------------------- PREVIEW SECTION START HERE ---------------------------------*/}
        </Fragment>  
    );
}


export default FormMonev;