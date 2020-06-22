import React,{Fragment,useState,useContext,useEffect} from 'react';
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
import plus2 from '../../assets/plus2.png'

const FormGNRM = (props) => {
    const { documentDetail, getDocumentDetail, resetDocument, isEditing, editDocumentFalse, isPreviewing, preview } = useContext(ArtikelContext)
    const {userDetail} = useContext(AuthContext)
    
    const Link = Scroll.Link;
    console.log(documentDetail)
    const { token } = useContext(AuthContext)
    const history = useHistory()
    const [ panjang, setPanjang] = useState('0')
    const id = props.match.params.id 
    const type = 'gnrm'

    const [data, setData] = useState({
        tahun: '',
        id_program: '',
        instansi:'',
        kp: '',
        prop: '',
        gerakan: '',
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
        deleted_media: [],
        deleted_proses: [],
        deleted_kondisi: []
    })
    
    const pilihanTahun = ['2020','2021','2022','2023']
    const {
        tahun,
        id_program,
        instansi,
        kp,
        prop,
        gerakan,
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

    const [media, setMedia] = useState([])
    const [mediaUrl, setMediaUrl] = useState([])

    const [lampiranProses, setLampiranProses] = useState([])
    const [lampiranProsesUrl, setLampiranProsesUrl] = useState([])
    
    const [lampiranKondisi, setLampiranKondisi] = useState([])
    const [lampiranKondisiUrl, setLampiranKondisiUrl] = useState([])
    
    const [form, setForm] = useState([])
    const [proyek, setProyek] = useState([])
    const [kpOptions, setKpOptions] = useState([])
    const [propOptions, setPropOptions] = useState([])
    const [gerakanOptions, setGerakanOptions] = useState([])
    const [selectedKp, setSelectedKp] = useState(false)
    const [deletedMedia, setDeletedMedia] = useState([])
    const [deletedLampiranProses, setDeletedLampiranProses] = useState([])
    const [deletedLampiranKondisi, setDeletedLampiranKondisi] = useState([])
    
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
        event.target.value = null
    }

    const onChangeFilesProses = (event) => {
        setLampiranProses([...lampiranProses , ...event.target.files])
        event.target.value = null
    }

    const onChangeFilesKondisi = (event) => {
        setLampiranKondisi([...lampiranKondisi , ...event.target.files])
        event.target.value = null
    }

    const onChange = (event, property, array = false, index) => {
        if (event.target.name === 'kp') setSelectedKp(event.target.value)
        
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
        else 
            setData({ ...data, [event.target.name]: event.target.value })    
    }
    
    const onSubmit = async (event) => {
		event.preventDefault()

		const formData = objectToFormData(data)

		for (let i = 0; i < media.length; i++) {
			formData.append(`media`, media[i])
        }
        for (let i = 0; i < lampiranProses.length; i++) {
            formData.append(`lampiran_proses`, lampiranProses[i])
        }
        for (let i = 0; i < lampiranKondisi.length; i++) {
			formData.append(`lampiran_kondisi_awal`, lampiranKondisi[i])
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
        history.push(`/${userDetail&&userDetail.role === 'owner' ? 'super-admin' : 'admin'}/rencana-pelaksanaan-program`)
        alert(res.data.message)
        resetDocument()
	}
    
    const lebar = window.screen.width
    console.log(lebar)
    
    const onEdit = async (event) => {
        event.preventDefault()

		const formData = objectToFormData(data)

        if (lampiranProses.length > 0) {
            for (let i = 0; i < lampiranProses.length; i++) {
                formData.append(`lampiran_proses`, lampiranProses[i])
            }
        }  else {formData.append('lampiran_proses', new File([null], 'blob'))}

        if (media.length > 0) {
            for (let i = 0; i < media.length; i++) {
                formData.append(`media`, media[i])
            }
        }  else {formData.append('media', new File([null], 'blob'))}

        if (lampiranKondisi.length > 0) {
            for (let i = 0; i < lampiranKondisi.length; i++) {
                formData.append(`lampiran_kondisi_awal`, lampiranKondisi[i])
            }
        }  else {formData.append('lampiran_kondisi_awal', new File([null], 'blob'))}

		for (let pair of formData.entries()) {
			console.log(pair[0] + ', ' + pair[1])
		}

		const config = {
			headers: {
                'Content-Type': 'multipart/form-data',
				'X-Auth-Token': `aweuaweu ${token}`,
			},
		}

		const res = await axios.put(`https://test.bariqmbani.me/api/v1/document/${props.match.params.id}?type=gnrm`,formData,config)
        history.push(`/${userDetail&&userDetail.role === 'owner' ? 'super-admin' : 'admin'}/rencana-pelaksanaan-program`)
        alert(res.data.message)
        resetDocument()
        editDocumentFalse()
    }
    
    useEffect(() => {
        (async () => {
            const proyekData = await axios.get('https://test.bariqmbani.me/api/v1/proyek')

            const { proyek, gerakan } = proyekData.data
            
            setProyek(proyek)
            setGerakanOptions(gerakan)
            setKpOptions((proyek.map(proyek => proyek.kp)))
        })()

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

    useEffect(() => {
        const getProp = (kp) => {
            let kpIndex
            proyek.forEach((proyek, index) => {
                if (proyek.kp === kp) kpIndex = index
            })
            return proyek[kpIndex].prop
        }

        if(selectedKp) setPropOptions(getProp(selectedKp))

    }, [selectedKp])
    
    
    const getFileName = (url) => {
        const split = url.split('/')
        return split[split.length - 1]
    }

    useEffect(() => {
        if (documentDetail) {
            setData(documentDetail && documentDetail.form)
            setMedia(documentDetail.form.lampiran.media)
            setLampiranKondisi(documentDetail.form.lampiran.kondisi_awal)
            setLampiranProses(documentDetail.form.lampiran.proses)
            setPanjang(documentDetail && documentDetail.form.pihak_terkait.length)
            setSelectedKp(documentDetail.form.kp)

            const mediaFileUrl = documentDetail.form.lampiran.media.map(media => `https://test.bariqmbani.me${media.path}`)
            const files = []
            mediaFileUrl.forEach(url => {
                fetch(url).then(res => res.blob()).then(blob => {
                    const objectURL = URL.createObjectURL(blob)
                    blob.name = getFileName(url)
                    files.push(blob)
                })
            })

            const mediaFileUrl2 = documentDetail.form.lampiran.kondisi_awal.map(kondisi_awal => `https://test.bariqmbani.me${kondisi_awal.path}`)
            const files2 = []
            mediaFileUrl2.forEach(url => {
                fetch(url).then(res => res.blob()).then(blob => {
                    const objectURL = URL.createObjectURL(blob)
                    blob.name = getFileName(url)
                    files2.push(blob)
                })
            })

            const mediaFileUrl3 = documentDetail.form.lampiran.proses.map(proses => `https://test.bariqmbani.me${proses.path}`)
            const files3 = []
            mediaFileUrl3.forEach(url => {
                fetch(url).then(res => res.blob()).then(blob => {
                    const objectURL = URL.createObjectURL(blob)
                    blob.name = getFileName(url)
                    files3.push(blob)
                })
            })

            setMedia(files)
            setLampiranKondisi(files2)
            setLampiranProses(files3)         
            setMediaUrl(mediaFileUrl)
            setLampiranKondisiUrl(mediaFileUrl2)
            setLampiranProsesUrl(mediaFileUrl3)
            
            return (() => {
                if (isEditing) resetDocument()
                editDocumentFalse()
            })
            
        }
    },[documentDetail])
    
    const onDeleteMedia = (isFile, filename, data) => {
        setMediaUrl(mediaUrl.filter(media => getFileName(media) !== filename))
        if (isFile) setMedia(media.filter(media => media !== data))
        else setMedia(media.filter(media => media.name !== filename))
        const deleted = [...deletedMedia, filename]
        setDeletedMedia(deleted)
    }

    const onDeleteProses = (isFile, filename, data) => {
        setLampiranProsesUrl(lampiranProsesUrl.filter(media => getFileName(media) !== filename))
        if (isFile) setLampiranProses(lampiranProses.filter(media => media !== data))
        else setLampiranProses(lampiranProses.filter(media => media.name !== filename))
        const deleted = [...deletedLampiranProses, filename]
        setDeletedLampiranProses(deleted)
    }

    const onDeleteKondisi = (isFile, filename, data) => {
        setLampiranKondisiUrl(lampiranKondisiUrl.filter(media => getFileName(media) !== filename))
        if (isFile) setLampiranKondisi(lampiranKondisi.filter(media => media !== data))
        else setLampiranKondisi(lampiranKondisi.filter(media => media.name !== filename))
        const deleted = [...deletedLampiranKondisi, filename]
        setDeletedLampiranKondisi(deleted)
    }

    useEffect(() => {
        setData({ ...data, deleted_media: deletedMedia, deleted_kondisi: deletedLampiranKondisi, deleted_proses: deletedLampiranProses })
    }, [deletedMedia,deletedLampiranKondisi,deletedLampiranProses])


    console.log(documentDetail && documentDetail.form.tahun)

    return(
      <Fragment>
          <SideBarOff/>
            <div className="background-after-login"/>
          <Popup notif={props.notif}/>
            {/* -------------------------- FORM SECTION START HERE ---------------------------------*/}
            <div className={isPreviewing ? 'd-none': "form"}>
                <div className="tajuk-page">
                <h1> FORM RENCANA PELAKSANAAN PROGRAM</h1>
                </div>

                <form style={{width:'fit-content' , height:'fit-content' , margin:'auto'}}>
                    <Element id='identitas' name='identitas'>
                        <div className="gnrm-container">
                            <div className="form-gnrm">
                                <div>
                                    <label>Tahun</label>
                                    {
                                        documentDetail && documentDetail.form.tahun ?
                                        <select 
                                            onChange={(event) => onChange(event)}  
                                            className="gnrm-tahun"
                                            name="tahun"
                                        >
                                            
                                            {
                                                pilihanTahun.map((tahun, i) => <option key={i} selected={documentDetail.form.tahun === tahun && true} title={tahun} value={tahun}>{tahun}</option>)
                                            }
                                            
                                        </select> :
                                        <select 
                                            onChange={(event) => onChange(event)} 
                                            className="gnrm-tahun"
                                            name="tahun"
                                        >
                                            <option selected={true} hidden></option>
                                            {
                                                pilihanTahun.map((tahun, i) => <option key={i} title={tahun} value={tahun}>{tahun}</option>)
                                            }
                                        </select>
                                    }
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
                                    to="kegiatan"
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    offset={-30}
                                >
                                <button className="forward tes"><i className="material-icons">expand_more</i></button>
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
                                    <label>Kegiatan Prioritas</label>
                                    {
                                        documentDetail && documentDetail.form.kp ?
                                        <select 
                                            onChange={onChange} 
                                            class="gnrm-select"
                                            name="kp"
                                            style={{marginLeft: '71px', width:'955px' , height: '42px'}}
                                        >
                                            {
                                                kpOptions.map((kp, i) => <option key={i} selected={documentDetail.form.kp === kp && true} title={kp} value={kp}>{kp.length > 113 ? `${kp.substr(0, 110)}...` : kp}</option>)
                                            }
                                        </select> :
                                        <select 
                                            onChange={onChange} 
                                            class="gnrm-select"
                                            name="kp"
                                            style={{marginLeft: '71px', width:'955px' , height: '42px' }}
                                        >
                                            <option selected={true} hidden></option>
                                            {
                                                kpOptions.map((kp, i) => <option key={i} title={kp} value={kp}>{kp.length > 113 ? `${kp.substr(0, 110)}...` : kp}</option>)
                                            }
                                        </select>
                                    }
                                </div>
                                <div>
                                    <label>Proyek Prioritas</label>
                                    {
                                        documentDetail && selectedKp && propOptions ?
                                        <select 
                                            onChange={onChange} 
                                            class="gnrm-select selectpicker"
                                            name="prop"
                                            style={{marginLeft: '84px'}}
                                        >
                                            {
                                                propOptions.map((prop, i) => <option key={i} selected={documentDetail.form.prop === prop && true} title={prop} value={prop}>{prop.length > 116 ? `${prop.substr(0, 113)}...` : prop}</option>)
                                            }
                                            {!selectedKp && <option>{'Pilih Kegiatan Prioritas\n\nterlebih dahulu'}</option>}
                                        </select> :
                                        <select 
                                            onChange={onChange} 
                                            class="gnrm-select selectpicker"
                                            name="prop"
                                            style={{marginLeft: '83px'}}
                                        >
                                            <option selected={true} hidden></option>
                                            {
                                                propOptions.map((prop, i) => <option key={i} title={prop} value={prop}>{prop.length > 116 ? `${prop.substr(0, 113)}...` : prop}</option>)
                                            }
                                            {!selectedKp && <option>{'Pilih Kegiatan Prioritas\n\nterlebih dahulu'}</option>}
                                        </select>
                                    }
                                </div>
                                
                                {
                                    selectedKp === 'Penguatan pusat-pusat perubahan gerakan revolusi mental' &&
                                    <div>
                                        <label>Gerakan</label>
                                        {
                                            documentDetail ?
                                            <select 
                                                onChange={onChange} 
                                                class="gnrm-select"
                                                name="gerakan"
                                                style={{marginLeft: '145px'}}
                                            >
                                                {
                                                    gerakanOptions.map((gerakan, i) => <option key={i} selected={documentDetail.form.gerakan === gerakan ? true : false} value={gerakan}>{gerakan}</option>)
                                                }
                                            </select> :
                                            <select 
                                                onChange={onChange} 
                                                class="gnrm-select"
                                                name="gerakan"
                                                style={{marginLeft: '145px'}}
                                            >
                                                <option selected={true} hidden></option>
                                                {
                                                    gerakanOptions.map((gerakan, i) => <option key={i} value={gerakan}>{gerakan}</option>)
                                                }
                                            </select>
                                        }
                                    </div>
                                }
                                {/* <div>
                                    <label>Kegiatan Prioritas</label>
                                    <select className="admin-role" style={{height: "42px", 
                                                marginLeft: "93px", 
                                                width: "955px"}} name="kp" onChange={(event) => onChange(event)}>
                                        <option value="" defaultValue="" hidden></option>
                                        {
                                            datas.kegiatan_prioritas.map((kegiatan,index) => {
                                                return(
                                                    <option key={index} value={kegiatan.nama_kegiatan}>{kegiatan.nama_kegiatan}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label>Program Prioritas</label>
                                    <select className="admin-role" style={{height: "42px", 
                                                marginLeft: "93px", 
                                                width: "955px"}} name="prop" onChange={(event) => onChange(event)}>
                                        <option value="" defaultValue="" hidden></option>
                                        {
                                            datas.kegiatan_prioritas[0].program_prioritas.map((kegiatan,index) => {
                                                return(
                                                    <option key={index} value={kegiatan}>{kegiatan}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div> */}
                                <div>
                                    <label style={{textAlign:'right', clear:'both' , float:'left'}}>Penjelasan</label>
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
                                    <label style={{textAlign:'right', clear:'both' , float:'left'}}>Indikator Capaian</label>
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
                                    <label style={{textAlign:'right', clear:'both' , float:'left'}}>Sasaran</label>
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
                                    <label style={{textAlign:'right', clear:'both' , float:'left'}}>Target</label>
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
                                    <label style={{textAlign:'right', clear:'both' , float:'left'}}>Penjelasan</label>
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
                                <div>
                                    <label>Lampiran Media</label>
                                    <label htmlFor='testing2' className='label_lampiran'><span style={{marginRight:'15px'}}>+</span> PILIH BERKAS</label>
                                    <input 
                                        id="testing2"
                                        className="gnrm-penjelasan" 
                                        style={{height: "42px", 
                                                marginLeft: "28px", 
                                                width: "955px"}} 
                                        onChange={onChangeFilesKondisi}
                                        type="file"
                                        accept="image/*"
                                        name="media"
                                        multiple
                                    />
                                </div>
                                <div>
                                    {
                                        lampiranKondisi && lampiranKondisi.length > 0 ? (
                                            <div style={{height: "fit-content", 
                                                marginLeft: "208px", 
                                                width: "955px",
                                                border: '1px solid #ACACAC',
                                                borderRadius: '5px',
                                                padding: '10px',
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                            }} 
                                            >
                                                {
                                                    lampiranKondisi.map((lampiran,index) => {
                                                        const objectURL = URL.createObjectURL(lampiran)
                                                        return(
                                                            <div key={index}>
                                                                    <div style={{width:'150px', 
                                                                                height:'150px', 
                                                                                backgroundColor:'pink', 
                                                                                marginRight:'35px', 
                                                                                position:'relative'
                                                                                }}
                                                                        className="d-flex align-items-center justify-content-center"
                                                                    >
                                                                        <div style={{width:'150px', height:'150px', overflow:'hidden', position:'absolute'}}>
                                                                            <img src={objectURL} alt={lampiran.name} className="gnrm-media--image"/>
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
                                                                        onClick={(e) => onDeleteKondisi(true, lampiran.name, lampiran)}> X </div>
                                                                    </div>
                                                                    <div style={{marginTop:'10px' , 
                                                                                width:'150px' , 
                                                                                height:'20px', 
                                                                                wordWrap: 'break-word',
                                                                                lineHeight:'20px',}}
                                                                    >
                                                                        <p className="gnrm-media--name">
                                                                            {lampiran.name.length > 18 ? `${lampiran.name.substr(0, 15)}...` : lampiran.name}
                                                                        </p>
                                                                    </div>
                                                                
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        ) : (
                                            <div style={{height: "fit-content", 
                                                marginLeft: "208px", 
                                                width: "955px",
                                                border: '1px solid #ACACAC',
                                                borderRadius: '5px',
                                                padding: '10px',
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                            }} 
                                            >
                                                {
                                                    lampiranKondisiUrl.map((url,index) => {
                                                        return(
                                                            <div key={index}>
                                                                    <div style={{width:'150px', 
                                                                                height:'150px', 
                                                                                backgroundColor:'pink', 
                                                                                marginRight:'35px', 
                                                                                position:'relative'}}
                                                                        className="d-flex align-items-center justify-content-center"
                                                                    >
                                                                        <div style={{width:'150px', height:'150px', overflow:'hidden', position:'absolute'}}>
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
                                                                                    cursor:'pointer'}}
                                                                        onClick={(e) => onDeleteKondisi(false, getFileName(url))}> X </div>
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
                                    <label style={{textAlign:'left', clear:'both' , float:'left'}}>Mekanisme Pelaksanaan <br/>Kegiatan</label>
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
                                <div>
                                    <label>Lampiran Media</label>
                                    <label htmlFor='testing3' className='label_lampiran'><span style={{marginRight:'15px'}}>+</span> PILIH BERKAS</label>
                                    <input 
                                        id="testing3"
                                        className="gnrm-penjelasan" 
                                        style={{height: "42px", 
                                                marginLeft: "28px", 
                                                width: "955px"}} 
                                        onChange={onChangeFilesProses}
                                        type="file"
                                        accept="image/*"
                                        name="media"
                                        multiple
                                    />
                                </div>
                                <div>
                                    {
                                        lampiranProses && lampiranProses.length > 0 ? (
                                            <div style={{height: "fit-content", 
                                                marginLeft: "208px", 
                                                width: "955px",
                                                border: '1px solid #ACACAC',
                                                borderRadius: '5px',
                                                padding: '10px',
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                            }} 
                                            >
                                                {
                                                    lampiranProses.map((lampiran,index) => {
                                                        const objectURL = URL.createObjectURL(lampiran)
                                                        return(
                                                            <div key={index}>
                                                                    <div style={{width:'150px', 
                                                                                height:'150px', 
                                                                                backgroundColor:'pink', 
                                                                                marginRight:'35px', 
                                                                                position:'relative'
                                                                                }}
                                                                        className="d-flex align-items-center justify-content-center"
                                                                    >
                                                                        <div style={{width:'150px', height:'150px', overflow:'hidden', position:'absolute'}}>
                                                                            <img src={objectURL} alt={lampiran.name} className="gnrm-media--image"/>
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
                                                                        onClick={(e) => onDeleteProses(true, lampiran.name, lampiran)}> X </div>
                                                                    </div>
                                                                    <div style={{marginTop:'10px' , 
                                                                                width:'150px' , 
                                                                                height:'20px', 
                                                                                wordWrap: 'break-word',
                                                                                lineHeight:'20px',}}
                                                                    >
                                                                        <p className="gnrm-media--name">
                                                                            {lampiran.name.length > 18 ? `${lampiran.name.substr(0, 15)}...` : lampiran.name}
                                                                        </p>
                                                                    </div>
                                                                
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        ) : (
                                            <div style={{height: "fit-content", 
                                                marginLeft: "208px", 
                                                width: "955px",
                                                border: '1px solid #ACACAC',
                                                borderRadius: '5px',
                                                padding: '10px',
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                            }} 
                                            >
                                                {
                                                    lampiranProsesUrl.map((url,index) => {
                                                        return(
                                                            <div key={index}>
                                                                    <div style={{width:'150px', 
                                                                                height:'150px', 
                                                                                backgroundColor:'pink', 
                                                                                marginRight:'35px', 
                                                                                position:'relative'}}
                                                                        className="d-flex align-items-center justify-content-center"
                                                                    >
                                                                        <div style={{width:'150px', height:'150px', overflow:'hidden', position:'absolute'}}>
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
                                                                                    cursor:'pointer'}}
                                                                        onClick={(e) => onDeleteProses(false, getFileName(url))}> X </div>
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
                                            <label style={{textAlign:'right', clear:'both' , float:'left'}}>Penjelasan</label>
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
                                                    <label style={{textAlign:'right', clear:'both' , float:'left'}}>Penjelasan</label>
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
                                                    <label style={{textAlign:'right', clear:'both' , float:'left'}}>Penjelasan</label>
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
                                    <img src={plus2} style={{position:'absolute' , marginTop:'-3px' , marginLeft:'20px',cursor:'pointer'}} onClick={addForm}/>
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
                                    <label htmlFor='testing' className='label_lampiran'><span style={{marginRight:'15px'}}>+</span> PILIH BERKAS</label>
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
                                    {
                                        media && media.length > 0 ? (
                                            <div style={{height: "fit-content", 
                                                marginLeft: "208px", 
                                                width: "955px",
                                                border: '1px solid #ACACAC',
                                                borderRadius: '5px',
                                                padding: '10px',
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                            }} 
                                            >
                                                {
                                                    media.map((media,index) => {
                                                        const objectURL = URL.createObjectURL(media)
                                                        return(
                                                            <div key={index}>
                                                                    <div style={{width:'150px', 
                                                                                height:'150px', 
                                                                                backgroundColor:'pink', 
                                                                                marginRight:'35px', 
                                                                                position:'relative'
                                                                                }}
                                                                        className="d-flex align-items-center justify-content-center"
                                                                    >
                                                                        <div style={{width:'150px', height:'150px', overflow:'hidden', position:'absolute'}}>
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
                                            <div style={{height: "fit-content", 
                                                marginLeft: "208px", 
                                                width: "955px",
                                                border: '1px solid #ACACAC',
                                                borderRadius: '5px',
                                                padding: '10px',
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                            }} 
                                            >
                                                {
                                                    mediaUrl.map((url,index) => {
                                                        return(
                                                            <div key={index}>
                                                                    <div style={{width:'150px', 
                                                                                height:'150px', 
                                                                                backgroundColor:'pink', 
                                                                                marginRight:'35px', 
                                                                                position:'relative'}}
                                                                        className="d-flex align-items-center justify-content-center"
                                                                    >
                                                                        <div style={{width:'150px', height:'150px', overflow:'hidden', position:'absolute'}}>
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
                                                                                    cursor:'pointer'}}
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
            <div className={isPreviewing ? "preview-page" : "d-none"} style={{width:'fit-content' , height:'fit-content' , margin:'auto'}}>
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
                                    <span> {data.tahun}</span>
                                </h1>
                                
                                <h1 style={{lineHeight:'15px'}}>Dilarang menyalin, menyimpan, memperbanyak sebagian atau seluruh isi laporan ini dalam bentuk <br/> apapun kecuali oleh Koordinator Pelaksana Gerakan (KPG) dan Sekretariat Revolusi Mental</h1><br/>

                                <h1 style={{lineHeight:'35px', fontWeight:'bold'}}>
                                    PROGRAM PELAKSANAAN GNRM 
                                    <span > {data.tahun}</span>
                                </h1>
                                
                                <h1 style={{lineHeight:'15px'}}> 
                                    ID Laporan : 
                                    <span > {data.id_program}</span>
                                </h1>

                                <h1 style={{lineHeight:'15px'}}> 
                                    Program 
                                    <span > {documentDetail && documentDetail.instansi} </span> 
                                    GNRM TAHUN 
                                    <span > {data.tahun}</span>
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
                                        <h1>NIP. {data.penanggung_jawab.nip}</h1>
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