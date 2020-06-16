import React,{Component,Fragment,useState,useContext,useEffect} from 'react';
import './FormGNRM.css';
import logo_kemenko from '../../assets/logo_kemenko.png'
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import {Link,useHistory} from 'react-router-dom';
import axios from 'axios'
import objectToFormData from '../../objectToFormDataUtil'
import { AuthContext } from '../../context/Auth/AuthContext'
import { ArtikelContext } from '../../context/Artikel/artikelContext';
import Scroll, { Element } from 'react-scroll'
import Popup from '../../component/Popup/Popup';


const FormGNRM = (props) => {
    const { documentDetail, getDocumentDetail, resetDocument, isEditing, editDocumentFalse, isPreviewing, preview } = useContext(ArtikelContext)
    
    const Link = Scroll.Link;
    

    const { token } = useContext(AuthContext)
    const history = useHistory()
    const [ panjang, setPanjang] = useState('0')
    const id = props.match.params.id 
    const type = 'gnrm'

    const [data, setData] = useState({
        tahun: '',
        id_program: '',
        instansi:'',
		kegiatan: {
			nama_program: '',
			penjelasan_kegiatan: '',
		},
		output: {
			indikator_capaian: '',
			sasaran: '',
			target: '',
		},
		kondisi_awal: '',
		anggaran: {
			sumber_dana: '',
			besar_anggaran: '',
		},
		proses: '',
		pihak_terkait: {
            0: {
				lembaga: '',
				peran: '',
				penjelasan_pihak_terkait: '',

            }
        },
		penanggung_jawab: {
			nama: '',
			jabatan: '',
			nip: '',
		},
    })
    
    const {
        tahun,
        id_program,
        instansi,
        kegiatan,
        nama_program,
        penjelasan_kegiatan,
        output,
        indikator_capaian,
        sasaran,
        target,
        kondisi_awal,
        pihak_terkait,
        anggaran,
        sumber_dana,
        besar_anggaran,
        proses,
        penanggung_jawab,
        nama,
        jabatan,
        nip
    } = data
    console.log(data)

    const [media, setMedia] = useState([])
    const [mediaUrl, setMediaUrl] = useState([])
    const [form, setForm] = useState([])

    const setPreview = (e) => {
        e.preventDefault()
        preview()
    }
    const addForm = (e) => {
        e.preventDefault()
        let forms = form.concat([''])
        setForm(
          forms
        )
    }

    const onChangeFiles = (event) => {
        setMedia([...media , ...event.target.files])
    }

    const onChange = (event, property, array = false, index) => {
		if (property)
			setData({
				...data,
				[property]: array
					? {
                            ...data[property],
                            [index]: {
								...data[property][index],
								[event.target.name]: event.target.value,
							},
					  }
					: {
							...data[property],
							[event.target.name]: event.target.value,
					  },
			})
		else setData({ ...data, [event.target.name]: event.target.value })
	}

    const onSubmit = async (event) => {
		event.preventDefault()

		const formData = objectToFormData(data)

		for (let i = 0; i < media.length; i++) {
			formData.append(`media`, media[i])
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

		const res = await axios.post('https://test.bariqmbani.me/api/v1/document?type=gnrm',formData,config,)
        history.push('/gnrm')
        alert(res.data.message)
        resetDocument()
	}
    
    const lebar = window.screen.width
    console.log(lebar)
    
    const onEdit = async (event) => {
		event.preventDefault()

		const formData = objectToFormData(data)

		for (let i = 0; i < media.length; i++) {
			formData.append(`media`, media[i])
		}

		for (let pair of formData.entries()) {
			console.log(pair[0] + ', ' + pair[1])
		}

		const config = {
			headers: {
                'Content-Type': 'multipart/form-data',
                'X-Requested-With': 'XMLHttpRequest',
				'X-Auth-Token': `aweuaweu ${token}`,
			},
		}

		const res = await axios.put(`https://test.bariqmbani.me/api/v1/document/${props.match.params.id}?type=gnrm`,formData,config,)
        history.push('/gnrm')
        alert(res.data.message)
        resetDocument()
        editDocumentFalse()
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
            setMedia(documentDetail.form.lampiran.media)
            setPanjang(documentDetail && documentDetail.form.pihak_terkait.length)

            const mediaFileUrl = documentDetail.form.lampiran.media.map(media => `https://test.bariqmbani.me${media.path}`)
            
                        
            console.log(mediaUrl)

            const files = []
            mediaFileUrl.forEach(async url =>{
                const file = await urlToFile(url)
                console.log(file)
                files.push(file)
            })

            setMedia(files)         
            setMediaUrl(mediaFileUrl)
        }
    },[documentDetail])

    
    const onDeleteMedia = (e,x) => {
        console.log(x)
        e.preventDefault()
        let meds = media.splice(x,1)
        setMedia(media)
        console.log(media)
    }

    
    // useEffect(() => {
    //     console.log(documentDetail)
    //     if (documentDetail){

            
    //     }
    // },[])

    console.log(media)

    return(
      <Fragment>
          <SideBarOff/>
          <Popup notif={props.notif}/>
            {/* -------------------------- FORM SECTION START HERE ---------------------------------*/}
            <div className={isPreviewing ? 'd-none': "form"}>
                <div className="tajuk-page">
                <h1> FORM RENCANA PELAKSANAAN PROGRAM</h1>
                </div>

                <form>
                    <Element id='identitas' name='identitas'>
                        <div className="gnrm-container">
                            <div className="form-gnrm">
                                <div>
                                    <label>Tahun</label>
                                    <input 
                                        className="gnrm-tahun" 
                                        type="text" 
                                        name="tahun"
                                        value={tahun}
                                        onChange={(event) => onChange(event)} 
                                    />
                                </div>
                                <div>
                                    <label>ID Program</label>
                                    <input 
                                        className="gnrm-id-program" 
                                        type="text" 
                                        name="id_program"
                                        value={id_program}
                                        onChange={(event) => onChange(event)}
                                    />
                                </div>
                                {/* <div>
                                    <label>Instansi</label>
                                    <input 
                                        className="gnrm-instansi" 
                                        type="text" 
                                        name="instansi" 
                                        value={instansi}
                                        onChange={(event) => onChange(event)}    
                                    />
                                </div> */}
                            </div>

                            <div className="gnrm-navigation-button">
                                <Link 
                                    to="identitas"
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    offset={-30}
                                >
                                
                                    <button className="previous"><i className="material-icons">expand_less</i></button>
                                </Link>
                                <Link 
                                    to="kegiatan"
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    offset={-30}
                                >
                                <button className="forward"><i className="material-icons">expand_more</i></button>
                                </Link>
                            </div>
                        </div>
                    </Element>

                    <Element id='kegiatan' name='kegiatan'>
                        <div className="gnrm-container">
                            <div className="gnrm-title">
                                KEGIATAN
                            </div>
                            <div className="form-gnrm">
                                <div>
                                    <label>Nama Program</label>
                                    <input 
                                        className="gnrm-nama-program" 
                                        style={{height: "42px", 
                                                marginLeft: "93px", 
                                                width: "955px"}} 
                                        type="text" 
                                        name="nama_program"
                                        value={kegiatan.nama_program}
                                        onChange={(event) => onChange(event,'kegiatan')}
                                    />
                                </div>
                                <div>
                                    <label>Penjelasan</label>
                                    <textarea 
                                        className="gnrm-penjelasan" 
                                        style={{height: "283px", 
                                                marginLeft: "127px", 
                                                width: "955px"}}
                                        type="text" 
                                        name="penjelasan_kegiatan"
                                        value={kegiatan.penjelasan_kegiatan}
                                        onChange={(event) => onChange(event,'kegiatan')} 
                                    />
                                </div>
                            </div>

                            <div className="gnrm-navigation-button">
                                <Link 
                                    to="identitas"
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    offset={-30}
                                >
                                    <button className="previous"><i className="material-icons">expand_less</i></button>
                                </Link>
                                <Link 
                                    to="output"
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    offset={-30}
                                >
                                    <button className="forward"><i className="material-icons">expand_more</i></button>
                                </Link>
                            </div>
                        </div>
                    </Element>

                    <Element id='output' name='output'>
                        <div className="gnrm-container" >
                            <div className="gnrm-title">
                                OUTPUT
                            </div>
                            <div className="form-gnrm">
                                <div>
                                    <label>Indikator Capaian</label>
                                    <textarea 
                                        className="gnrm-indikator" 
                                        style={{height: "150px", 
                                                marginLeft: "70px", 
                                                width: "955px"}}
                                        type="text" 
                                        name="indikator_capaian"
                                        value={output.indikator_capaian}
                                        onChange={(event) => onChange(event,'output')} 
                                    />
                                </div>
                                <div>
                                    <label>Sasaran</label>
                                    <textarea 
                                        className="gnrm-sasaran" 
                                        style={{height: "130px", 
                                                marginLeft: "149px", 
                                                width: "955px"}}
                                        type="text" 
                                        name="sasaran"
                                        value={output.sasaran}
                                        onChange={(event) => onChange(event,'output')}

                                    />
                                </div>
                                <div>
                                    <label>Target</label>
                                    <textarea 
                                        className="gnrm-target" 
                                        style={{height: "130px", 
                                                marginLeft: "161px", 
                                                width: "955px"}}
                                        type="text" 
                                        name="target"
                                        value={output.target}
                                        onChange={(event) => onChange(event,'output')} 
                                    />
                                </div>
                            </div>
                        
                            <div className="gnrm-navigation-button">
                                <Link 
                                    to="kegiatan"
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    offset={-30}
                                >
                                    <button className="previous"><i className="material-icons">expand_less</i></button>
                                </Link>
                                <Link 
                                    to="kondisi_awal"
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    offset={-30}
                                >
                                    <button className="forward"><i className="material-icons">expand_more</i></button>
                                </Link>
                            </div>
                        </div>
                    </Element>

                    <Element id='kondisi_awal' name='kondisi_awal'>
                        <div className="gnrm-container">
                            <div className="gnrm-title">
                                KONDISI AWAL
                            </div>
                            <div className="form-gnrm">
                                <div>
                                    <label>Penjelasan</label>
                                    <textarea 
                                        className="gnrm-penjelasan" 
                                        style={{height: "300px", 
                                                marginLeft: "127px", 
                                                width: "955px"}}
                                        type="text" 
                                        name="kondisi_awal"
                                        value={kondisi_awal}
                                        onChange={(event) => onChange(event)} 
                                    />
                                </div>
                            </div>
                            
                            <div className="gnrm-navigation-button">
                                <Link 
                                    to="output"
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    offset={-30}
                                >
                                    <button className="previous"><i className="material-icons">expand_less</i></button>
                                </Link>
                                <Link 
                                    to="anggaran"
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    offset={-30}
                                >
                                    <button className="forward"><i className="material-icons">expand_more</i></button>
                                </Link>
                            </div>
                        </div>
                    </Element>

                    <Element id='anggaran' name='anggaran'>
                        <div className="gnrm-container">
                            <div className="gnrm-title">
                                ANGGARAN
                            </div>
                            <div className="form-gnrm">
                                <div>
                                    <label>Sumber Pendanaan</label>
                                    <input 
                                        className="gnrm-pendanaan" 
                                        style={{height: "42px", 
                                                marginLeft: "59px", 
                                                width: "955px"}}
                                        type="text" 
                                        name="sumber_dana"
                                        value={anggaran.sumber_dana}
                                        onChange={(event) => onChange(event,'anggaran')}
                                    />
                                </div>
                                <div>
                                    <label>Besaran Anggaran</label>
                                    <input 
                                        className="gnrm-anggaran" 
                                        style={{height: "42px", 
                                                marginLeft: "69px", 
                                                width: "955px"}}
                                        placeholder="Rp..."
                                        type="text" 
                                        name="besar_anggaran"
                                        value={anggaran.besar_anggaran}
                                        onChange={(event) => onChange(event,'anggaran')} 
                                    />
                                </div>
                            </div>
                            
                            <div className="gnrm-navigation-button">
                                <Link 
                                    to="kondisi_awal"
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    offset={-30}
                                >
                                    <button className="previous"><i className="material-icons">expand_less</i></button>
                                </Link>
                                <Link 
                                    to="proses"
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    offset={-30}
                                >
                                    <button className="forward"><i className="material-icons">expand_more</i></button>
                                </Link>
                            </div>
                        </div>
                    </Element>

                    <Element id='proses' name='proses'>
                        <div className="gnrm-container">
                            <div className="gnrm-title">
                                PROSES PERKEMBANGAN PELAKSANAAN KEGIATAN
                            </div>
                            <div className="form-gnrm">
                                <div>
                                    <label>Mekanisme Pelaksanaan <br/>Kegiatan</label>
                                    <textarea 
                                        className="gnrm-penjelasan" 
                                        style={{height: "400px", 
                                                marginLeft: "15px", 
                                                width: "955px"}} 
                                        type="text" 
                                        name="proses"
                                        value={proses}
                                        onChange={(event) => onChange(event)}
                                    />
                                </div>
                            </div>
                        
                            <div className="gnrm-navigation-button">
                                <Link 
                                    to="anggaran"
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    offset={-30}
                                >
                                    <button className="previous"><i className="material-icons">expand_less</i></button>
                                </Link>
                                <Link 
                                    to="pihak_terkait"
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    offset={-30}
                                >
                                    <button className="forward"><i className="material-icons">expand_more</i></button>
                                </Link>
                            </div>
                        </div>
                    </Element>

                    <Element name='pihak_terkait' id='pihak_terkait'>
                        <div className="gnrm-container">
                            <div className="gnrm-title">
                                PIHAK TERKAIT
                            </div>
                            <div className="form-gnrm">
                                {
                                    !documentDetail ?
                                    <Fragment>
                                        <div>
                                            <label>Peran Pihak Terkait</label>
                                            <input 
                                                className="gnrm-terkait" 
                                                style={{height: "42px", 
                                                        marginLeft: "57px", 
                                                        width: "955px"}}
                                                type="text" 
                                                name="peran"
                                                value={data.pihak_terkait.peran}
                                                onChange={(event) => onChange(event,'pihak_terkait',true,0)} 
                                            />
                                        </div>
                                        <div>
                                            <label>Lembaga Terkait</label>
                                            <input 
                                                className="gnrm-terkait" 
                                                style={{height: "42px", 
                                                        marginLeft: "80px", 
                                                        width: "955px"}}
                                                type="text" 
                                                name="lembaga"
                                                value={data.pihak_terkait.lembaga}
                                                onChange={(event) => onChange(event,'pihak_terkait',true,0)} 
                                            />
                                        </div>
                                        <div>
                                            <label>Penjelasan</label>
                                            <textarea 
                                                className="gnrm-penjelasan" 
                                                style={{height: "400px", 
                                                        marginLeft: "127px", 
                                                        width: "955px"}}
                                                type="text" 
                                                name="penjelasan_pihak_terkait"
                                                value={data.pihak_terkait.penjelasan_pihak_terkait}
                                                onChange={(event) => onChange(event,'pihak_terkait',true,0)} 
                                            />
                                        </div>
                                    </Fragment>
                                    :
                                    documentDetail.form.pihak_terkait.map((pihak,index) => {
                                        return(
                                            <Fragment key={index}>
                                                <div>
                                                    <label>Peran Pihak Terkait</label>
                                                    <input 
                                                        className="gnrm-terkait" 
                                                        style={{height: "42px", 
                                                                marginLeft: "57px", 
                                                                width: "955px"}}
                                                        type="text" 
                                                        name="peran"
                                                        value={data.pihak_terkait[index] && data.pihak_terkait[index].peran}
                                                        onChange={(event) => onChange(event,'pihak_terkait',true,index)} 
                                                    />
                                                </div>
                                                <div>
                                                    <label>Lembaga Terkait</label>
                                                    <input 
                                                        className="gnrm-terkait" 
                                                        style={{height: "42px", 
                                                                marginLeft: "80px", 
                                                                width: "955px"}}
                                                        type="text" 
                                                        name="lembaga"
                                                        value={data.pihak_terkait[index] && data.pihak_terkait[index].lembaga}
                                                        onChange={(event) => onChange(event,'pihak_terkait',true,index)} 
                                                    />
                                                </div>
                                                <div>
                                                    <label>Penjelasan</label>
                                                    <textarea 
                                                        className="gnrm-penjelasan" 
                                                        style={{height: "400px", 
                                                                marginLeft: "127px", 
                                                                width: "955px"}}
                                                        type="text" 
                                                        name="penjelasan_pihak_terkait"
                                                        value={data.pihak_terkait[index] && data.pihak_terkait[index].penjelasan_pihak_terkait}
                                                        onChange={(event) => onChange(event,'pihak_terkait',true,index)} 
                                                    />
                                                </div>
                                            </Fragment>
                                        )    
                                    })
                                }
                                {
                                    form.map((form,index) => {
                                        return(
                                            <Fragment key={index+panjang}>
                                                <div>
                                                    <label>Peran Pihak Terkait</label>
                                                    <input 
                                                        className="gnrm-terkait" 
                                                        style={{height: "42px", 
                                                                marginLeft: "57px", 
                                                                width: "955px"}}
                                                        type="text" 
                                                        name="peran"
                                                        value={data.pihak_terkait.peran}
                                                        onChange={(event) => onChange(event,'pihak_terkait',true,index+panjang)} 
                                                    />
                                                </div>
                                                <div>
                                                    <label>Lembaga Terkait</label>
                                                    <input 
                                                        className="gnrm-terkait" 
                                                        style={{height: "42px", 
                                                                marginLeft: "80px", 
                                                                width: "955px"}}
                                                        type="text" 
                                                        name="lembaga"
                                                        value={data.pihak_terkait.lembaga}
                                                        onChange={(event) => onChange(event,'pihak_terkait',true,index+panjang)} 
                                                    />
                                                </div>
                                                <div>
                                                    <label>Penjelasan</label>
                                                    <textarea 
                                                        className="gnrm-penjelasan" 
                                                        style={{height: "400px", 
                                                                marginLeft: "127px", 
                                                                width: "955px"}}
                                                        type="text" 
                                                        name="penjelasan_pihak_terkait"
                                                        value={data.pihak_terkait.penjelasan_pihak_terkait}
                                                        onChange={(event) => onChange(event,'pihak_terkait',true,index+panjang)} 
                                                    />
                                                </div>
                                            </Fragment>
                                        )
                                    })
                                }
                            </div>
                            <div>
                                <label className="tambah-lembaga" >
                                    Tambah Lembaga 
                                </label>
                                <i className="fas fa-plus" style={{fontSize:'24px', marginLeft:'70px',cursor:'pointer'}} onClick={addForm}/>
                            </div>         


                            <div className="gnrm-navigation-button">
                                <Link 
                                    to="proses"
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
                        <div className="gnrm-container">
                            <div className="gnrm-title">
                                LAMPIRAN MEDIA
                            </div>
                            <div className="form-gnrm">
                                <div>
                                    <label>Lampiran Media</label>
                                    <label htmlFor='testing' className='label_lampiran'><span style={{marginRight:'15px'}}>+</span> PILIH FILE</label>
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
                                        multiple
                                    />
                                </div>
                                <div>
                                    <div style={{height: "fit-content", 
                                                marginLeft: "208px", 
                                                width: "955px",
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
                                                            onClick={(e) => onDeleteMedia(e,index)}> X </div>
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
                            </div>
                        
                            <div className="gnrm-navigation-button">
                                <Link 
                                    to="pihak_terkait"
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    offset={-30}
                                >
                                    <button className="previous"><i className="material-icons">expand_less</i></button>
                                </Link>
                                <Link 
                                    to="penanggung_jawab"
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    offset={-30}
                                >
                                    <button className="forward"><i className="material-icons">expand_more</i></button>
                                </Link>
                            </div>
                        </div>
                    </Element>

                    <Element id='penanggung_jawab' name='penanggung_jawab'>
                        <div className="gnrm-container" style={{marginBottom:"130px"}}>
                            <div className="form-gnrm">
                                <div>
                                    <label>Nama</label>
                                    <input 
                                        className="gnrm-eselon" 
                                        style={{height: "42px", 
                                                marginLeft: "164px", 
                                                width: "403px"}}
                                        type="text" 
                                        name="nama"
                                        value={penanggung_jawab.nama}
                                        onChange={(event) => onChange(event,'penanggung_jawab')} 
                                    
                                    />
                                </div>
                                <div>
                                    <label>Jabatan</label>
                                    <input 
                                        className="gnrm-nip" 
                                        style={{height: "42px", 
                                                marginLeft: "151px", 
                                                width: "403px"}}
                                        type="text" 
                                        name="jabatan"
                                        value={penanggung_jawab.jabatan} 
                                        onChange={(event) => onChange(event,'penanggung_jawab')}
                                    
                                    />
                                </div>
                                <div>
                                    <label>NIP</label>
                                    <input 
                                        className="gnrm-lampiran" 
                                        style={{height: "42px", 
                                                marginLeft: "183px", 
                                                width: "403px"}}    
                                    
                                        type="text" 
                                        name="nip"
                                        value={penanggung_jawab.nip}
                                        onChange={(event) => onChange(event,'penanggung_jawab')} 
                                    />
                                </div>
                            </div>

                            <div className="gnrm-navigation-button">
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
                                        <button className="simpan-gnrm" onClick={onEdit}>SIMPAN PERUBAHAN</button>
                                    :
                                        <button className="simpan-gnrm" onClick={onSubmit}>SIMPAN PERUBAHAN</button>
                                }
                                
                                <button className="preview-gnrm" onClick={setPreview}>PREVIEW LAPORAN</button>

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
                                
                                <h1 style={{lineHeight:'15px'}}>Dilarang menyalin, menyimpan, memperbanyakan sebagian atau seluruh isi laporan ini dalam bentuk <br/> apapun kecuali oleh Koordinator Pelaksana Gerakan (KPG) dan Sekretariat Revolusi Mental</h1><br/>

                                <h1 style={{lineHeight:'35px', fontWeight:'bold'}}>
                                    PROGRAM PELAKSANAAN GNRM 
                                    <span style={{color:'#D33732'}}> {data.tahun}</span>
                                </h1>
                                
                                <h1 style={{lineHeight:'15px'}}> 
                                    ID Laporan : 
                                    <span style={{color:'#D33732'}}> {data.id_program}</span>
                                </h1>

                                <h1 style={{lineHeight:'15px'}}> 
                                    Program 
                                    <span style={{color:'#D33732'}}> {documentDetail && documentDetail.instansi} </span> 
                                    GNRM TAHUN 
                                    <span style={{color:'#D33732'}}> {data.tahun}</span>
                                </h1>
                            </div>
                        </div>

                            <div className="preview-body" style={{margin:'20px auto 0', width:'1042px', fontSize:'12px', lineHeight:'16px'}}>
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
                                            <td style={{paddingTop:'12px', paddingBottom:'32px'}}>{documentDetail && documentDetail.instansi}</td> 
                                       </tr>
                                       <tr style={{fontWeight:'bold'}}>
                                            <td>2.</td>
                                            <td>Kegiatan</td> 
                                       </tr>
                                       <tr>
                                            <td></td>
                                            <td style={{paddingTop:'12px', paddingBottom:'32px'}}>
                                                {data.kegiatan.penjelasan_kegiatan}
                                            </td> 
                                       </tr>
                                       <tr style={{fontWeight:'bold'}}>
                                            <td>3.</td>
                                            <td>Output</td> 
                                       </tr>
                                       <tr>
                                            <td></td>
                                            <td style={{paddingTop:'12px', paddingBottom:'32px'}}>
                                                {data.output.indikator_capaian} <br/>
                                                {data.output.sasaran} <br/>
                                                {data.output.target}
                                            </td> 
                                       </tr>
                                       <tr style={{fontWeight:'bold'}}>
                                            <td>4.</td>
                                            <td>Kondisi Awal</td> 
                                       </tr>
                                       <tr>
                                            <td></td>
                                            <td style={{paddingTop:'12px', paddingBottom:'32px'}}>
                                            {data.kondisi_awal}
                                            </td> 
                                       </tr>
                                       <tr style={{fontWeight:'bold'}}>
                                            <td>5.</td>
                                            <td>Anggaran</td> 
                                       </tr>
                                       <tr>
                                            <td></td>
                                            <td style={{paddingTop:'12px', paddingBottom:'32px'}}>
                                            {data.anggaran.besar_anggaran}
                                            </td> 
                                       </tr>
                                       <tr style={{fontWeight:'bold'}}>
                                            <td>6.</td>
                                            <td>Proses Perkembangan Pelaksaan Kegiatan</td> 
                                       </tr>
                                       <tr>
                                            <td></td>
                                            <td style={{paddingTop:'12px', paddingBottom:'32px'}}>
                                            {data.proses}
                                            </td> 
                                       </tr>
                                       <tr style={{fontWeight:'bold'}}>
                                            <td>7.</td>
                                            <td>Pihak Terkait</td> 
                                       </tr>
                                       {
                                           documentDetail ? 
                                            (documentDetail && documentDetail.form.pihak_terkait).map((pihak,index) => {
                                               return(
                                                    <tr key={index}>
                                                        <td></td>
                                                        <td style={{paddingTop:'12px', paddingBottom:'32px'}}>
                                                            {data.pihak_terkait[index] && data.pihak_terkait[index].lembaga} , {data.pihak_terkait[index] && data.pihak_terkait[index].penjelasan_pihak_terkait} , {data.pihak_terkait[index] && data.pihak_terkait[index].peran}
                                                        </td> 
                                                    </tr>
                                               )
                                            })
                                            :
                                            ''
                                       }
                                       <tr style={{fontWeight:'bold'}}>
                                            <td>8.</td>
                                            <td>Lampiran Media</td> 
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
                                            Demikian program ini dibuat dan dapat dikoordinasikan untuk dilaksanakan sebagaimana mestinya. <br/>
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

export default FormGNRM;