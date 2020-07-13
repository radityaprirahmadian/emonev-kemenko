import React, { Fragment, useState, useContext, useEffect } from 'react';
import './FormGNRM.css';
import logo_kemenko from '../../assets/logo_kemenko.png'
import images from '../../assets/image.png'
import logo_footer from '../../assets/logo_footer.png'
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios'
import objectToFormData from '../../objectToFormDataUtil'
import imgFile from '../../assets/file.png'
import { AuthContext } from '../../context/Auth/AuthContext'
import { ArtikelContext } from '../../context/Artikel/artikelContext';
import Scroll, { Element } from 'react-scroll'
import Popup from '../../component/Popup/Popup';
import plus2 from '../../assets/plus2.png'
import Spinner from '../../component/Spinner/Spinner'
import bg_1 from '../../assets/decoration/bg_1.png'
import bg_2 from '../../assets/decoration/bg_2.png'
import bg_3 from '../../assets/decoration/bg_3.png'
import bg_4 from '../../assets/decoration/bg_4.png'
import {LayoutContext} from '../../context/Layout/LayoutContext'

const FormGNRM = (props) => {
    const { documentDetail, getDocumentDetail, resetDocument, user, isEditing, instansiDocumentDetail, editDocumentFalse, editDocument, isPreviewing, preview, setLoadingTrue, setLoadingFalse, loading } = useContext(ArtikelContext)
    const { userDetail, token } = useContext(AuthContext)
    const { sidebar } = useContext(LayoutContext)
    const Link = Scroll.Link;
    console.log(documentDetail)
    const history = useHistory()
    const [panjang, setPanjang] = useState('0')
    const id = props.match.params.id
    const type = 'gnrm'

    const [instansiDetail, setInstansiDetail] = useState({})
    console.log(instansiDocumentDetail)
    console.log(instansiDetail)

    const [data, setData] = useState({
        tahun: '',
        id_program: '',
        instansi: '',
        kp: '',
        prop: '',
        gerakan: '',
        sk_status: '',
        sk_no: '',
        sk_kendala: '',
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

    const pilihanTahun = [];
    const todaysYear = new Date().getFullYear();
    for (let year = todaysYear; year >= 2020; year--) {
        pilihanTahun.push(year);
    }

    const pilihanPeriode = ['Tahunan', 'Caturwulan']
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
    const [formGerakan, setFormGerakan] = useState([])
    const [proyek, setProyek] = useState([])
    const [kpOptions, setKpOptions] = useState([])
    const [propOptions, setPropOptions] = useState([])
    const [gerakanOptions, setGerakanOptions] = useState([])
    const [selectedKp, setSelectedKp] = useState(false)
    const [selectedGerakan, setSelectedGerakan] = useState({})
    const [deletedMedia, setDeletedMedia] = useState([])
    const [deletedLampiranProses, setDeletedLampiranProses] = useState([])
    const [deletedLampiranKondisi, setDeletedLampiranKondisi] = useState([])

    const nol = (i) => {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    const mydate = new Date(Date.now());
    const hour = nol(mydate.getHours());
    const minute = nol(mydate.getMinutes());
    const date = mydate.getDate();
    let month = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][mydate.getMonth()];
    let str = hour + ':' + minute + ' WIB, ' + date + ' ' + month + ' ' + mydate.getFullYear();

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

    const addFormGerakan = (e) => {
        e.preventDefault()
        if (formGerakan.length < 4) {
            let forms = formGerakan.concat([''])
            setFormGerakan(
                forms
            )
            documentDetail && setSelectedGerakan({ ...selectedGerakan, [`gerakan-${forms.length}`]: '' })
        }
    }

    useEffect(() => {
        setData({ ...data, gerakan: Object.values(selectedGerakan).join(',') })
    }, [selectedGerakan])

    const onChangeGerakan = (e) => {
        setSelectedGerakan({ ...selectedGerakan, [e.target.name]: e.target.value })
    }

    const onDeleteGerakanForm = (deleted) => {
        const deletedGerakan = Object.values(selectedGerakan).filter((deletedGerakan, index) => {
            if (index === deleted + 1) return deletedGerakan
        })
        const gerakanArray = Object.values(selectedGerakan).filter(selected => selected !== deletedGerakan[0])
        const gerakanObj = {}
        gerakanArray.forEach((gerakan, i) => {
            gerakanObj[`gerakan-${i}`] = gerakan
        })
        setSelectedGerakan(gerakanObj)
        let forms = formGerakan
        forms.pop()
        setFormGerakan(forms)
    }

    const [sk, setSk] = useState({
        sk_status: '',
        sk_no: '',
        sk_kendala: ''
    })

    const onChangeButton = (e) => {
        return setData({ ...data, sk_status: true})
    }

    const onChangeButtonFalse = (e) => {
        return setData({ ...data, sk_status: false, sk_no: '' })
    }

    const onChangeSK = (e) => {
        return setData({ ...data, [e.target.name]: e.target.value })
    }

    const [skFile, setSKFile] = useState([])
    console.log(skFile)
    const [skGambar, setSkGambar] = useState();
    const [skGambars, setSkGambars] = useState();

    const onChangeSKFile = (event) => {
        setSKFile([...event.target.files])
        event.target.value = null
    }


    const onChangeFiles = (event) => {
        setMedia([...media, ...event.target.files])
        event.target.value = null
    }

    const onChangeFilesProses = (event) => {
        setLampiranProses([...lampiranProses, ...event.target.files])
        event.target.value = null
    }

    const onChangeFilesKondisi = (event) => {
        setLampiranKondisi([...lampiranKondisi, ...event.target.files])
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

    const onSubmitSK = async (event) => {
        setLoadingTrue()

        const formData = objectToFormData(sk)

        if (skFile.length > 0) {
            for (let i = 0; i < skFile.length; i++) {
                formData.append(`sk`, skFile[i])
            }
        } else { formData.append('sk', new File([null], 'blob')) }

        for (let pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1])
        }

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-Auth-Token': `aweuaweu ${token}`,
            },
        }
        const res = await axios.put(`https://api.simonev.revolusimental.go.id/api/v1/instansi/${userDetail.instansi&&userDetail.instansi._id}`,formData,config,)
        history.push(`/${userDetail && userDetail.role === 'owner' ? 'super-admin' : 'admin'}/rencana-pelaksanaan-program`)
        setLoadingFalse()
    }

    const onSubmit = async (event) => {
        event.preventDefault()
        setLoadingTrue()
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
        for (let i = 0; i < skFile.length; i++) {
            formData.append(`sk`, skFile[i])
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

        const res = await axios.post('https://api.simonev.revolusimental.go.id/api/v1/document?type=gnrm', formData, config,)
        history.push(`/${userDetail && userDetail.role === 'owner' ? 'super-admin' : 'admin'}/rencana-pelaksanaan-program`)
        alert(res.data.message)
        resetDocument()
        setLoadingFalse()
    }

    const getFIleExtension = (filename) => {
        let ext = /^.+\.([^.]+)$/.exec(filename);
        return ext == null ? "" : ext[1];
    }

    const onEdit = async (event) => {
        event.preventDefault()
        setLoadingTrue()

        const formData = objectToFormData(data)

        if (lampiranProses.length > 0) {
            for (let i = 0; i < lampiranProses.length; i++) {
                formData.append(`lampiran_proses`, lampiranProses[i])
            }
        } else { formData.append('lampiran_proses', new File([null], 'blob')) }

        if (media.length > 0) {
            for (let i = 0; i < media.length; i++) {
                formData.append(`media`, media[i])
            }
        } else { formData.append('media', new File([null], 'blob')) }

        if (lampiranKondisi.length > 0) {
            for (let i = 0; i < lampiranKondisi.length; i++) {
                formData.append(`lampiran_kondisi_awal`, lampiranKondisi[i])
            }
        } else { formData.append('lampiran_kondisi_awal', new File([null], 'blob')) }

        if (skFile.length > 0) {
                formData.append(`sk`, skFile[0])
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

        try{
            const res = await axios.put(`https://api.simonev.revolusimental.go.id/api/v1/document/${props.match.params.id}?type=gnrm`, formData, config)
        history.push(`/${userDetail && userDetail.role === 'owner' ? 'super-admin' : 'admin'}/rencana-pelaksanaan-program`)
        alert(res.data.message)
        resetDocument()
        editDocumentFalse()

        }
        catch(err){
            alert(err.response.data.message)
        }
        setLoadingFalse()
    }

    useEffect(() => {
        (async () => {
            const proyekData = await axios.get('https://api.simonev.revolusimental.go.id/api/v1/proyek')

            const { proyek, gerakan } = proyekData.data

            setProyek(proyek)
            setGerakanOptions(gerakan)
            setKpOptions((proyek && proyek.map(proyek => proyek.kp)))
        })()
    }, [])
    

    useEffect(() =>{
        if (props.match.params.id) {
            resetDocument()
            editDocument()
            getDocumentDetail({ id, type })
            if (isPreviewing) {
                preview()
            }
        }
        else {
            editDocumentFalse()
        }
    }, [props.match.params.id])

    useEffect(() => {
        const getInstansiDetail = async () => {
            setLoadingTrue()
            const config = {
                headers: {
                    'X-Auth-Token': `aweuaweu ${token}`,
                }
            }
            try {
                if(props.match.params.id) {
                    const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/document/${props.match.params.id}?type=gnrm`,config)
                    setInstansiDetail(res.data.instansi)
                } else {
                    const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/instansi/${userDetail&&userDetail.instansi._id}`,config)
                    setInstansiDetail(res.data.instansi)
                }
            }
            catch (err) {
                console.log(err)
            }
            setLoadingFalse()
        }
        getInstansiDetail()
    }, [userDetail, props.match.params.id])

    const [ skExtension , setSkExtension] = useState('')
    const [ skFileUrl , setSkFileUrl] = useState([])
    console.log(skExtension)

    useEffect(() => {
        if (instansiDetail) {
            setData({
                ...data,
                sk_no: instansiDetail.sk && instansiDetail.sk.no,
                sk_status: instansiDetail.sk && instansiDetail.sk.status,
                sk_kendala: instansiDetail.sk && instansiDetail.sk.kendala
            })
    
            const gambar = `https://api.simonev.revolusimental.go.id${instansiDetail.sk&&instansiDetail.sk.foto}`
            const fileExt = getFIleExtension(gambar)
            setSkGambar(gambar)
            setSkExtension(fileExt)
        }

        if(instansiDetail.sk&&instansiDetail.sk.foto) {
            const mediaFileUrl = [`https://api.simonev.revolusimental.go.id${instansiDetail.sk&&instansiDetail.sk.foto}`]
            const files = []
            mediaFileUrl.forEach(url => {
                fetch(url).then(res => res.blob()).then(blob => {
                    const objectURL = URL.createObjectURL(blob)
                    blob.name = getFileName(url)
                    files.push(blob)
                })
            })

            // setSKFile(files)
            setSkFileUrl(mediaFileUrl)
        }

    }, [instansiDetail])

    useEffect(() => {
        const getProp = (kp) => {
            let kpIndex
            proyek && proyek.forEach((proyek, index) => {
                if (proyek.kp === kp) kpIndex = index
            })
            return proyek[kpIndex] && proyek[kpIndex].prop
        }

        if (selectedKp) setPropOptions(getProp(selectedKp))

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

            const gerakanArray = documentDetail.form.gerakan.split(',')
            const gerakanObj = {}

            gerakanArray.forEach((gerakan, i) => {
                gerakanObj[`gerakan-${i}`] = gerakan
            })

            setSelectedGerakan(gerakanObj)
            setFormGerakan(new Array(gerakanArray.length - 1))

            const mediaFileUrl = documentDetail&&documentDetail.form.lampiran.media.map(media => `https://api.simonev.revolusimental.go.id${media.path}`)
            const files = []
            mediaFileUrl.forEach(url => {
                fetch(url).then(res => res.blob()).then(blob => {
                    const objectURL = URL.createObjectURL(blob)
                    blob.name = getFileName(url)
                    files.push(blob)
                })
            })

            const mediaFileUrl2 = documentDetail&&documentDetail.form.lampiran.kondisi_awal.map(kondisi_awal => `https://api.simonev.revolusimental.go.id${kondisi_awal.path}`)
            const files2 = []
            mediaFileUrl2.forEach(url => {
                fetch(url).then(res => res.blob()).then(blob => {
                    const objectURL = URL.createObjectURL(blob)
                    blob.name = getFileName(url)
                    files2.push(blob)
                })
            })

            const mediaFileUrl3 = documentDetail&&documentDetail.form.lampiran.proses.map(proses => `https://api.simonev.revolusimental.go.id${proses.path}`)
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
        }
    }, [documentDetail])

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
    }, [deletedMedia, deletedLampiranKondisi, deletedLampiranProses])



    // const onChangeFilesSK = (e) => {
    //     setLampiranProses([...lampiranProses , ...event.target.files])
    //         event.target.value = null    
    // }

    return (
        <Fragment>
                <SideBarOff setId={props.setId}/>
            <div className="background-after-login">
                <img src={bg_1} alt='bg1' style={{ position: 'fixed', top: '0', left: '0' }} />
                <img src={bg_2} alt='bg2' style={{ position: 'fixed', top: '0', right: '0' }} />
                <img src={bg_3} alt='bg3' style={{ position: 'fixed', bottom: '-200px', left: '0' }} />
                <img src={bg_4} alt='bg4' style={{ position: 'fixed', bottom: '-50px', right: '0' }} />
            </div>
            <Popup notif={props.notif} />
            {/* -------------------------- FORM SECTION START HERE ---------------------------------*/}
            <div className={isPreviewing ? 'd-none' : "form"}>
                <div className="tajuk-page">
                    <h1> FORM RENCANA PELAKSANAAN PROGRAM</h1>
                </div>

                {
                    loading ?
                        <div style={{ marginLeft: '68px' }}>
                            <div className="d-flex justify-content-center align-items-center" style={{ width: '100%', height: '60vh', overflow: 'hidden' }}>
                                <Spinner />
                            </div>
                        </div>
                        :
                        <div style={sidebar ? {marginLeft:'188px' , transition: 'all 0.3s ease-in-out'} : {transition: 'all 0.3s ease-in-out'}}>
                        {
                            !sidebar ?
                                <form style={{ width: 'fit-content', height: 'fit-content', margin: 'auto' }} id='form-gnrm' onSubmit={isEditing ? onEdit : onSubmit}>
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
                                                    {
                                                        documentDetail && documentDetail.form.id_program ?
                                                            <select
                                                                onChange={(event) => onChange(event)}
                                                                className="monev-id-program"
                                                                name="id_program"
                                                                style={{ marginLeft: '124px' }}
                                                            >

                                                                {
                                                                    pilihanPeriode.map((periode, i) => <option key={i} selected={documentDetail.form.id_program === periode && true} title={periode} value={periode}>{periode}</option>)
                                                                }

                                                            </select> :
                                                            <select
                                                                onChange={(event) => onChange(event)}
                                                                className="monev-id-laporan"
                                                                name="id_program"
                                                                style={{ marginLeft: '124px' }}
                                                            >
                                                                <option selected={true} hidden></option>
                                                                {
                                                                    pilihanPeriode.map((periode, i) => <option key={i} title={periode} value={periode}>{periode}</option>)
                                                                }
                                                            </select>
                                                    }
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
                                                    to="gugus_tugas"
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

                                    <Element id='gugus_tugas' name='gugus_tugas'>
                                        <div className="gnrm-container" >
                                            <div className="gnrm-title">
                                                GUGUS TUGAS GNRM
                                    </div>
                                            <div className="form-gnrm">
                                                {
                                        isEditing ? 
                                            <Fragment>
                                                 <div>
                                                     <label style={{textAlign:'left', clear:'both' , float:'left'}}>Sudah Terbentuk <br/> Gugus Tugas?</label>
                                                     <div style={{marginLeft:'210px'}}>
                                                         {
                                                             data.sk_status ?
                                                             <Fragment>
                                                                 <label htmlFor="sudah" className='label-radio' style={{ marginRight: '65px' }}>Sudah
                                                                     <input type="radio" id="sudah" name="sk_status" className='input-radio' value={data.sk_status} checked={true} onChange={onChangeButton} />
                                                                     <span className='checked-radio'></span>
                                                                 </label>
                                                                 <label htmlFor="belum" className='label-radio'>Belum
                                                                     <input type="radio" id="belum" name="sk_status"  className='input-radio' value={data.sk_status} onChange={onChangeButtonFalse} />
                                                                     <span className='checked-radio'></span>
                                                                 </label>
                                                             </Fragment>
                                                             :
                                                             <Fragment>
                                                                 <label htmlFor="sudah" className='label-radio' style={{ marginRight: '65px' }}>Sudah
                                                                     <input type="radio" id="sudah" name="sk_status" className='input-radio' value={data.sk_status} onChange={onChangeButton} />
                                                                     <span className='checked-radio'></span>
                                                                 </label>
                                                                 <label htmlFor="belum" className='label-radio' >Belum
                                                                     <input type="radio" id="belum" name="sk_status"  className='input-radio'value={data.sk_status} checked={true} onChange={onChangeButtonFalse} />
                                                                     <span className='checked-radio'></span>
                                                                 </label>
                                                             </Fragment>
                                                         }
                                                     </div>
                                                 </div>
                                                     {
                                                         data.sk_status ?
                                                         <Fragment>
                                                             <div>
                                                                 <label>Input Nomor SK</label>
                                                                 <input
                                                                     className="gnrm-sasaran" 
                                                                     style={{height: "42px", 
                                                                             marginLeft: '84px',
                                                                             width: "955px",
                                                                             fontWeight:'700'
                                                                             }}
                                                                     type="text" 
                                                                     name="sk_no"
                                                                     value={data.sk_no}
                                                                     onChange={onChangeSK}
                                                                     required
                                                                 />
                                                             </div>
                                                             <div>
                                                                 <label>Lampiran SK</label>
                                                                 <label htmlFor='testing10' className='label_lampiran' style={{marginLeft: '110px'}}><span style={{marginRight:'15px'}}>+</span> PILIH BERKAS</label>
                                                                 <input 
                                                                     id="testing10"
                                                                     className="gnrm-penjelasan" 
                                                                     style={{height: "42px", 
                                                                             marginLeft: "30px", 
                                                                             width: "955px"}} 
                                                                     onChange={onChangeSKFile}
                                                                     type="file"
                                                                     accept="image/* , application/pdf"
                                                                     name="media"
                                                                 />
                                                             </div>
                                                                <div>
                                                                 {
                                                                                skFile && skFile.length > 0 ?
                                                                                        <div style={{height: "fit-content", 
                                                                                            marginLeft: "210px", 
                                                                                            width: "955px",
                                                                                            border: '1px solid #ACACAC',
                                                                                            borderRadius: '5px',
                                                                                            padding: '10px',
                                                                                            display: 'flex',
                                                                                            flexWrap: 'wrap',
                                                                                        }} 
                                                                                        >
                                                                                            {
                                                                                                skFile.map((lampiran,index) => {
                                                                                                    const fileExt = getFIleExtension(lampiran.name)
                                                                                                    const objectURL = URL.createObjectURL(lampiran)
                                                                                                    // cekEkstension(fileExt)
                                                                                                    return(
                                                                                                        <div key={index}>
                                                                                                                <div style={{width:'150px', 
                                                                                                                            height:'150px', 
                                                                                                                            marginRight:'35px', 
                                                                                                                            position:'relative'
                                                                                                                            }}
                                                                                                                    className="d-flex align-items-center justify-content-center"
                                                                                                                >
                                                                                                                    <div style={{width:'150px', height:'150px', overflow:'hidden', position:'absolute'}}>
                                                                                                                        {
                                                                                                                            fileExt === 'pdf' ? 
                                                                                                                                <img src={imgFile} alt={lampiran.name} style={{width:'150px' , height:'150px'}}className="gnrm-media--image" />
                                                                                                                            :
                                                                                                                                <img src={objectURL} alt={lampiran.name} className="gnrm-media--image" />
                                                                                                                        }
                                                                                                                    </div>
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
                                                                                    :
                                                                                    <div style={{height: "fit-content", 
                                                                                    marginLeft: "210px", 
                                                                                    width: "955px",
                                                                                    border: '1px solid #ACACAC',
                                                                                    borderRadius: '5px',
                                                                                    padding: '10px',
                                                                                    display: 'flex',
                                                                                    flexWrap: 'wrap',
                                                                                }} 
                                                                                >
                                                                                    {
                                                                                        
                                                                                                skFileUrl.map((url,index) => {
                                                                                                    const fileExt = getFIleExtension(getFileName(url))
                                                                                                    // cekEkstension(fileExt)
                                                                                                    return(
                                                                                                        <div key={index}>
                                                                                                                <div style={{width:'150px', 
                                                                                                                            height:'150px', 
                                                                                                                            marginRight:'35px', 
                                                                                                                            position:'relative'
                                                                                                                            }}
                                                                                                                    className="d-flex align-items-center justify-content-center"
                                                                                                                >
                                                                                                                    <div style={{width:'150px', height:'150px', overflow:'hidden', position:'absolute'}}>
                                                                                                                        {
                                                                                                                            fileExt === 'pdf'.toLowerCase() ? 
                                                                                                                                <img src={imgFile} alt={getFileName(url)} style={{width:'150px' , height:'150px'}}className="gnrm-media--image" />
                                                                                                                            :
                                                                                                                                <img src={url} alt={getFileName(url)} className="gnrm-media--image" />
                                                                                                                        }
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div style={{marginTop:'10px' , 
                                                                                                                            width:'150px' , 
                                                                                                                            height:'20px', 
                                                                                                                            wordWrap: 'break-word',
                                                                                                                            lineHeight:'20px',}}
                                                                                                                >
                                                                                                                    <p className="gnrm-media--name">
                                                                                                                        {getFileName(url).length > 18 ? `${getFileName(url).substr(0, 15)}...` : getFileName(url)}
                                                                                                                    </p>
                                                                                                                </div>
                                                                                                            
                                                                                                        </div>
                                                                                                    )
                                                                                                })
                                                                                            }
                                                                                    </div>
                                                                                    }
                                                                            </div>
                                                         </Fragment>
                                                         :
                                                         <div>
                                                             <label style={{textAlign:'right', clear:'both' , float:'left'}}>Kendala</label>
                                                             <textarea 
                                                                 className="gnrm-nama-program" 
                                                                 style={{height: "300px", 
                                                                         marginLeft: "140px", 
                                                                         width: "955px"}} 
                                                                 type="text" 
                                                                 name="sk_kendala"
                                                                 value={data.sk_kendala}
                                                                 onChange={onChangeSK}
                                                             />
                                                         </div>
                                                     }
                                                 </Fragment>
                                             :
                                                <Fragment>
                                                    {
                                                    instansiDetail.sk && instansiDetail.sk.status ? 
                                                        <Fragment>
                                                            <div>
                                                                <label style={{textAlign:'left', clear:'both' , float:'left'}}>Input Nomor SK</label>
                                                                <div
                                                                    className="gnrm-sasaran" 
                                                                    style={{height: "42px", 
                                                                            marginLeft: '230px',
                                                                            fontWeight:'700'
                                                                            }}
                                                                >{data.sk_no}</div>
                                                            </div>
                                                            <div>
                                                                <label style={{textAlign:'left', clear:'both' , float:'left'}}>Lampiran Berkas</label>
                                                                <div style={{width:'fit-content' , height: 'fit-content', marginLeft:'230px'}}>
                                                                    {
                                                                        skExtension === 'pdf' ? 
                                                                            ('')
                                                                        :
                                                                            <Fragment>
                                                                                <img src={skGambar} alt={getFileName(instansiDetail.sk && instansiDetail.sk.foto)} style={{ width: '500px', height: 'auto' }} /><br />
                                                                            </Fragment>
                                                                    }
                                                                    <div
                                                                        className="gnrm-sasaran" 
                                                                        style={{height: "42px", 
                                                                                width: "955px",
                                                                                fontWeight:'700'
                                                                                }}
                                                                    >{getFileName(instansiDetail.sk&&instansiDetail.sk.foto)}</div>
                                                                </div>
                                                            </div>
                                                        </Fragment>
                                                    :
                                                        <Fragment>
                                                            <div>
                                                                <label style={{textAlign:'left', clear:'both' , float:'left'}}>Sudah Terbentuk <br/> Gugus Tugas?</label>
                                                                <div style={{marginLeft:'210px'}}>
                                                                    {
                                                                        data.sk_status ?
                                                                        <Fragment>
                                                                            <label htmlFor="sudah" className='label-radio' style={{ marginRight: '65px' }}>Sudah
                                                                                <input type="radio" id="sudah" name="sk_status" className='input-radio' value={data.sk_status} checked={true} onChange={onChangeButton} />
                                                                                <span className='checked-radio'></span>
                                                                            </label>
                                                                            <label htmlFor="belum" className='label-radio'>Belum
                                                                                <input type="radio" id="belum" name="sk_status"  className='input-radio' value={data.sk_status} onChange={onChangeButtonFalse} />
                                                                                <span className='checked-radio'></span>
                                                                            </label>
                                                                        </Fragment>
                                                                        :
                                                                        <Fragment>
                                                                            <label htmlFor="sudah" className='label-radio' style={{ marginRight: '65px' }}>Sudah
                                                                                <input type="radio" id="sudah" name="sk_status" className='input-radio' value={data.sk_status} onChange={onChangeButton} />
                                                                                <span className='checked-radio'></span>
                                                                            </label>
                                                                            <label htmlFor="belum" className='label-radio' >Belum
                                                                                <input type="radio" id="belum" name="sk_status"  className='input-radio'value={data.sk_status} checked={true} onChange={onChangeButtonFalse} />
                                                                                <span className='checked-radio'></span>
                                                                            </label>
                                                                        </Fragment>
                                                                    }
                                                                </div>
                                                            </div>
                                                                {
                                                                    data.sk_status ?
                                                                    <Fragment>
                                                                        <div>
                                                                            <label>Input Nomor SK</label>
                                                                            <input
                                                                                className="gnrm-sasaran" 
                                                                                style={{height: "42px", 
                                                                                        marginLeft: '84px',
                                                                                        width: "955px",
                                                                                        fontWeight:'700'
                                                                                        }}
                                                                                type="text" 
                                                                                name="sk_no"
                                                                                value={data.sk_no}
                                                                                onChange={onChangeSK}
                                                                                required
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label>Lampiran SK</label>
                                                                            <label htmlFor='testing10' className='label_lampiran' style={{marginLeft: '110px'}}><span style={{marginRight:'15px'}}>+</span> PILIH BERKAS</label>
                                                                            <input 
                                                                                id="testing10"
                                                                                className="gnrm-penjelasan" 
                                                                                style={{height: "42px", 
                                                                                        marginLeft: "30px", 
                                                                                        width: "955px"}} 
                                                                                onChange={onChangeSKFile}
                                                                                type="file"
                                                                                accept="image/* , application/pdf"
                                                                                name="media"
                                                                            />
                                                                            </div>

                                                                            <div>
                                                                                        <div style={{height: "fit-content", 
                                                                                            marginLeft: "210px", 
                                                                                            width: "955px",
                                                                                            border: '1px solid #ACACAC',
                                                                                            borderRadius: '5px',
                                                                                            padding: '10px',
                                                                                            display: 'flex',
                                                                                            flexWrap: 'wrap',
                                                                                        }} 
                                                                                        >
                                                                                            {
                                                                                                skFile.map((lampiran,index) => {
                                                                                                    const fileExt = getFIleExtension(lampiran.name)
                                                                                                    const objectURL = URL.createObjectURL(lampiran)
                                                                                                    // cekEkstension(fileExt)
                                                                                                    return(
                                                                                                        <div key={index}>
                                                                                                                <div style={{width:'150px', 
                                                                                                                            height:'150px', 
                                                                                                                            marginRight:'35px', 
                                                                                                                            position:'relative'
                                                                                                                            }}
                                                                                                                    className="d-flex align-items-center justify-content-center"
                                                                                                                >
                                                                                                                    <div style={{width:'150px', height:'150px', overflow:'hidden', position:'absolute'}}>
                                                                                                                        {
                                                                                                                            fileExt === 'pdf' ? 
                                                                                                                                <img src={imgFile} alt={lampiran.name} style={{width:'150px' , height:'150px'}}className="gnrm-media--image" />
                                                                                                                            :
                                                                                                                                <img src={objectURL} alt={lampiran.name} className="gnrm-media--image" />
                                                                                                                        }
                                                                                                                    </div>
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
                                                                        </div>
                                                                    </Fragment>
                                                                    :
                                                                    <div>
                                                                        <label style={{textAlign:'right', clear:'both' , float:'left'}}>Kendala</label>
                                                                        <textarea 
                                                                            className="gnrm-nama-program" 
                                                                            style={{height: "300px", 
                                                                                    marginLeft: "140px", 
                                                                                    width: "955px"}} 
                                                                            type="text" 
                                                                            name="sk_kendala"
                                                                            value={data.sk_kendala}
                                                                            onChange={onChangeSK}
                                                                        />
                                                                    </div>
                                                                }
                                                            </Fragment>
                                                        }
                                                </Fragment>
                                             }
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
                                                        style={{
                                                            height: "42px",
                                                            marginLeft: "93px",
                                                            width: "955px"
                                                        }}
                                                        type="text"
                                                        name="nama_program"
                                                        value={kegiatan.nama_program}
                                                        onChange={(event) => onChange(event, 'kegiatan')}
                                                    />
                                                </div>
                                                        <Fragment>
                                                            <div>
                                                                <label>Kegiatan Prioritas</label>
                                                                {
                                                                    documentDetail && documentDetail.form.kp ?
                                                                        <select
                                                                            onChange={onChange}
                                                                            class="gnrm-select"
                                                                            name="kp"
                                                                            style={{ marginLeft: '71px', width: '955px', height: '42px' }}
                                                                        >
                                                                            {
                                                                                kpOptions && kpOptions.map((kp, i) => <option key={i} selected={documentDetail.form.kp === kp && true} title={kp} value={kp}>{kp.length > 113 ? `${kp.substr(0, 110)}...` : kp}</option>)
                                                                            }
                                                                        </select> :
                                                                        <select
                                                                            onChange={onChange}
                                                                            class="gnrm-select"
                                                                            name="kp"
                                                                            style={{ marginLeft: '71px', width: '955px', height: '42px' }}
                                                                        >
                                                                            <option selected={true} hidden></option>
                                                                            {
                                                                                kpOptions && kpOptions.map((kp, i) => <option key={i} title={kp} value={kp}>{kp.length > 113 ? `${kp.substr(0, 110)}...` : kp}</option>)
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
                                                                            style={{ marginLeft: '84px' }}
                                                                        >
                                                                            {
                                                                                propOptions && propOptions.map((prop, i) => <option key={i} selected={documentDetail.form.prop === prop && true} title={prop} value={prop}>{prop.length > 100 ? `${prop.substr(0, 97)}...` : prop}</option>)
                                                                            }
                                                                            {!selectedKp && <option>{'Pilih Kegiatan Prioritas\n\nterlebih dahulu'}</option>}
                                                                        </select> :
                                                                        <select
                                                                            onChange={onChange}
                                                                            class="gnrm-select selectpicker"
                                                                            name="prop"
                                                                            style={{ marginLeft: '83px' }}
                                                                        >
                                                                            <option selected={true} hidden></option>
                                                                            {
                                                                                propOptions && propOptions.map((prop, i) => <option key={i} title={prop} value={prop}>{prop.length > 100 ? `${prop.substr(0, 97)}...` : prop}</option>)
                                                                            }
                                                                            {!selectedKp && <option>{'Pilih Kegiatan Prioritas\n\nterlebih dahulu'}</option>}
                                                                        </select>
                                                                }
                                                            </div>

                                                            {
                                                                selectedKp === 'Pusat-pusat Perubahan Revolusi Mental' &&
                                                                <Fragment>
                                                                    <div>
                                                                        <label>Gerakan</label>
                                                                        {
                                                                            isEditing && documentDetail.form.gerakan && Object.values(selectedGerakan).length > 0 ?
                                                                                <select
                                                                                    onChange={onChange}
                                                                                    class="gnrm-select"
                                                                                    name="gerakan-0"
                                                                                    style={{ marginLeft: '145px' }}
                                                                                >
                                                                                    <option value={selectedGerakan['gerakan-0']} defaultValue>{selectedGerakan['gerakan-0']}</option>
                                                                                    {
                                                                                        gerakanOptions && gerakanOptions.map((gerakan, i) => {
                                                                                            let alreadySelected = false
                                                                                            Object.values(selectedGerakan).forEach(selected => {
                                                                                                if (gerakan === selected) alreadySelected = true
                                                                                            });
                                                                                            return <option key={i} value={gerakan} selected={gerakan === selectedGerakan['gerakan-0'] ? true : false} hidden={alreadySelected}>{gerakan}</option>
                                                                                        })
                                                                                    }
                                                                                </select> :
                                                                                <select
                                                                                    onChange={onChangeGerakan}
                                                                                    class="gnrm-select"
                                                                                    name="gerakan-0"
                                                                                    style={{ marginLeft: '145px' }}
                                                                                >
                                                                                    <option selected={true} hidden></option>
                                                                                    {
                                                                                        gerakanOptions && gerakanOptions.map((gerakan, i) => {
                                                                                            let alreadySelected = false
                                                                                            Object.values(selectedGerakan).forEach(selected => {
                                                                                                if (gerakan === selected) alreadySelected = true
                                                                                            });
                                                                                            return <option key={i} value={gerakan} hidden={alreadySelected}>{gerakan}</option>
                                                                                        })
                                                                                    }
                                                                                </select>
                                                                        }
                                                                    </div>
                                                                    {
                                                                        isEditing && documentDetail.form.gerakan && Object.values(selectedGerakan).length > 0 ?
                                                                            Object.values(selectedGerakan)
                                                                                .filter(selected => selected !== selectedGerakan['gerakan-0'])
                                                                                .map((_, index) => {
                                                                                    return (
                                                                                        <div>
                                                                                            <label>Gerakan</label>
                                                                                            <select
                                                                                                onChange={onChangeGerakan}
                                                                                                class="gnrm-select"
                                                                                                name={`gerakan-${index + 1}`}
                                                                                                style={{ marginLeft: '145px' }}
                                                                                            >
                                                                                                <option value={_} defaultValue hidden={_ === '' ? true : false}>{_}</option>
                                                                                                {
                                                                                                    gerakanOptions && gerakanOptions.map((gerakan, i) => {
                                                                                                        let alreadySelected = false
                                                                                                        Object.values(selectedGerakan).forEach(selected => {
                                                                                                            if (gerakan === selected) alreadySelected = true
                                                                                                        });
                                                                                                        return <option key={i} value={gerakan} selected={gerakan === selectedGerakan[`gerakan-${index + 1}`]} hidden={alreadySelected}>{gerakan}</option>
                                                                                                    })
                                                                                                }
                                                                                            </select>
                                                                                            <span className="remove-form" onClick={() => onDeleteGerakanForm(index)}>
                                                                                                <i className=""> x </i>
                                                                                            </span>
                                                                                        </div>
                                                                                    )
                                                                                }) :
                                                                            formGerakan.map((form, index) => {
                                                                                return (
                                                                                    <div key={index}>
                                                                                        <label>Gerakan</label>
                                                                                        <select
                                                                                            onChange={onChangeGerakan}
                                                                                            class="gnrm-select"
                                                                                            name={`gerakan-${index + 1}`}
                                                                                            style={{ marginLeft: '145px' }}
                                                                                        >
                                                                                            <option selected={true} hidden></option>
                                                                                            {
                                                                                                gerakanOptions && gerakanOptions.map((gerakan, i) => {
                                                                                                    let alreadySelected = false
                                                                                                    Object.values(selectedGerakan).forEach(selected => {
                                                                                                        if (gerakan === selected) alreadySelected = true
                                                                                                    });
                                                                                                    return <option key={i} value={gerakan} hidden={alreadySelected} selected={gerakan === selectedGerakan[`gerakan-${index + 1}`]}>{gerakan}</option>
                                                                                                })
                                                                                            }
                                                                                        </select>
                                                                                        <span className="remove-form" onClick={() => onDeleteGerakanForm(index)}>
                                                                                            <i className=""> x </i>
                                                                                        </span>
                                                                                    </div>
                                                                                )
                                                                            })
                                                                    }
                                                                    {
                                                                        formGerakan.length < 4 ?
                                                                            <div>
                                                                                <label className="tambah-lembaga" >
                                                                                    Tambah Gerakan
                                                                            </label>
                                                                                <img src={plus2} style={{ position: 'absolute', marginTop: '-3px', marginLeft: '20px', cursor: 'pointer' }} onClick={addFormGerakan} />
                                                                            </div>
                                                                            : ''
                                                                    }
                                                                </Fragment>
                                                            }
                                                        </Fragment>
                                                <div>
                                                    <label style={{ textAlign: 'right', clear: 'both', float: 'left' }}>Penjelasan</label>
                                                    <textarea
                                                        className="gnrm-penjelasan"
                                                        style={{
                                                            height: "283px",
                                                            marginLeft: "127px",
                                                            width: "955px"
                                                        }}
                                                        type="text"
                                                        name="penjelasan_kegiatan"
                                                        value={kegiatan.penjelasan_kegiatan}
                                                        onChange={(event) => onChange(event, 'kegiatan')}
                                                    />
                                                </div>
                                            </div>

                                            <div className="gnrm-navigation-button">
                                                <Link
                                                    to="gugus_tugas"
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
                                                    <label style={{ textAlign: 'right', clear: 'both', float: 'left' }}>Indikator Capaian</label>
                                                    <textarea
                                                        className="gnrm-indikator"
                                                        style={{
                                                            height: "150px",
                                                            marginLeft: "70px",
                                                            width: "955px"
                                                        }}
                                                        type="text"
                                                        name="indikator_capaian"
                                                        value={output.indikator_capaian}
                                                        onChange={(event) => onChange(event, 'output')}
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ textAlign: 'right', clear: 'both', float: 'left' }}>Sasaran</label>
                                                    <textarea
                                                        className="gnrm-sasaran"
                                                        style={{
                                                            height: "130px",
                                                            marginLeft: "149px",
                                                            width: "955px"
                                                        }}
                                                        type="text"
                                                        name="sasaran"
                                                        value={output.sasaran}
                                                        onChange={(event) => onChange(event, 'output')}

                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ textAlign: 'right', clear: 'both', float: 'left' }}>Target</label>
                                                    <textarea
                                                        className="gnrm-target"
                                                        style={{
                                                            height: "130px",
                                                            marginLeft: "161px",
                                                            width: "955px"
                                                        }}
                                                        type="text"
                                                        name="target"
                                                        value={output.target}
                                                        onChange={(event) => onChange(event, 'output')}
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
                                                    <label style={{ textAlign: 'right', clear: 'both', float: 'left' }}>Penjelasan</label>
                                                    <textarea
                                                        className="gnrm-penjelasan"
                                                        style={{
                                                            height: "300px",
                                                            marginLeft: "127px",
                                                            width: "955px"
                                                        }}
                                                        type="text"
                                                        name="kondisi_awal"
                                                        value={kondisi_awal}
                                                        onChange={(event) => onChange(event)}
                                                    />
                                                </div>
                                                <div>
                                                    <label>Lampiran Media</label>
                                                    <label htmlFor='testing2' className='label_lampiran'><span style={{ marginRight: '15px' }}>+</span> PILIH BERKAS</label>
                                                    <input
                                                        id="testing2"
                                                        className="gnrm-penjelasan"
                                                        style={{
                                                            height: "42px",
                                                            marginLeft: "28px",
                                                            width: "955px"
                                                        }}
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
                                                            <div style={{
                                                                height: "fit-content",
                                                                marginLeft: "208px",
                                                                width: "955px",
                                                                border: '1px solid #ACACAC',
                                                                borderRadius: '5px',
                                                                padding: '10px',
                                                                display: 'flex',
                                                                flexWrap: 'wrap',
                                                                overflow: 'hidden'
                                                            }}
                                                            >
                                                                {
                                                                    lampiranKondisi && lampiranKondisi.map((lampiran, index) => {
                                                                        const objectURL = URL.createObjectURL(lampiran)
                                                                        return (
                                                                            <div key={index}>
                                                                                <div style={{
                                                                                    width: '150px',
                                                                                    height: '150px',
                                                                                    backgroundColor: 'pink',
                                                                                    marginRight: '35px',
                                                                                    position: 'relative'
                                                                                }}
                                                                                    className="d-flex align-items-center justify-content-center"
                                                                                >
                                                                                    <div style={{ width: '150px', height: '150px', overflow: 'hidden', position: 'absolute' }}>
                                                                                        <img src={objectURL} alt={lampiran.name} className="gnrm-media--image" />
                                                                                    </div>
                                                                                    <div style={{
                                                                                        position: 'absolute',
                                                                                        backgroundColor: '#C04B3E',
                                                                                        width: '25px',
                                                                                        height: '25px',
                                                                                        borderRadius: '50%',
                                                                                        top: '-7px',
                                                                                        right: '-7px',
                                                                                        lineHeight: '25px',
                                                                                        textAlign: 'center',
                                                                                        cursor: 'pointer',
                                                                                        color: 'white'
                                                                                    }}
                                                                                        onClick={(e) => onDeleteKondisi(true, lampiran.name, lampiran)}> X </div>
                                                                                </div>
                                                                                <div style={{
                                                                                    marginTop: '10px',
                                                                                    width: '150px',
                                                                                    height: '20px',
                                                                                    wordWrap: 'break-word',
                                                                                    lineHeight: '20px',
                                                                                }}
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
                                                                <div style={{
                                                                    height: "fit-content",
                                                                    marginLeft: "208px",
                                                                    width: "955px",
                                                                    border: '1px solid #ACACAC',
                                                                    borderRadius: '5px',
                                                                    padding: '10px',
                                                                    display: 'flex',
                                                                    flexWrap: 'wrap',
                                                                    overflow: 'hidden'
                                                                }}
                                                                >
                                                                    {
                                                                        lampiranKondisiUrl && lampiranKondisiUrl.map((url, index) => {
                                                                            return (
                                                                                <div key={index}>
                                                                                    <div style={{
                                                                                        width: '150px',
                                                                                        height: '150px',
                                                                                        backgroundColor: 'pink',
                                                                                        marginRight: '35px',
                                                                                        position: 'relative'
                                                                                    }}
                                                                                        className="d-flex align-items-center justify-content-center"
                                                                                    >
                                                                                        <div style={{ width: '150px', height: '150px', overflow: 'hidden', position: 'absolute' }}>
                                                                                            <img src={url} alt={getFileName(url)} className="gnrm-media--image" />
                                                                                        </div>
                                                                                        <div style={{
                                                                                            position: 'absolute',
                                                                                            backgroundColor: '#C04B3E',
                                                                                            width: '25px',
                                                                                            height: '25px',
                                                                                            borderRadius: '50%',
                                                                                            top: '-7px',
                                                                                            right: '-7px',
                                                                                            lineHeight: '25px',
                                                                                            textAlign: 'center',
                                                                                            cursor: 'pointer'
                                                                                        }}
                                                                                            onClick={(e) => onDeleteKondisi(false, getFileName(url))}> X </div>
                                                                                    </div>
                                                                                    <div style={{
                                                                                        marginTop: '10px',
                                                                                        width: '150px',
                                                                                        height: '20px',
                                                                                        wordWrap: 'break-word',
                                                                                        lineHeight: '20px'
                                                                                    }}
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
                                                        style={{
                                                            height: "42px",
                                                            marginLeft: "59px",
                                                            width: "955px"
                                                        }}
                                                        type="text"
                                                        name="sumber_dana"
                                                        value={anggaran.sumber_dana}
                                                        onChange={(event) => onChange(event, 'anggaran')}
                                                    />
                                                </div>
                                                <div>
                                                    <label>Besaran Anggaran</label>
                                                    <input
                                                        className="gnrm-anggaran"
                                                        style={{
                                                            height: "42px",
                                                            marginLeft: "69px",
                                                            width: "955px"
                                                        }}
                                                        placeholder="Rp..."
                                                        type="text"
                                                        name="besar_anggaran"
                                                        value={anggaran.besar_anggaran}
                                                        onChange={(event) => onChange(event, 'anggaran')}
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
                                                    <label style={{ textAlign: 'left', clear: 'both', float: 'left' }}>Mekanisme Pelaksanaan <br />Kegiatan</label>
                                                    <textarea
                                                        className="gnrm-penjelasan"
                                                        style={{
                                                            height: "400px",
                                                            marginLeft: "15px",
                                                            width: "955px"
                                                        }}
                                                        type="text"
                                                        name="proses"
                                                        value={proses}
                                                        onChange={(event) => onChange(event)}
                                                    />
                                                </div>
                                                <div>
                                                    <label>Lampiran Media</label>
                                                    <label htmlFor='testing3' className='label_lampiran'><span style={{ marginRight: '15px' }}>+</span> PILIH BERKAS</label>
                                                    <input
                                                        id="testing3"
                                                        className="gnrm-penjelasan"
                                                        style={{
                                                            height: "42px",
                                                            marginLeft: "28px",
                                                            width: "955px"
                                                        }}
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
                                                            <div style={{
                                                                height: "fit-content",
                                                                marginLeft: "208px",
                                                                width: "955px",
                                                                border: '1px solid #ACACAC',
                                                                borderRadius: '5px',
                                                                padding: '10px',
                                                                display: 'flex',
                                                                flexWrap: 'wrap',
                                                                overflow: 'hidden'
                                                            }}
                                                            >
                                                                {
                                                                    lampiranProses && lampiranProses.map((lampiran, index) => {
                                                                        const objectURL = URL.createObjectURL(lampiran)
                                                                        return (
                                                                            <div key={index}>
                                                                                <div style={{
                                                                                    width: '150px',
                                                                                    height: '150px',
                                                                                    backgroundColor: 'pink',
                                                                                    marginRight: '35px',
                                                                                    position: 'relative'
                                                                                }}
                                                                                    className="d-flex align-items-center justify-content-center"
                                                                                >
                                                                                    <div style={{ width: '150px', height: '150px', overflow: 'hidden', position: 'absolute' }}>
                                                                                        <img src={objectURL} alt={lampiran.name} className="gnrm-media--image" />
                                                                                    </div>
                                                                                    <div style={{
                                                                                        position: 'absolute',
                                                                                        backgroundColor: '#C04B3E',
                                                                                        width: '25px',
                                                                                        height: '25px',
                                                                                        borderRadius: '50%',
                                                                                        top: '-7px',
                                                                                        right: '-7px',
                                                                                        lineHeight: '25px',
                                                                                        textAlign: 'center',
                                                                                        cursor: 'pointer',
                                                                                        color: 'white'
                                                                                    }}
                                                                                        onClick={(e) => onDeleteProses(true, lampiran.name, lampiran)}> X </div>
                                                                                </div>
                                                                                <div style={{
                                                                                    marginTop: '10px',
                                                                                    width: '150px',
                                                                                    height: '20px',
                                                                                    wordWrap: 'break-word',
                                                                                    lineHeight: '20px',
                                                                                }}
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
                                                                <div style={{
                                                                    height: "fit-content",
                                                                    marginLeft: "208px",
                                                                    width: "955px",
                                                                    border: '1px solid #ACACAC',
                                                                    borderRadius: '5px',
                                                                    padding: '10px',
                                                                    display: 'flex',
                                                                    flexWrap: 'wrap',
                                                                    overflow: 'hidden'
                                                                }}
                                                                >
                                                                    {
                                                                        lampiranProsesUrl && lampiranProsesUrl.map((url, index) => {
                                                                            return (
                                                                                <div key={index}>
                                                                                    <div style={{
                                                                                        width: '150px',
                                                                                        height: '150px',
                                                                                        backgroundColor: 'pink',
                                                                                        marginRight: '35px',
                                                                                        position: 'relative'
                                                                                    }}
                                                                                        className="d-flex align-items-center justify-content-center"
                                                                                    >
                                                                                        <div style={{ width: '150px', height: '150px', overflow: 'hidden', position: 'absolute' }}>
                                                                                            <img src={url} alt={getFileName(url)} className="gnrm-media--image" />
                                                                                        </div>
                                                                                        <div style={{
                                                                                            position: 'absolute',
                                                                                            backgroundColor: '#C04B3E',
                                                                                            width: '25px',
                                                                                            height: '25px',
                                                                                            borderRadius: '50%',
                                                                                            top: '-7px',
                                                                                            right: '-7px',
                                                                                            lineHeight: '25px',
                                                                                            textAlign: 'center',
                                                                                            cursor: 'pointer'
                                                                                        }}
                                                                                            onClick={(e) => onDeleteProses(false, getFileName(url))}> X </div>
                                                                                    </div>
                                                                                    <div style={{
                                                                                        marginTop: '10px',
                                                                                        width: '150px',
                                                                                        height: '20px',
                                                                                        wordWrap: 'break-word',
                                                                                        lineHeight: '20px'
                                                                                    }}
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
                                                                    style={{
                                                                        height: "42px",
                                                                        marginLeft: "57px",
                                                                        width: "955px"
                                                                    }}
                                                                    type="text"
                                                                    name="peran"
                                                                    value={data.pihak_terkait.peran}
                                                                    onChange={(event) => onChange(event, 'pihak_terkait', true, 0)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label>Lembaga Terkait</label>
                                                                <input
                                                                    className="gnrm-terkait"
                                                                    style={{
                                                                        height: "42px",
                                                                        marginLeft: "80px",
                                                                        width: "955px"
                                                                    }}
                                                                    type="text"
                                                                    name="lembaga"
                                                                    value={data.pihak_terkait.lembaga}
                                                                    onChange={(event) => onChange(event, 'pihak_terkait', true, 0)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label style={{ textAlign: 'right', clear: 'both', float: 'left' }}>Penjelasan</label>
                                                                <textarea
                                                                    className="gnrm-penjelasan"
                                                                    style={{
                                                                        height: "400px",
                                                                        marginLeft: "127px",
                                                                        width: "955px"
                                                                    }}
                                                                    type="text"
                                                                    name="penjelasan_pihak_terkait"
                                                                    value={data.pihak_terkait.penjelasan_pihak_terkait}
                                                                    onChange={(event) => onChange(event, 'pihak_terkait', true, 0)}
                                                                />
                                                            </div>
                                                        </Fragment>
                                                        :
                                                        documentDetail&&documentDetail.form.pihak_terkait.map((pihak, index) => {
                                                            return (
                                                                <Fragment key={index}>
                                                                    <div>
                                                                        <label>Peran Pihak Terkait</label>
                                                                        <input
                                                                            className="gnrm-terkait"
                                                                            style={{
                                                                                height: "42px",
                                                                                marginLeft: "57px",
                                                                                width: "955px"
                                                                            }}
                                                                            type="text"
                                                                            name="peran"
                                                                            value={data.pihak_terkait[index] && data.pihak_terkait[index].peran}
                                                                            onChange={(event) => onChange(event, 'pihak_terkait', true, index)}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label>Lembaga Terkait</label>
                                                                        <input
                                                                            className="gnrm-terkait"
                                                                            style={{
                                                                                height: "42px",
                                                                                marginLeft: "80px",
                                                                                width: "955px"
                                                                            }}
                                                                            type="text"
                                                                            name="lembaga"
                                                                            value={data.pihak_terkait[index] && data.pihak_terkait[index].lembaga}
                                                                            onChange={(event) => onChange(event, 'pihak_terkait', true, index)}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label style={{ textAlign: 'right', clear: 'both', float: 'left' }}>Penjelasan</label>
                                                                        <textarea
                                                                            className="gnrm-penjelasan"
                                                                            style={{
                                                                                height: "400px",
                                                                                marginLeft: "127px",
                                                                                width: "955px"
                                                                            }}
                                                                            type="text"
                                                                            name="penjelasan_pihak_terkait"
                                                                            value={data.pihak_terkait[index] && data.pihak_terkait[index].penjelasan_pihak_terkait}
                                                                            onChange={(event) => onChange(event, 'pihak_terkait', true, index)}
                                                                        />
                                                                    </div>
                                                                </Fragment>
                                                            )
                                                        })
                                                }
                                                {
                                                    form.map((form, index) => {
                                                        return (
                                                            <Fragment key={index + panjang}>
                                                                <div>
                                                                    <label>Peran Pihak Terkait</label>
                                                                    <input
                                                                        className="gnrm-terkait"
                                                                        style={{
                                                                            height: "42px",
                                                                            marginLeft: "57px",
                                                                            width: "955px"
                                                                        }}
                                                                        type="text"
                                                                        name="peran"
                                                                        value={data.pihak_terkait.peran}
                                                                        onChange={(event) => onChange(event, 'pihak_terkait', true, index + panjang)}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label>Lembaga Terkait</label>
                                                                    <input
                                                                        className="gnrm-terkait"
                                                                        style={{
                                                                            height: "42px",
                                                                            marginLeft: "80px",
                                                                            width: "955px"
                                                                        }}
                                                                        type="text"
                                                                        name="lembaga"
                                                                        value={data.pihak_terkait.lembaga}
                                                                        onChange={(event) => onChange(event, 'pihak_terkait', true, index + panjang)}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label style={{ textAlign: 'right', clear: 'both', float: 'left' }}>Penjelasan</label>
                                                                    <textarea
                                                                        className="gnrm-penjelasan"
                                                                        style={{
                                                                            height: "400px",
                                                                            marginLeft: "127px",
                                                                            width: "955px"
                                                                        }}
                                                                        type="text"
                                                                        name="penjelasan_pihak_terkait"
                                                                        value={data.pihak_terkait.penjelasan_pihak_terkait}
                                                                        onChange={(event) => onChange(event, 'pihak_terkait', true, index + panjang)}
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
                                                <img src={plus2} style={{ position: 'absolute', marginTop: '-3px', marginLeft: '20px', cursor: 'pointer' }} onClick={addForm} />
                                            </div>


                                            <div className="gnrm-navigation-button">
                                                <Link
                                                    to="proses"
                                                    spy={true}
                                                    smooth={true}
                                                    duration={500}
                                                    offset={-30}
                                                >
                                                    <button className="previous"><i className="material-icons" style={{ fontSize: '36px' }}>expand_less</i></button>
                                                </Link>

                                                <Link
                                                    to="lampiran"
                                                    spy={true}
                                                    smooth={true}
                                                    duration={500}
                                                    offset={-30}
                                                >
                                                    <button className="forward"><i className="material-icons" style={{ fontSize: '36px' }}>expand_more</i></button>
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
                                                    <label htmlFor='testing' className='label_lampiran'><span style={{ marginRight: '15px' }}>+</span> PILIH BERKAS</label>
                                                    <input
                                                        id="testing"
                                                        className="gnrm-penjelasan"
                                                        style={{
                                                            height: "42px",
                                                            marginLeft: "28px",
                                                            width: "955px"
                                                        }}
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
                                                            <div style={{
                                                                height: "fit-content",
                                                                marginLeft: "208px",
                                                                width: "955px",
                                                                border: '1px solid #ACACAC',
                                                                borderRadius: '5px',
                                                                padding: '10px',
                                                                display: 'flex',
                                                                flexWrap: 'wrap',
                                                                overflow: 'hidden'
                                                            }}
                                                            >
                                                                {
                                                                    media && media.map((media, index) => {
                                                                        const objectURL = URL.createObjectURL(media)
                                                                        return (
                                                                            <div key={index}>
                                                                                <div style={{
                                                                                    width: '150px',
                                                                                    height: '150px',
                                                                                    backgroundColor: 'pink',
                                                                                    marginRight: '35px',
                                                                                    position: 'relative'
                                                                                }}
                                                                                    className="d-flex align-items-center justify-content-center"
                                                                                >
                                                                                    <div style={{ width: '150px', height: '150px', overflow: 'hidden', position: 'absolute' }}>
                                                                                        <img src={objectURL} alt={media.name} className="gnrm-media--image" />
                                                                                    </div>
                                                                                    <div style={{
                                                                                        position: 'absolute',
                                                                                        backgroundColor: '#C04B3E',
                                                                                        width: '25px',
                                                                                        height: '25px',
                                                                                        borderRadius: '50%',
                                                                                        top: '-7px',
                                                                                        right: '-7px',
                                                                                        lineHeight: '25px',
                                                                                        textAlign: 'center',
                                                                                        cursor: 'pointer',
                                                                                        color: 'white'
                                                                                    }}
                                                                                        onClick={(e) => onDeleteMedia(true, media.name, media)}> X </div>
                                                                                </div>
                                                                                <div style={{
                                                                                    marginTop: '10px',
                                                                                    width: '150px',
                                                                                    height: '20px',
                                                                                    wordWrap: 'break-word',
                                                                                    lineHeight: '20px',
                                                                                }}
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
                                                                <div style={{
                                                                    height: "fit-content",
                                                                    marginLeft: "208px",
                                                                    width: "955px",
                                                                    border: '1px solid #ACACAC',
                                                                    borderRadius: '5px',
                                                                    padding: '10px',
                                                                    display: 'flex',
                                                                    flexWrap: 'wrap',
                                                                    overflow: 'hidden'
                                                                }}
                                                                >
                                                                    {
                                                                        mediaUrl && mediaUrl.map((url, index) => {
                                                                            return (
                                                                                <div key={index}>
                                                                                    <div style={{
                                                                                        width: '150px',
                                                                                        height: '150px',
                                                                                        backgroundColor: 'pink',
                                                                                        marginRight: '35px',
                                                                                        position: 'relative'
                                                                                    }}
                                                                                        className="d-flex align-items-center justify-content-center"
                                                                                    >
                                                                                        <div style={{ width: '150px', height: '150px', overflow: 'hidden', position: 'absolute' }}>
                                                                                            <img src={url} alt={getFileName(url)} className="gnrm-media--image" />
                                                                                        </div>
                                                                                        <div style={{
                                                                                            position: 'absolute',
                                                                                            backgroundColor: '#C04B3E',
                                                                                            width: '25px',
                                                                                            height: '25px',
                                                                                            borderRadius: '50%',
                                                                                            top: '-7px',
                                                                                            right: '-7px',
                                                                                            lineHeight: '25px',
                                                                                            textAlign: 'center',
                                                                                            cursor: 'pointer'
                                                                                        }}
                                                                                            onClick={(e) => onDeleteMedia(false, getFileName(url))}> X </div>
                                                                                    </div>
                                                                                    <div style={{
                                                                                        marginTop: '10px',
                                                                                        width: '150px',
                                                                                        height: '20px',
                                                                                        wordWrap: 'break-word',
                                                                                        lineHeight: '20px'
                                                                                    }}
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
                                        <div className="gnrm-container" style={{ marginBottom: "130px" }}>
                                            <div className="form-gnrm">
                                                <div>
                                                    <label>Nama</label>
                                                    <input
                                                        className="gnrm-eselon"
                                                        style={{
                                                            height: "42px",
                                                            marginLeft: "164px",
                                                            width: "403px"
                                                        }}
                                                        type="text"
                                                        name="nama"
                                                        value={penanggung_jawab.nama}
                                                        onChange={(event) => onChange(event, 'penanggung_jawab')}

                                                    />
                                                </div>
                                                <div>
                                                    <label>Jabatan</label>
                                                    <input
                                                        className="gnrm-nip"
                                                        style={{
                                                            height: "42px",
                                                            marginLeft: "151px",
                                                            width: "403px"
                                                        }}
                                                        type="text"
                                                        name="jabatan"
                                                        value={penanggung_jawab.jabatan}
                                                        onChange={(event) => onChange(event, 'penanggung_jawab')}

                                                    />
                                                </div>
                                                <div>
                                                    <label>NIP</label>
                                                    <input
                                                        className="gnrm-lampiran"
                                                        style={{
                                                            height: "42px",
                                                            marginLeft: "183px",
                                                            width: "403px"
                                                        }}

                                                        type="text"
                                                        name="nip"
                                                        value={penanggung_jawab.nip}
                                                        onChange={(event) => onChange(event, 'penanggung_jawab')}
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

                                                <button className="simpan-gnrm" type='submit' >SIMPAN PERUBAHAN</button>

                                                <button className="preview-gnrm" onClick={setPreview}>PRATINJAU LAPORAN</button>

                                            </div>
                                        </div>
                                    </Element>
                                </form>
                            :
                                <form style={{ width: 'fit-content', height: 'fit-content', margin: 'auto' }} id='form-gnrm' onSubmit={isEditing ? onEdit : onSubmit}>
                                    <Element id='identitas' name='identitas'>
                                        <div className="gnrm-container-off">
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
                                                    {
                                                        documentDetail && documentDetail.form.id_program ?
                                                            <select
                                                                onChange={(event) => onChange(event)}
                                                                className="monev-id-program"
                                                                name="id_program"
                                                                style={{ marginLeft: '124px' }}
                                                            >

                                                                {
                                                                    pilihanPeriode.map((periode, i) => <option key={i} selected={documentDetail.form.id_program === periode && true} title={periode} value={periode}>{periode}</option>)
                                                                }

                                                            </select> :
                                                            <select
                                                                onChange={(event) => onChange(event)}
                                                                className="monev-id-laporan"
                                                                name="id_program"
                                                                style={{ marginLeft: '124px' }}
                                                            >
                                                                <option selected={true} hidden></option>
                                                                {
                                                                    pilihanPeriode.map((periode, i) => <option key={i} title={periode} value={periode}>{periode}</option>)
                                                                }
                                                            </select>
                                                    }
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
                                                    to="gugus_tugas"
                                                    spy={true}
                                                    smooth={true}
                                                    duration={500}
                                                    offset={-30}
                                                >
                                                    <button className="forward tes1"><i className="material-icons">expand_more</i></button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Element>

                                    <Element id='gugus_tugas' name='gugus_tugas'>
                                        <div className="gnrm-container-off" >
                                            <div className="gnrm-title">
                                                GUGUS TUGAS GNRM
                                    </div>
                                            <div className="form-gnrm">
                                            {
                                        isEditing ? 
                                            <Fragment>
                                                 <div>
                                                     <label style={{textAlign:'left', clear:'both' , float:'left'}}>Sudah Terbentuk <br/> Gugus Tugas?</label>
                                                     <div style={{marginLeft:'210px'}}>
                                                         {
                                                             data.sk_status ?
                                                             <Fragment>
                                                                 <label htmlFor="sudah" className='label-radio' style={{ marginRight: '65px' }}>Sudah
                                                                     <input type="radio" id="sudah" name="sk_status" className='input-radio' value={data.sk_status} checked={true} onChange={onChangeButton} />
                                                                     <span className='checked-radio'></span>
                                                                 </label>
                                                                 <label htmlFor="belum" className='label-radio'>Belum
                                                                     <input type="radio" id="belum" name="sk_status"  className='input-radio' value={data.sk_status} onChange={onChangeButtonFalse} />
                                                                     <span className='checked-radio'></span>
                                                                 </label>
                                                             </Fragment>
                                                             :
                                                             <Fragment>
                                                                 <label htmlFor="sudah" className='label-radio' style={{ marginRight: '65px' }}>Sudah
                                                                     <input type="radio" id="sudah" name="sk_status" className='input-radio' value={data.sk_status} onChange={onChangeButton} />
                                                                     <span className='checked-radio'></span>
                                                                 </label>
                                                                 <label htmlFor="belum" className='label-radio' >Belum
                                                                     <input type="radio" id="belum" name="sk_status"  className='input-radio'value={data.sk_status} checked={true} onChange={onChangeButtonFalse} />
                                                                     <span className='checked-radio'></span>
                                                                 </label>
                                                             </Fragment>
                                                         }
                                                     </div>
                                                 </div>
                                                     {
                                                         data.sk_status ?
                                                         <Fragment>
                                                             <div>
                                                                 <label>Input Nomor SK</label>
                                                                 <input
                                                                     className="gnrm-sasaran" 
                                                                     style={{height: "42px", 
                                                                             marginLeft: '84px',
                                                                             width: "767px",
                                                                             fontWeight:'700'
                                                                             }}
                                                                     type="text" 
                                                                     name="sk_no"
                                                                     value={data.sk_no}
                                                                     onChange={onChangeSK}
                                                                     required
                                                                 />
                                                             </div>
                                                             <div>
                                                                 <label>Lampiran SK</label>
                                                                 <label htmlFor='testing10' className='label_lampiran' style={{marginLeft: '110px'}}><span style={{marginRight:'15px'}}>+</span> PILIH BERKAS</label>
                                                                 <input 
                                                                     id="testing10"
                                                                     className="gnrm-penjelasan" 
                                                                     style={{height: "42px", 
                                                                             marginLeft: "30px", 
                                                                             width: "767px"}} 
                                                                     onChange={onChangeSKFile}
                                                                     type="file"
                                                                     accept="image/* , application/pdf"
                                                                     name="media"
                                                                 />
                                                             </div>
                                                                <div>
                                                                 {
                                                                                skFile && skFile.length > 0 ?
                                                                                        <div style={{height: "fit-content", 
                                                                                            marginLeft: "210px", 
                                                                                            width: "767px",
                                                                                            border: '1px solid #ACACAC',
                                                                                            borderRadius: '5px',
                                                                                            padding: '10px',
                                                                                            display: 'flex',
                                                                                            flexWrap: 'wrap',
                                                                                        }} 
                                                                                        >
                                                                                            {
                                                                                                skFile.map((lampiran,index) => {
                                                                                                    const fileExt = getFIleExtension(lampiran.name)
                                                                                                    const objectURL = URL.createObjectURL(lampiran)
                                                                                                    // cekEkstension(fileExt)
                                                                                                    return(
                                                                                                        <div key={index}>
                                                                                                                <div style={{width:'150px', 
                                                                                                                            height:'150px', 
                                                                                                                            marginRight:'35px', 
                                                                                                                            position:'relative'
                                                                                                                            }}
                                                                                                                    className="d-flex align-items-center justify-content-center"
                                                                                                                >
                                                                                                                    <div style={{width:'150px', height:'150px', overflow:'hidden', position:'absolute'}}>
                                                                                                                        {
                                                                                                                            fileExt === 'pdf' ? 
                                                                                                                                <img src={imgFile} alt={lampiran.name} style={{width:'150px' , height:'150px'}}className="gnrm-media--image" />
                                                                                                                            :
                                                                                                                                <img src={objectURL} alt={lampiran.name} className="gnrm-media--image" />
                                                                                                                        }
                                                                                                                    </div>
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
                                                                                    :
                                                                                    <div style={{height: "fit-content", 
                                                                                    marginLeft: "210px", 
                                                                                    width: "767px",
                                                                                    border: '1px solid #ACACAC',
                                                                                    borderRadius: '5px',
                                                                                    padding: '10px',
                                                                                    display: 'flex',
                                                                                    flexWrap: 'wrap',
                                                                                }} 
                                                                                >
                                                                                    {
                                                                                        
                                                                                                skFileUrl.map((url,index) => {
                                                                                                    const fileExt = getFIleExtension(getFileName(url))
                                                                                                    // cekEkstension(fileExt)
                                                                                                    return(
                                                                                                        <div key={index}>
                                                                                                                <div style={{width:'150px', 
                                                                                                                            height:'150px', 
                                                                                                                            marginRight:'35px', 
                                                                                                                            position:'relative'
                                                                                                                            }}
                                                                                                                    className="d-flex align-items-center justify-content-center"
                                                                                                                >
                                                                                                                    <div style={{width:'150px', height:'150px', overflow:'hidden', position:'absolute'}}>
                                                                                                                        {
                                                                                                                            fileExt === 'pdf' ? 
                                                                                                                                <img src={imgFile} alt={getFileName(url)} style={{width:'150px' , height:'150px'}}className="gnrm-media--image" />
                                                                                                                            :
                                                                                                                                <img src={url} alt={getFileName(url)} className="gnrm-media--image" />
                                                                                                                        }
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div style={{marginTop:'10px' , 
                                                                                                                            width:'150px' , 
                                                                                                                            height:'20px', 
                                                                                                                            wordWrap: 'break-word',
                                                                                                                            lineHeight:'20px',}}
                                                                                                                >
                                                                                                                    <p className="gnrm-media--name">
                                                                                                                        {getFileName(url).length > 18 ? `${getFileName(url).substr(0, 15)}...` : getFileName(url)}
                                                                                                                    </p>
                                                                                                                </div>
                                                                                                            
                                                                                                        </div>
                                                                                                    )
                                                                                                })
                                                                                            }
                                                                                    </div>
                                                                                    }
                                                                            </div>
                                                         </Fragment>
                                                         :
                                                         <div>
                                                             <label style={{textAlign:'right', clear:'both' , float:'left'}}>Kendala</label>
                                                             <textarea 
                                                                 className="gnrm-nama-program" 
                                                                 style={{height: "300px", 
                                                                         marginLeft: "140px", 
                                                                         width: "767px"}} 
                                                                 type="text" 
                                                                 name="sk_kendala"
                                                                 value={data.sk_kendala}
                                                                 onChange={onChangeSK}
                                                             />
                                                         </div>
                                                     }
                                                 </Fragment>
                                             :
                                                <Fragment>
                                                    {
                                                    instansiDetail.sk && instansiDetail.sk.status ? 
                                                        <Fragment>
                                                            <div>
                                                                <label style={{textAlign:'left', clear:'both' , float:'left'}}>Input Nomor SK</label>
                                                                <div
                                                                    className="gnrm-sasaran" 
                                                                    style={{height: "42px", 
                                                                            marginLeft: '230px',
                                                                            fontWeight:'700'
                                                                            }}
                                                                >{data.sk_no}</div>
                                                            </div>
                                                            <div>
                                                                <label style={{textAlign:'left', clear:'both' , float:'left'}}>Lampiran Berkas</label>
                                                                <div style={{width:'fit-content' , height: 'fit-content', marginLeft:'230px'}}>
                                                                    {
                                                                        skExtension === 'pdf' ? 
                                                                            ('')
                                                                        :
                                                                            <Fragment>
                                                                                <img src={skGambar} alt={getFileName(instansiDetail.sk && instansiDetail.sk.foto)} style={{ width: '500px', height: 'auto' }} /><br />
                                                                            </Fragment>
                                                                    }
                                                                    <div
                                                                        className="gnrm-sasaran" 
                                                                        style={{height: "42px", 
                                                                                width: "767px",
                                                                                fontWeight:'700'
                                                                                }}
                                                                    >{getFileName(instansiDetail.sk&&instansiDetail.sk.foto)}</div>
                                                                </div>
                                                            </div>
                                                        </Fragment>
                                                    :
                                                        <Fragment>
                                                            <div>
                                                                <label style={{textAlign:'left', clear:'both' , float:'left'}}>Sudah Terbentuk <br/> Gugus Tugas?</label>
                                                                <div style={{marginLeft:'210px'}}>
                                                                    {
                                                                        data.sk_status ?
                                                                        <Fragment>
                                                                            <label htmlFor="sudah" className='label-radio' style={{ marginRight: '65px' }}>Sudah
                                                                                <input type="radio" id="sudah" name="sk_status" className='input-radio' value={data.sk_status} checked={true} onChange={onChangeButton} />
                                                                                <span className='checked-radio'></span>
                                                                            </label>
                                                                            <label htmlFor="belum" className='label-radio'>Belum
                                                                                <input type="radio" id="belum" name="sk_status"  className='input-radio' value={data.sk_status} onChange={onChangeButtonFalse} />
                                                                                <span className='checked-radio'></span>
                                                                            </label>
                                                                        </Fragment>
                                                                        :
                                                                        <Fragment>
                                                                            <label htmlFor="sudah" className='label-radio' style={{ marginRight: '65px' }}>Sudah
                                                                                <input type="radio" id="sudah" name="sk_status" className='input-radio' value={data.sk_status} onChange={onChangeButton} />
                                                                                <span className='checked-radio'></span>
                                                                            </label>
                                                                            <label htmlFor="belum" className='label-radio' >Belum
                                                                                <input type="radio" id="belum" name="sk_status"  className='input-radio'value={data.sk_status} checked={true} onChange={onChangeButtonFalse} />
                                                                                <span className='checked-radio'></span>
                                                                            </label>
                                                                        </Fragment>
                                                                    }
                                                                </div>
                                                            </div>
                                                                {
                                                                    data.sk_status ?
                                                                    <Fragment>
                                                                        <div>
                                                                            <label>Input Nomor SK</label>
                                                                            <input
                                                                                className="gnrm-sasaran" 
                                                                                style={{height: "42px", 
                                                                                        marginLeft: '84px',
                                                                                        width: "767px",
                                                                                        fontWeight:'700'
                                                                                        }}
                                                                                type="text" 
                                                                                name="sk_no"
                                                                                value={data.sk_no}
                                                                                onChange={onChangeSK}
                                                                                required
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label>Lampiran SK</label>
                                                                            <label htmlFor='testing10' className='label_lampiran' style={{marginLeft: '110px'}}><span style={{marginRight:'15px'}}>+</span> PILIH BERKAS</label>
                                                                            <input 
                                                                                id="testing10"
                                                                                className="gnrm-penjelasan" 
                                                                                style={{height: "42px", 
                                                                                        marginLeft: "30px", 
                                                                                        width: "767px"}} 
                                                                                onChange={onChangeSKFile}
                                                                                type="file"
                                                                                accept="image/* , application/pdf"
                                                                                name="media"
                                                                            />
                                                                            </div>

                                                                            <div>
                                                                                        <div style={{height: "fit-content", 
                                                                                            marginLeft: "210px", 
                                                                                            width: "767px",
                                                                                            border: '1px solid #ACACAC',
                                                                                            borderRadius: '5px',
                                                                                            padding: '10px',
                                                                                            display: 'flex',
                                                                                            flexWrap: 'wrap',
                                                                                        }} 
                                                                                        >
                                                                                            {
                                                                                                skFile.map((lampiran,index) => {
                                                                                                    const fileExt = getFIleExtension(lampiran.name)
                                                                                                    const objectURL = URL.createObjectURL(lampiran)
                                                                                                    // cekEkstension(fileExt)
                                                                                                    return(
                                                                                                        <div key={index}>
                                                                                                                <div style={{width:'150px', 
                                                                                                                            height:'150px', 
                                                                                                                            marginRight:'35px', 
                                                                                                                            position:'relative'
                                                                                                                            }}
                                                                                                                    className="d-flex align-items-center justify-content-center"
                                                                                                                >
                                                                                                                    <div style={{width:'150px', height:'150px', overflow:'hidden', position:'absolute'}}>
                                                                                                                        {
                                                                                                                            fileExt === 'pdf' ? 
                                                                                                                                <img src={imgFile} alt={lampiran.name} style={{width:'150px' , height:'150px'}}className="gnrm-media--image" />
                                                                                                                            :
                                                                                                                                <img src={objectURL} alt={lampiran.name} className="gnrm-media--image" />
                                                                                                                        }
                                                                                                                    </div>
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
                                                                        </div>
                                                                    </Fragment>
                                                                    :
                                                                    <div>
                                                                        <label style={{textAlign:'right', clear:'both' , float:'left'}}>Kendala</label>
                                                                        <textarea 
                                                                            className="gnrm-nama-program" 
                                                                            style={{height: "300px", 
                                                                                    marginLeft: "140px", 
                                                                                    width: "767px"}} 
                                                                            type="text" 
                                                                            name="sk_kendala"
                                                                            value={data.sk_kendala}
                                                                            onChange={onChangeSK}
                                                                        />
                                                                    </div>
                                                                }
                                                            </Fragment>
                                                        }
                                                </Fragment>
                                             }
                                            </div>

                                            <div className="gnrm-navigation-button">
                                                <Link
                                                    to="identitas"
                                                    spy={true}
                                                    smooth={true}
                                                    duration={500}
                                                    offset={-30}
                                                >
                                                    <button className="previous1"><i className="material-icons">expand_less</i></button>
                                                </Link>
                                                <Link
                                                    to="kegiatan"
                                                    spy={true}
                                                    smooth={true}
                                                    duration={500}
                                                    offset={-30}
                                                >
                                                    <button className="forward1"><i className="material-icons">expand_more</i></button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Element>

                                    <Element id='kegiatan' name='kegiatan'>
                                        <div className="gnrm-container-off">
                                            <div className="gnrm-title">
                                                KEGIATAN
                                    </div>
                                            <div className="form-gnrm">
                                                <div>
                                                    <label>Nama Program</label>
                                                    <input
                                                        className="gnrm-nama-program"
                                                        style={{
                                                            height: "42px",
                                                            marginLeft: "93px",
                                                            width: "767px"
                                                        }}
                                                        type="text"
                                                        name="nama_program"
                                                        value={kegiatan.nama_program}
                                                        onChange={(event) => onChange(event, 'kegiatan')}
                                                    />
                                                </div>
                                                        <Fragment>
                                                            <div>
                                                                <label>Kegiatan Prioritas</label>
                                                                {
                                                                    documentDetail && documentDetail.form.kp ?
                                                                        <select
                                                                            onChange={onChange}
                                                                            class="gnrm-select"
                                                                            name="kp"
                                                                            style={{ marginLeft: '71px', width: '767px', height: '42px' }}
                                                                        >
                                                                            {
                                                                                kpOptions && kpOptions.map((kp, i) => <option key={i} selected={documentDetail.form.kp === kp && true} title={kp} value={kp}>{kp.length > 90 ? `${kp.substr(0, 87)}...` : kp}</option>)
                                                                            }
                                                                        </select> :
                                                                        <select
                                                                            onChange={onChange}
                                                                            class="gnrm-select"
                                                                            name="kp"
                                                                            style={{ marginLeft: '71px', width: '767px', height: '42px' }}
                                                                        >
                                                                            <option selected={true} hidden></option>
                                                                            {
                                                                                kpOptions && kpOptions.map((kp, i) => <option key={i} title={kp} value={kp}>{kp.length > 90 ? `${kp.substr(0, 87)}...` : kp}</option>)
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
                                                                            style={{ marginLeft: '84px' }}
                                                                        >
                                                                            {
                                                                                propOptions && propOptions.map((prop, i) => <option key={i} selected={documentDetail.form.prop === prop && true} title={prop} value={prop}>{prop.length > 73 ? `${prop.substr(0, 70)}...` : prop}</option>)
                                                                            }
                                                                            {!selectedKp && <option>{'Pilih Kegiatan Prioritas\n\nterlebih dahulu'}</option>}
                                                                        </select> :
                                                                        <select
                                                                            onChange={onChange}
                                                                            class="gnrm-select selectpicker"
                                                                            name="prop"
                                                                            style={{ marginLeft: '83px' }}
                                                                        >
                                                                            <option selected={true} hidden></option>
                                                                            {
                                                                                propOptions && propOptions.map((prop, i) => <option key={i} title={prop} value={prop}>{prop.length > 73 ? `${prop.substr(0, 70)}...` : prop}</option>)
                                                                            }
                                                                            {!selectedKp && <option>{'Pilih Kegiatan Prioritas\n\nterlebih dahulu'}</option>}
                                                                        </select>
                                                                }
                                                            </div>

                                                            {
                                                                selectedKp === 'Pusat-pusat Perubahan Revolusi Mental' &&
                                                                <Fragment>
                                                                    <div>
                                                                        <label>Gerakan</label>
                                                                        {
                                                                            isEditing && documentDetail.form.gerakan && Object.values(selectedGerakan).length > 0 ?
                                                                                <select
                                                                                    onChange={onChange}
                                                                                    class="gnrm-select"
                                                                                    name="gerakan-0"
                                                                                    style={{ marginLeft: '145px' }}
                                                                                >
                                                                                    <option value={selectedGerakan['gerakan-0']} defaultValue>{selectedGerakan['gerakan-0']}</option>
                                                                                    {
                                                                                        gerakanOptions && gerakanOptions.map((gerakan, i) => {
                                                                                            let alreadySelected = false
                                                                                            Object.values(selectedGerakan).forEach(selected => {
                                                                                                if (gerakan === selected) alreadySelected = true
                                                                                            });
                                                                                            return <option key={i} value={gerakan} selected={gerakan === selectedGerakan['gerakan-0'] ? true : false} hidden={alreadySelected}>{gerakan}</option>
                                                                                        })
                                                                                    }
                                                                                </select> :
                                                                                <select
                                                                                    onChange={onChangeGerakan}
                                                                                    class="gnrm-select"
                                                                                    name="gerakan-0"
                                                                                    style={{ marginLeft: '145px' }}
                                                                                >
                                                                                    <option selected={true} hidden></option>
                                                                                    {
                                                                                        gerakanOptions && gerakanOptions.map((gerakan, i) => {
                                                                                            let alreadySelected = false
                                                                                            Object.values(selectedGerakan).forEach(selected => {
                                                                                                if (gerakan === selected) alreadySelected = true
                                                                                            });
                                                                                            return <option key={i} value={gerakan} hidden={alreadySelected}>{gerakan}</option>
                                                                                        })
                                                                                    }
                                                                                </select>
                                                                        }
                                                                    </div>
                                                                    {
                                                                        isEditing && documentDetail.form.gerakan && Object.values(selectedGerakan).length > 0 ?
                                                                            Object.values(selectedGerakan)
                                                                                .filter(selected => selected !== selectedGerakan['gerakan-0'])
                                                                                .map((_, index) => {
                                                                                    return (
                                                                                        <div>
                                                                                            <label>Gerakan</label>
                                                                                            <select
                                                                                                onChange={onChangeGerakan}
                                                                                                class="gnrm-select"
                                                                                                name={`gerakan-${index + 1}`}
                                                                                                style={{ marginLeft: '145px' }}
                                                                                            >
                                                                                                <option value={_} defaultValue hidden={_ === '' ? true : false}>{_}</option>
                                                                                                {
                                                                                                    gerakanOptions && gerakanOptions.map((gerakan, i) => {
                                                                                                        let alreadySelected = false
                                                                                                        Object.values(selectedGerakan).forEach(selected => {
                                                                                                            if (gerakan === selected) alreadySelected = true
                                                                                                        });
                                                                                                        return <option key={i} value={gerakan} selected={gerakan === selectedGerakan[`gerakan-${index + 1}`]} hidden={alreadySelected}>{gerakan}</option>
                                                                                                    })
                                                                                                }
                                                                                            </select>
                                                                                            <span className="remove-form" onClick={() => onDeleteGerakanForm(index)}>
                                                                                                <i className=""> x </i>
                                                                                            </span>
                                                                                        </div>
                                                                                    )
                                                                                }) :
                                                                            formGerakan.map((form, index) => {
                                                                                return (
                                                                                    <div key={index}>
                                                                                        <label>Gerakan</label>
                                                                                        <select
                                                                                            onChange={onChangeGerakan}
                                                                                            class="gnrm-select"
                                                                                            name={`gerakan-${index + 1}`}
                                                                                            style={{ marginLeft: '145px' }}
                                                                                        >
                                                                                            <option selected={true} hidden></option>
                                                                                            {
                                                                                                gerakanOptions && gerakanOptions.map((gerakan, i) => {
                                                                                                    let alreadySelected = false
                                                                                                    Object.values(selectedGerakan).forEach(selected => {
                                                                                                        if (gerakan === selected) alreadySelected = true
                                                                                                    });
                                                                                                    return <option key={i} value={gerakan} hidden={alreadySelected} selected={gerakan === selectedGerakan[`gerakan-${index + 1}`]}>{gerakan}</option>
                                                                                                })
                                                                                            }
                                                                                        </select>
                                                                                        <span className="remove-form" onClick={() => onDeleteGerakanForm(index)}>
                                                                                            <i className=""> x </i>
                                                                                        </span>
                                                                                    </div>
                                                                                )
                                                                            })
                                                                    }
                                                                    {
                                                                        formGerakan.length < 4 ?
                                                                            <div>
                                                                                <label className="tambah-lembaga" >
                                                                                    Tambah Gerakan
                                                                            </label>
                                                                                <img src={plus2} style={{ position: 'absolute', marginTop: '-3px', marginLeft: '20px', cursor: 'pointer' }} onClick={addFormGerakan} />
                                                                            </div>
                                                                            : ''
                                                                    }
                                                                </Fragment>
                                                            }
                                                        </Fragment>
                                                <div>
                                                    <label style={{ textAlign: 'right', clear: 'both', float: 'left' }}>Penjelasan</label>
                                                    <textarea
                                                        className="gnrm-penjelasan"
                                                        style={{
                                                            height: "283px",
                                                            marginLeft: "127px",
                                                            width: "767px"
                                                        }}
                                                        type="text"
                                                        name="penjelasan_kegiatan"
                                                        value={kegiatan.penjelasan_kegiatan}
                                                        onChange={(event) => onChange(event, 'kegiatan')}
                                                    />
                                                </div>
                                            </div>

                                            <div className="gnrm-navigation-button">
                                                <Link
                                                    to="gugus_tugas"
                                                    spy={true}
                                                    smooth={true}
                                                    duration={500}
                                                    offset={-30}
                                                >
                                                    <button className="previous1"><i className="material-icons">expand_less</i></button>
                                                </Link>
                                                <Link
                                                    to="output"
                                                    spy={true}
                                                    smooth={true}
                                                    duration={500}
                                                    offset={-30}
                                                >
                                                    <button className="forward1"><i className="material-icons">expand_more</i></button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Element>

                                    <Element id='output' name='output'>
                                        <div className="gnrm-container-off" >
                                            <div className="gnrm-title">
                                                OUTPUT
                                        </div>
                                            <div className="form-gnrm">
                                                <div>
                                                    <label style={{ textAlign: 'right', clear: 'both', float: 'left' }}>Indikator Capaian</label>
                                                    <textarea
                                                        className="gnrm-indikator"
                                                        style={{
                                                            height: "150px",
                                                            marginLeft: "70px",
                                                            width: "767px"
                                                        }}
                                                        type="text"
                                                        name="indikator_capaian"
                                                        value={output.indikator_capaian}
                                                        onChange={(event) => onChange(event, 'output')}
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ textAlign: 'right', clear: 'both', float: 'left' }}>Sasaran</label>
                                                    <textarea
                                                        className="gnrm-sasaran"
                                                        style={{
                                                            height: "130px",
                                                            marginLeft: "149px",
                                                            width: "767px"
                                                        }}
                                                        type="text"
                                                        name="sasaran"
                                                        value={output.sasaran}
                                                        onChange={(event) => onChange(event, 'output')}

                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ textAlign: 'right', clear: 'both', float: 'left' }}>Target</label>
                                                    <textarea
                                                        className="gnrm-target"
                                                        style={{
                                                            height: "130px",
                                                            marginLeft: "161px",
                                                            width: "767px"
                                                        }}
                                                        type="text"
                                                        name="target"
                                                        value={output.target}
                                                        onChange={(event) => onChange(event, 'output')}
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
                                                    <button className="previous1"><i className="material-icons">expand_less</i></button>
                                                </Link>
                                                <Link
                                                    to="kondisi_awal"
                                                    spy={true}
                                                    smooth={true}
                                                    duration={500}
                                                    offset={-30}
                                                >
                                                    <button className="forward1"><i className="material-icons">expand_more</i></button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Element>

                                    <Element id='kondisi_awal' name='kondisi_awal'>
                                        <div className="gnrm-container-off">
                                            <div className="gnrm-title">
                                                KONDISI AWAL
                                        </div>
                                            <div className="form-gnrm">
                                                <div>
                                                    <label style={{ textAlign: 'right', clear: 'both', float: 'left' }}>Penjelasan</label>
                                                    <textarea
                                                        className="gnrm-penjelasan"
                                                        style={{
                                                            height: "300px",
                                                            marginLeft: "127px",
                                                            width: "767px"
                                                        }}
                                                        type="text"
                                                        name="kondisi_awal"
                                                        value={kondisi_awal}
                                                        onChange={(event) => onChange(event)}
                                                    />
                                                </div>
                                                <div>
                                                    <label>Lampiran Media</label>
                                                    <label htmlFor='testing2' className='label_lampiran'><span style={{ marginRight: '15px' }}>+</span> PILIH BERKAS</label>
                                                    <input
                                                        id="testing2"
                                                        className="gnrm-penjelasan"
                                                        style={{
                                                            height: "42px",
                                                            marginLeft: "28px",
                                                            width: "767px"
                                                        }}
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
                                                            <div style={{
                                                                height: "fit-content",
                                                                marginLeft: "208px",
                                                                width: "767px",
                                                                border: '1px solid #ACACAC',
                                                                borderRadius: '5px',
                                                                padding: '10px',
                                                                display: 'flex',
                                                                flexWrap: 'wrap',
                                                                overflow: 'hidden'
                                                            }}
                                                            >
                                                                {
                                                                    lampiranKondisi && lampiranKondisi.map((lampiran, index) => {
                                                                        const objectURL = URL.createObjectURL(lampiran)
                                                                        return (
                                                                            <div key={index}>
                                                                                <div style={{
                                                                                    width: '150px',
                                                                                    height: '150px',
                                                                                    backgroundColor: 'pink',
                                                                                    marginRight: '35px',
                                                                                    position: 'relative'
                                                                                }}
                                                                                    className="d-flex align-items-center justify-content-center"
                                                                                >
                                                                                    <div style={{ width: '150px', height: '150px', overflow: 'hidden', position: 'absolute' }}>
                                                                                        <img src={objectURL} alt={lampiran.name} className="gnrm-media--image" />
                                                                                    </div>
                                                                                    <div style={{
                                                                                        position: 'absolute',
                                                                                        backgroundColor: '#C04B3E',
                                                                                        width: '25px',
                                                                                        height: '25px',
                                                                                        borderRadius: '50%',
                                                                                        top: '-7px',
                                                                                        right: '-7px',
                                                                                        lineHeight: '25px',
                                                                                        textAlign: 'center',
                                                                                        cursor: 'pointer',
                                                                                        color: 'white'
                                                                                    }}
                                                                                        onClick={(e) => onDeleteKondisi(true, lampiran.name, lampiran)}> X </div>
                                                                                </div>
                                                                                <div style={{
                                                                                    marginTop: '10px',
                                                                                    width: '150px',
                                                                                    height: '20px',
                                                                                    wordWrap: 'break-word',
                                                                                    lineHeight: '20px',
                                                                                }}
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
                                                                <div style={{
                                                                    height: "fit-content",
                                                                    marginLeft: "208px",
                                                                    width: "767px",
                                                                    border: '1px solid #ACACAC',
                                                                    borderRadius: '5px',
                                                                    padding: '10px',
                                                                    display: 'flex',
                                                                    flexWrap: 'wrap',
                                                                    overflow: 'hidden'
                                                                }}
                                                                >
                                                                    {
                                                                        lampiranKondisiUrl && lampiranKondisiUrl.map((url, index) => {
                                                                            return (
                                                                                <div key={index}>
                                                                                    <div style={{
                                                                                        width: '150px',
                                                                                        height: '150px',
                                                                                        backgroundColor: 'pink',
                                                                                        marginRight: '35px',
                                                                                        position: 'relative'
                                                                                    }}
                                                                                        className="d-flex align-items-center justify-content-center"
                                                                                    >
                                                                                        <div style={{ width: '150px', height: '150px', overflow: 'hidden', position: 'absolute' }}>
                                                                                            <img src={url} alt={getFileName(url)} className="gnrm-media--image" />
                                                                                        </div>
                                                                                        <div style={{
                                                                                            position: 'absolute',
                                                                                            backgroundColor: '#C04B3E',
                                                                                            width: '25px',
                                                                                            height: '25px',
                                                                                            borderRadius: '50%',
                                                                                            top: '-7px',
                                                                                            right: '-7px',
                                                                                            lineHeight: '25px',
                                                                                            textAlign: 'center',
                                                                                            cursor: 'pointer'
                                                                                        }}
                                                                                            onClick={(e) => onDeleteKondisi(false, getFileName(url))}> X </div>
                                                                                    </div>
                                                                                    <div style={{
                                                                                        marginTop: '10px',
                                                                                        width: '150px',
                                                                                        height: '20px',
                                                                                        wordWrap: 'break-word',
                                                                                        lineHeight: '20px'
                                                                                    }}
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
                                                    <button className="previous1"><i className="material-icons">expand_less</i></button>
                                                </Link>
                                                <Link
                                                    to="anggaran"
                                                    spy={true}
                                                    smooth={true}
                                                    duration={500}
                                                    offset={-30}
                                                >
                                                    <button className="forward1"><i className="material-icons">expand_more</i></button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Element>

                                    <Element id='anggaran' name='anggaran'>
                                        <div className="gnrm-container-off">
                                            <div className="gnrm-title">
                                                ANGGARAN
                                        </div>
                                            <div className="form-gnrm">
                                                <div>
                                                    <label>Sumber Pendanaan</label>
                                                    <input
                                                        className="gnrm-pendanaan"
                                                        style={{
                                                            height: "42px",
                                                            marginLeft: "59px",
                                                            width: "767px"
                                                        }}
                                                        type="text"
                                                        name="sumber_dana"
                                                        value={anggaran.sumber_dana}
                                                        onChange={(event) => onChange(event, 'anggaran')}
                                                    />
                                                </div>
                                                <div>
                                                    <label>Besaran Anggaran</label>
                                                    <input
                                                        className="gnrm-anggaran"
                                                        style={{
                                                            height: "42px",
                                                            marginLeft: "69px",
                                                            width: "767px"
                                                        }}
                                                        placeholder="Rp..."
                                                        type="text"
                                                        name="besar_anggaran"
                                                        value={anggaran.besar_anggaran}
                                                        onChange={(event) => onChange(event, 'anggaran')}
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
                                                    <button className="previous1"><i className="material-icons">expand_less</i></button>
                                                </Link>
                                                <Link
                                                    to="proses"
                                                    spy={true}
                                                    smooth={true}
                                                    duration={500}
                                                    offset={-30}
                                                >
                                                    <button className="forward1"><i className="material-icons">expand_more</i></button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Element>

                                    <Element id='proses' name='proses'>
                                        <div className="gnrm-container-off">
                                            <div className="gnrm-title">
                                                PROSES PERKEMBANGAN PELAKSANAAN KEGIATAN
                                    </div>
                                            <div className="form-gnrm">
                                                <div>
                                                    <label style={{ textAlign: 'left', clear: 'both', float: 'left' }}>Mekanisme Pelaksanaan <br />Kegiatan</label>
                                                    <textarea
                                                        className="gnrm-penjelasan"
                                                        style={{
                                                            height: "400px",
                                                            marginLeft: "15px",
                                                            width: "767px"
                                                        }}
                                                        type="text"
                                                        name="proses"
                                                        value={proses}
                                                        onChange={(event) => onChange(event)}
                                                    />
                                                </div>
                                                <div>
                                                    <label>Lampiran Media</label>
                                                    <label htmlFor='testing3' className='label_lampiran'><span style={{ marginRight: '15px' }}>+</span> PILIH BERKAS</label>
                                                    <input
                                                        id="testing3"
                                                        className="gnrm-penjelasan"
                                                        style={{
                                                            height: "42px",
                                                            marginLeft: "28px",
                                                            width: "767px"
                                                        }}
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
                                                            <div style={{
                                                                height: "fit-content",
                                                                marginLeft: "208px",
                                                                width: "767px",
                                                                border: '1px solid #ACACAC',
                                                                borderRadius: '5px',
                                                                padding: '10px',
                                                                display: 'flex',
                                                                flexWrap: 'wrap',
                                                                overflow: 'hidden'
                                                            }}
                                                            >
                                                                {
                                                                    lampiranProses && lampiranProses.map((lampiran, index) => {
                                                                        const objectURL = URL.createObjectURL(lampiran)
                                                                        return (
                                                                            <div key={index}>
                                                                                <div style={{
                                                                                    width: '150px',
                                                                                    height: '150px',
                                                                                    backgroundColor: 'pink',
                                                                                    marginRight: '35px',
                                                                                    position: 'relative'
                                                                                }}
                                                                                    className="d-flex align-items-center justify-content-center"
                                                                                >
                                                                                    <div style={{ width: '150px', height: '150px', overflow: 'hidden', position: 'absolute' }}>
                                                                                        <img src={objectURL} alt={lampiran.name} className="gnrm-media--image" />
                                                                                    </div>
                                                                                    <div style={{
                                                                                        position: 'absolute',
                                                                                        backgroundColor: '#C04B3E',
                                                                                        width: '25px',
                                                                                        height: '25px',
                                                                                        borderRadius: '50%',
                                                                                        top: '-7px',
                                                                                        right: '-7px',
                                                                                        lineHeight: '25px',
                                                                                        textAlign: 'center',
                                                                                        cursor: 'pointer',
                                                                                        color: 'white'
                                                                                    }}
                                                                                        onClick={(e) => onDeleteProses(true, lampiran.name, lampiran)}> X </div>
                                                                                </div>
                                                                                <div style={{
                                                                                    marginTop: '10px',
                                                                                    width: '150px',
                                                                                    height: '20px',
                                                                                    wordWrap: 'break-word',
                                                                                    lineHeight: '20px',
                                                                                }}
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
                                                                <div style={{
                                                                    height: "fit-content",
                                                                    marginLeft: "208px",
                                                                    width: "767px",
                                                                    border: '1px solid #ACACAC',
                                                                    borderRadius: '5px',
                                                                    padding: '10px',
                                                                    display: 'flex',
                                                                    flexWrap: 'wrap',
                                                                    overflow: 'hidden'
                                                                }}
                                                                >
                                                                    {
                                                                        lampiranProsesUrl && lampiranProsesUrl.map((url, index) => {
                                                                            return (
                                                                                <div key={index}>
                                                                                    <div style={{
                                                                                        width: '150px',
                                                                                        height: '150px',
                                                                                        backgroundColor: 'pink',
                                                                                        marginRight: '35px',
                                                                                        position: 'relative'
                                                                                    }}
                                                                                        className="d-flex align-items-center justify-content-center"
                                                                                    >
                                                                                        <div style={{ width: '150px', height: '150px', overflow: 'hidden', position: 'absolute' }}>
                                                                                            <img src={url} alt={getFileName(url)} className="gnrm-media--image" />
                                                                                        </div>
                                                                                        <div style={{
                                                                                            position: 'absolute',
                                                                                            backgroundColor: '#C04B3E',
                                                                                            width: '25px',
                                                                                            height: '25px',
                                                                                            borderRadius: '50%',
                                                                                            top: '-7px',
                                                                                            right: '-7px',
                                                                                            lineHeight: '25px',
                                                                                            textAlign: 'center',
                                                                                            cursor: 'pointer'
                                                                                        }}
                                                                                            onClick={(e) => onDeleteProses(false, getFileName(url))}> X </div>
                                                                                    </div>
                                                                                    <div style={{
                                                                                        marginTop: '10px',
                                                                                        width: '150px',
                                                                                        height: '20px',
                                                                                        wordWrap: 'break-word',
                                                                                        lineHeight: '20px'
                                                                                    }}
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
                                                    <button className="previous1"><i className="material-icons">expand_less</i></button>
                                                </Link>
                                                <Link
                                                    to="pihak_terkait"
                                                    spy={true}
                                                    smooth={true}
                                                    duration={500}
                                                    offset={-30}
                                                >
                                                    <button className="forward1"><i className="material-icons">expand_more</i></button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Element>

                                    <Element name='pihak_terkait' id='pihak_terkait'>
                                        <div className="gnrm-container-off">
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
                                                                    style={{
                                                                        height: "42px",
                                                                        marginLeft: "57px",
                                                                        width: "767px"
                                                                    }}
                                                                    type="text"
                                                                    name="peran"
                                                                    value={data.pihak_terkait.peran}
                                                                    onChange={(event) => onChange(event, 'pihak_terkait', true, 0)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label>Lembaga Terkait</label>
                                                                <input
                                                                    className="gnrm-terkait"
                                                                    style={{
                                                                        height: "42px",
                                                                        marginLeft: "80px",
                                                                        width: "767px"
                                                                    }}
                                                                    type="text"
                                                                    name="lembaga"
                                                                    value={data.pihak_terkait.lembaga}
                                                                    onChange={(event) => onChange(event, 'pihak_terkait', true, 0)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label style={{ textAlign: 'right', clear: 'both', float: 'left' }}>Penjelasan</label>
                                                                <textarea
                                                                    className="gnrm-penjelasan"
                                                                    style={{
                                                                        height: "400px",
                                                                        marginLeft: "127px",
                                                                        width: "767px"
                                                                    }}
                                                                    type="text"
                                                                    name="penjelasan_pihak_terkait"
                                                                    value={data.pihak_terkait.penjelasan_pihak_terkait}
                                                                    onChange={(event) => onChange(event, 'pihak_terkait', true, 0)}
                                                                />
                                                            </div>
                                                        </Fragment>
                                                        :
                                                        documentDetail&&documentDetail.form.pihak_terkait.map((pihak, index) => {
                                                            return (
                                                                <Fragment key={index}>
                                                                    <div>
                                                                        <label>Peran Pihak Terkait</label>
                                                                        <input
                                                                            className="gnrm-terkait"
                                                                            style={{
                                                                                height: "42px",
                                                                                marginLeft: "57px",
                                                                                width: "767px"
                                                                            }}
                                                                            type="text"
                                                                            name="peran"
                                                                            value={data.pihak_terkait[index] && data.pihak_terkait[index].peran}
                                                                            onChange={(event) => onChange(event, 'pihak_terkait', true, index)}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label>Lembaga Terkait</label>
                                                                        <input
                                                                            className="gnrm-terkait"
                                                                            style={{
                                                                                height: "42px",
                                                                                marginLeft: "80px",
                                                                                width: "767px"
                                                                            }}
                                                                            type="text"
                                                                            name="lembaga"
                                                                            value={data.pihak_terkait[index] && data.pihak_terkait[index].lembaga}
                                                                            onChange={(event) => onChange(event, 'pihak_terkait', true, index)}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label style={{ textAlign: 'right', clear: 'both', float: 'left' }}>Penjelasan</label>
                                                                        <textarea
                                                                            className="gnrm-penjelasan"
                                                                            style={{
                                                                                height: "400px",
                                                                                marginLeft: "127px",
                                                                                width: "767px"
                                                                            }}
                                                                            type="text"
                                                                            name="penjelasan_pihak_terkait"
                                                                            value={data.pihak_terkait[index] && data.pihak_terkait[index].penjelasan_pihak_terkait}
                                                                            onChange={(event) => onChange(event, 'pihak_terkait', true, index)}
                                                                        />
                                                                    </div>
                                                                </Fragment>
                                                            )
                                                        })
                                                }
                                                {
                                                    form.map((form, index) => {
                                                        return (
                                                            <Fragment key={index + panjang}>
                                                                <div>
                                                                    <label>Peran Pihak Terkait</label>
                                                                    <input
                                                                        className="gnrm-terkait"
                                                                        style={{
                                                                            height: "42px",
                                                                            marginLeft: "57px",
                                                                            width: "767px"
                                                                        }}
                                                                        type="text"
                                                                        name="peran"
                                                                        value={data.pihak_terkait.peran}
                                                                        onChange={(event) => onChange(event, 'pihak_terkait', true, index + panjang)}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label>Lembaga Terkait</label>
                                                                    <input
                                                                        className="gnrm-terkait"
                                                                        style={{
                                                                            height: "42px",
                                                                            marginLeft: "80px",
                                                                            width: "767px"
                                                                        }}
                                                                        type="text"
                                                                        name="lembaga"
                                                                        value={data.pihak_terkait.lembaga}
                                                                        onChange={(event) => onChange(event, 'pihak_terkait', true, index + panjang)}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label style={{ textAlign: 'right', clear: 'both', float: 'left' }}>Penjelasan</label>
                                                                    <textarea
                                                                        className="gnrm-penjelasan"
                                                                        style={{
                                                                            height: "400px",
                                                                            marginLeft: "127px",
                                                                            width: "767px"
                                                                        }}
                                                                        type="text"
                                                                        name="penjelasan_pihak_terkait"
                                                                        value={data.pihak_terkait.penjelasan_pihak_terkait}
                                                                        onChange={(event) => onChange(event, 'pihak_terkait', true, index + panjang)}
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
                                                <img src={plus2} style={{ position: 'absolute', marginTop: '-3px', marginLeft: '20px', cursor: 'pointer' }} onClick={addForm} />
                                            </div>


                                            <div className="gnrm-navigation-button">
                                                <Link
                                                    to="proses"
                                                    spy={true}
                                                    smooth={true}
                                                    duration={500}
                                                    offset={-30}
                                                >
                                                    <button className="previous1"><i className="material-icons" style={{ fontSize: '36px' }}>expand_less</i></button>
                                                </Link>

                                                <Link
                                                    to="lampiran"
                                                    spy={true}
                                                    smooth={true}
                                                    duration={500}
                                                    offset={-30}
                                                >
                                                    <button className="forward1"><i className="material-icons" style={{ fontSize: '36px' }}>expand_more</i></button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Element>

                                    <Element id='lampiran' name='lampiran'>
                                        <div className="gnrm-container-off">
                                            <div className="gnrm-title">
                                                LAMPIRAN MEDIA
                                    </div>
                                            <div className="form-gnrm">
                                                <div>
                                                    <label>Lampiran Media</label>
                                                    <label htmlFor='testing' className='label_lampiran'><span style={{ marginRight: '15px' }}>+</span> PILIH BERKAS</label>
                                                    <input
                                                        id="testing"
                                                        className="gnrm-penjelasan"
                                                        style={{
                                                            height: "42px",
                                                            marginLeft: "28px",
                                                            width: "767px"
                                                        }}
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
                                                            <div style={{
                                                                height: "fit-content",
                                                                marginLeft: "208px",
                                                                width: "767px",
                                                                border: '1px solid #ACACAC',
                                                                borderRadius: '5px',
                                                                padding: '10px',
                                                                display: 'flex',
                                                                flexWrap: 'wrap',
                                                                overflow: 'hidden'
                                                            }}
                                                            >
                                                                {
                                                                    media && media.map((media, index) => {
                                                                        const objectURL = URL.createObjectURL(media)
                                                                        return (
                                                                            <div key={index}>
                                                                                <div style={{
                                                                                    width: '150px',
                                                                                    height: '150px',
                                                                                    backgroundColor: 'pink',
                                                                                    marginRight: '35px',
                                                                                    position: 'relative'
                                                                                }}
                                                                                    className="d-flex align-items-center justify-content-center"
                                                                                >
                                                                                    <div style={{ width: '150px', height: '150px', overflow: 'hidden', position: 'absolute' }}>
                                                                                        <img src={objectURL} alt={media.name} className="gnrm-media--image" />
                                                                                    </div>
                                                                                    <div style={{
                                                                                        position: 'absolute',
                                                                                        backgroundColor: '#C04B3E',
                                                                                        width: '25px',
                                                                                        height: '25px',
                                                                                        borderRadius: '50%',
                                                                                        top: '-7px',
                                                                                        right: '-7px',
                                                                                        lineHeight: '25px',
                                                                                        textAlign: 'center',
                                                                                        cursor: 'pointer',
                                                                                        color: 'white'
                                                                                    }}
                                                                                        onClick={(e) => onDeleteMedia(true, media.name, media)}> X </div>
                                                                                </div>
                                                                                <div style={{
                                                                                    marginTop: '10px',
                                                                                    width: '150px',
                                                                                    height: '20px',
                                                                                    wordWrap: 'break-word',
                                                                                    lineHeight: '20px',
                                                                                }}
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
                                                                <div style={{
                                                                    height: "fit-content",
                                                                    marginLeft: "208px",
                                                                    width: "767px",
                                                                    border: '1px solid #ACACAC',
                                                                    borderRadius: '5px',
                                                                    padding: '10px',
                                                                    display: 'flex',
                                                                    flexWrap: 'wrap',
                                                                    overflow: 'hidden'
                                                                }}
                                                                >
                                                                    {
                                                                        mediaUrl && mediaUrl.map((url, index) => {
                                                                            return (
                                                                                <div key={index}>
                                                                                    <div style={{
                                                                                        width: '150px',
                                                                                        height: '150px',
                                                                                        backgroundColor: 'pink',
                                                                                        marginRight: '35px',
                                                                                        position: 'relative'
                                                                                    }}
                                                                                        className="d-flex align-items-center justify-content-center"
                                                                                    >
                                                                                        <div style={{ width: '150px', height: '150px', overflow: 'hidden', position: 'absolute' }}>
                                                                                            <img src={url} alt={getFileName(url)} className="gnrm-media--image" />
                                                                                        </div>
                                                                                        <div style={{
                                                                                            position: 'absolute',
                                                                                            backgroundColor: '#C04B3E',
                                                                                            width: '25px',
                                                                                            height: '25px',
                                                                                            borderRadius: '50%',
                                                                                            top: '-7px',
                                                                                            right: '-7px',
                                                                                            lineHeight: '25px',
                                                                                            textAlign: 'center',
                                                                                            cursor: 'pointer'
                                                                                        }}
                                                                                            onClick={(e) => onDeleteMedia(false, getFileName(url))}> X </div>
                                                                                    </div>
                                                                                    <div style={{
                                                                                        marginTop: '10px',
                                                                                        width: '150px',
                                                                                        height: '20px',
                                                                                        wordWrap: 'break-word',
                                                                                        lineHeight: '20px'
                                                                                    }}
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
                                                    <button className="previous1"><i className="material-icons">expand_less</i></button>
                                                </Link>
                                                <Link
                                                    to="penanggung_jawab"
                                                    spy={true}
                                                    smooth={true}
                                                    duration={500}
                                                    offset={-30}
                                                >
                                                    <button className="forward1"><i className="material-icons">expand_more</i></button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Element>

                                    <Element id='penanggung_jawab' name='penanggung_jawab'>
                                        <div className="gnrm-container-off" style={{ marginBottom: "130px" }}>
                                            <div className="form-gnrm">
                                                <div>
                                                    <label>Nama</label>
                                                    <input
                                                        className="gnrm-eselon"
                                                        style={{
                                                            height: "42px",
                                                            marginLeft: "164px",
                                                            width: "403px"
                                                        }}
                                                        type="text"
                                                        name="nama"
                                                        value={penanggung_jawab.nama}
                                                        onChange={(event) => onChange(event, 'penanggung_jawab')}

                                                    />
                                                </div>
                                                <div>
                                                    <label>Jabatan</label>
                                                    <input
                                                        className="gnrm-nip"
                                                        style={{
                                                            height: "42px",
                                                            marginLeft: "151px",
                                                            width: "403px"
                                                        }}
                                                        type="text"
                                                        name="jabatan"
                                                        value={penanggung_jawab.jabatan}
                                                        onChange={(event) => onChange(event, 'penanggung_jawab')}

                                                    />
                                                </div>
                                                <div>
                                                    <label>NIP</label>
                                                    <input
                                                        className="gnrm-lampiran"
                                                        style={{
                                                            height: "42px",
                                                            marginLeft: "183px",
                                                            width: "403px"
                                                        }}

                                                        type="text"
                                                        name="nip"
                                                        value={penanggung_jawab.nip}
                                                        onChange={(event) => onChange(event, 'penanggung_jawab')}
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
                                                    <button className="previous-last-11"><i className="material-icons">expand_less</i></button>
                                                </Link>

                                                <button className="simpan-gnrm" type='submit' >SIMPAN PERUBAHAN</button>

                                                <button className="preview-gnrm" onClick={setPreview}>PRATINJAU LAPORAN</button>

                                            </div>
                                        </div>
                                    </Element>
                                </form>                            
                        }
                        </div>
                }
            </div>
            {/* -------------------------- FORM SECTION END HERE ---------------------------------*/}

            {/* -------------------------- PREVIEW SECTION START HERE ---------------------------------*/}
            <div className={isPreviewing ? "preview-page" : "d-none"} style={{ width: 'fit-content', height: 'fit-content', margin: 'auto' }}>
                <div className="title-preview-page">
                    PREVIEW RENCANA PELAKSANAAN PROGRAM
                    </div>
                    {
                        loading ?
                        <div style={{ marginLeft: '68px' }}>
                            <div className="d-flex justify-content-center align-items-center" style={{ width: '100%', height: '60vh', overflow: 'hidden' }}>
                                <Spinner />
                            </div>
                        </div>
                        :
                        <div style={sidebar ? {marginLeft:'188px' , transition: 'all 0.3s ease-in-out'} : {transition: 'all 0.3s ease-in-out'}}>
                            <div className="preview-picture" style={{ padding: '43px 98px' , marginLeft:'84px' , marginRight: '20px'}}>
                    <div className="preview-header">
                        <table>
                            <thead>
                                <tr>
                                    <th width='105px'></th>
                                    <th width='800px'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    instansiDocumentDetail ?
                                        <tr style={{fontSize:"12px" , height: 'fit-content'}} >
                                            <td style={{position:'relative' , width:'105px' , textAlign:'center'}}>
                                                    <img src={`https://api.simonev.revolusimental.go.id${instansiDocumentDetail&&instansiDocumentDetail.logo}`} style={{ maxWidth: "93%", height:'100%', position: 'absolute' , left: '0' , objectFit:'contain' }} />
                                            </td>
                                            <td>
                                                <h1 style={{ lineHeight: '16px', fontWeight: 'bold' }}>Gerakan Nasional Revolusi Mental</h1>
                                                <h1 style={{ lineHeight: '16px', fontWeight: 'bold' }}>Sekretariat</h1>
                                                <h1 style={{ lineHeight: '16px' , width: '750px'}}>{instansiDocumentDetail&&instansiDocumentDetail.alamat}<br />
                                                        Telp {instansiDocumentDetail&&instansiDocumentDetail.kontak}; Fax {instansiDocumentDetail&&instansiDocumentDetail.fax}; <br />
                                                        website : {instansiDocumentDetail&&instansiDocumentDetail.website}, email: {instansiDocumentDetail&&instansiDocumentDetail.email}</h1>
                                            </td>
                                        </tr>
                                    :
                                        <tr style={{fontSize:"12px" , height: 'fit-content'}} >
                                            <td style={{position:'relative' , width:'105px' , textAlign:'center'}}>
                                                    <img src={`https://api.simonev.revolusimental.go.id${instansiDetail&&instansiDetail.logo}`} style={{ maxWidth: "93%", height:'100%', position: 'absolute' , objectFit:'contain' , left: '0' }} />
                                            </td>
                                            <td>
                                                <h1 style={{ lineHeight: '16px', fontWeight: 'bold' }}>Gerakan Nasional Revolusi Mental</h1>
                                                <h1 style={{ lineHeight: '16px', fontWeight: 'bold' }}>Sekretariat</h1>
                                                <h1 style={{ lineHeight: '16px' , width: '750px'}}>{instansiDetail&&instansiDetail.alamat}<br />
                                                        Telp {instansiDetail&&instansiDetail.kontak}; Fax {instansiDetail&&instansiDetail.fax}; <br />
                                                        website : {instansiDetail&&instansiDetail.website}, email: {instansiDetail&&instansiDetail.email}</h1>
                                            </td>
                                        </tr>
                                }
                            </tbody>
                        </table>
                        <hr style={{ backgroundColor: 'black' }} />
                        <br />
                        <div className="judul-preview" style={{ textAlign: "center", fontSize: '12px' }}>
                            <h1 style={{ lineHeight: '25px', fontWeight: 'bold' }}>
                                Proteksi Input Program Gerakan Nasioal Revolusi Mental (GNRM) Tahun
                                    <span> {data.tahun}</span>
                            </h1>

                            <h1 style={{ lineHeight: '15px' }}>Dilarang menyalin, menyimpan, memperbanyak sebagian atau seluruh isi laporan ini dalam bentuk <br /> apapun kecuali oleh Koordinator Pelaksana Gerakan (KPG) dan Sekretariat Revolusi Mental</h1><br />

                            <h1 style={{ lineHeight: '35px', fontWeight: 'bold' }}>
                                PROGRAM PELAKSANAAN GNRM
                                    <span > {data.tahun}</span>
                            </h1>

                            <h1 style={{ lineHeight: '15px' }}>
                                ID Laporan :
                                    <span > {data.id_program}</span>
                            </h1>

                            <h1 style={{ lineHeight: '15px' }}>
                                Program
                                    <span > {documentDetail && documentDetail.instansi} </span>
                                    GNRM TAHUN
                                    <span > {data.tahun}</span>
                            </h1>
                        </div>
                    </div>

                    <div className="preview-body" style={{ margin: '20px auto 0', width: '1042px', fontSize: '12px', lineHeight: '16px' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th width="54px"></th>
                                    <th width="997px"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td style={{ paddingTop: '12px', paddingBottom: '32px' }}>Waktu Unggah : {str}</td>
                                </tr>
                                <tr style={{ fontWeight: 'bold' }}>
                                    <td>1.</td>
                                    <td >Instansi</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    {
                                        instansiDocumentDetail ?
                                        <td style={{ paddingTop: '12px', paddingBottom: '32px' }}>{instansiDocumentDetail && instansiDocumentDetail.nama}</td>
                                        :
                                        <td style={{ paddingTop: '12px', paddingBottom: '32px' }}>{instansiDetail && instansiDetail.nama}</td>
                                    }
                                </tr>
                                <tr style={{ fontWeight: 'bold' }}>
                                    <td>2.</td>
                                    <td>Kegiatan</td>
                                </tr>
                                <tr>
                                    <td></td>
                                            <td style={{ paddingTop: '12px', paddingBottom: '32px' }}>
                                                Nama Program : {data.kegiatan.nama_program}<br />
                                                        Kegiatan Prioritas : {data.kp}<br />
                                                        Program Prioritas: {data.prop}<br />
                                                Penjelasan : {data.kegiatan.penjelasan_kegiatan}
                                            </td>

                                </tr>
                                <tr style={{ fontWeight: 'bold' }}>
                                    <td>3.</td>
                                    <td>Output</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td style={{ paddingTop: '12px', paddingBottom: '32px' }}>
                                        {data.output.indikator_capaian} <br />
                                        {data.output.sasaran} <br />
                                        {data.output.target}
                                    </td>
                                </tr>
                                <tr style={{ fontWeight: 'bold' }}>
                                    <td>4.</td>
                                    <td>Kondisi Awal</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td style={{ paddingTop: '12px', paddingBottom: '32px' }}>
                                        {data.kondisi_awal}<br />

                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td style={{ paddingTop: '12px', paddingBottom: '32px' }}>
                                        <div style={{
                                            height: "fit-content",
                                            width: "955px",
                                            borderRadius: '5px',
                                            padding: '10px',
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            overflow: 'hidden'
                                        }}
                                        >
                                            {
                                                lampiranKondisi && lampiranKondisi.map((lampiran,index) => {
                                                const objectURL = URL.createObjectURL(lampiran)
                                                return(
                                                    <div key={index}>
                                                        <div style={{
                                                            width: '420px',
                                                            height: '420px',
                                                            marginRight: '35px',
                                                            position: 'relative'
                                                        }}
                                                            className="d-flex align-items-center justify-content-center"
                                                        >
                                                            <div style={{ width: '420px', height: '420px', overflow: 'hidden', position: 'relative' }}>
                                                                <img src={objectURL} alt={lampiran.name} style={{ width: '420px', height: '420px' , objectFit:'contain'}} />
                                                            </div>
                                                        </div>
                                                        <div style={{
                                                            marginTop: '10px',
                                                            width: '420px',
                                                            height: '20px',
                                                            wordWrap: 'break-word',
                                                            lineHeight: '20px',
                                                        }}
                                                        >
                                                            <p className="gnrm-media--name" style={{textAlign:'center'}}>
                                                                {lampiran.name.length > 40 ? `${lampiran.name.substr(0, 37)}...` : lampiran.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )  
                                                })
                                            }
                                        </div>
                                    </td>
                                </tr>
                                <tr style={{ fontWeight: 'bold' }}>
                                    <td>5.</td>
                                    <td>Anggaran</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td style={{ paddingTop: '12px', paddingBottom: '32px' }}>
                                        {data.anggaran.besar_anggaran}
                                    </td>
                                </tr>
                                <tr style={{ fontWeight: 'bold' }}>
                                    <td>6.</td>
                                    <td>Proses Perkembangan Pelaksaan Kegiatan</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td style={{ paddingTop: '12px', paddingBottom: '32px' }}>
                                        {data.proses}
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td style={{ paddingTop: '12px', paddingBottom: '32px' }}>
                                        <div style={{
                                            height: "fit-content",
                                            width: "955px",
                                            borderRadius: '5px',
                                            padding: '10px',
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            overflow: 'hidden'
                                        }}
                                        >
                                            {
                                                lampiranProses && lampiranProses.map((lampiran,index) => {
                                                    const objectURL = URL.createObjectURL(lampiran)
                                                return(
                                                    <div key={index}>
                                                        <div style={{
                                                            width: '420px',
                                                            height: '420px',
                                                            marginRight: '35px',
                                                            position: 'relative'
                                                        }}
                                                            className="d-flex align-items-center justify-content-center"
                                                        >
                                                            <div style={{ width: '420px', height: '420px', overflow: 'hidden', position: 'relative' }}>
                                                                <img src={objectURL} alt={lampiran.name} style={{ width: '420px', height: '420px' , objectFit:'contain'}} />
                                                            </div>
                                                        </div>
                                                        <div style={{
                                                            marginTop: '10px',
                                                            width: '420px',
                                                            height: '20px',
                                                            wordWrap: 'break-word',
                                                            lineHeight: '20px',
                                                        }}
                                                        >
                                                            <p className="gnrm-media--name" style={{textAlign:'center'}}>
                                                                {lampiran.name.length > 40 ? `${lampiran.name.substr(0, 37)}...` : lampiran.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )  
                                                })
                                            }
                                        </div>
                                    </td>
                                </tr>
                                <tr style={{ fontWeight: 'bold' }}>
                                    <td>7.</td>
                                    <td>Pihak Terkait</td>
                                </tr>
                                {
                                    documentDetail ?
                                        (documentDetail && documentDetail.form.pihak_terkait).map((pihak, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td></td>
                                                    <td style={{ paddingTop: '12px', paddingBottom: '32px' }}>
                                                        {data.pihak_terkait[index] && data.pihak_terkait[index].lembaga} , {data.pihak_terkait[index] && data.pihak_terkait[index].penjelasan_pihak_terkait} , {data.pihak_terkait[index] && data.pihak_terkait[index].peran}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                        :
                                        ''
                                }
                                <tr style={{ fontWeight: 'bold' }}>
                                    <td>8.</td>
                                    <td>Lampiran Media</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td style={{ paddingTop: '12px', paddingBottom: '32px' }}>
                                        <div style={{
                                            height: "fit-content",
                                            width: "955px",
                                            borderRadius: '5px',
                                            padding: '10px',
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            overflow: 'hidden'
                                        }}
                                        >
                                            {
                                                media && media.map((lampiran,index) => {
                                                const objectURL = URL.createObjectURL(lampiran)
                                                return(
                                                    <div key={index}>
                                                        <div style={{
                                                            width: '420px',
                                                            height: '420px',
                                                            marginRight: '35px',
                                                            position: 'relative'
                                                        }}
                                                            className="d-flex align-items-center justify-content-center"
                                                        >
                                                            <div style={{ width: '420px', height: '420px', overflow: 'hidden', position: 'relative' }}>
                                                                <img src={objectURL} alt={lampiran.name} style={{ width: '420px', height: '420px' , objectFit:'contain'}} />
                                                            </div>
                                                        </div>
                                                        <div style={{
                                                            marginTop: '10px',
                                                            width: '420px',
                                                            height: '20px',
                                                            wordWrap: 'break-word',
                                                            lineHeight: '20px',
                                                        }}
                                                        >
                                                            <p className="gnrm-media--name" style={{textAlign:'center'}}>
                                                                {lampiran.name.length > 40 ? `${lampiran.name.substr(0, 37)}...` : lampiran.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )  
                                                })
                                            }
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td style={{ paddingTop: '154px' }}>
                                        Demikian program ini dibuat dan dapat dikoordinasikan untuk dilaksanakan sebagaimana mestinya. <br />
                                            Atas perhatiannya diucapkan terimakasih.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="preview-ttd" style={{ marginTop: '10px', fontSize: '12px' }}>
                        <div style={{ textAlign: 'left', marginLeft: '893px' }}>
                            <h1>..................., ...................</h1><br />
                            <h1>{data.penanggung_jawab.nama}</h1>
                            <br />
                            <br />
                            <br />
                            <h1>TTD</h1>
                            <h1>NIP. {data.penanggung_jawab.nip}</h1>
                        </div>
                    </div>
                    <hr style={{ backgroundColor: 'black', marginTop: '64px' }} />
                    <div className="preview-footer" style={{ marginBottom: '119px' }}>
                        <div style={{ textAlign: 'left' }}>
                            <img src={logo_footer} />
                        </div>
                        <div className='spacer'></div>
                        <div style={{ textAlign: 'right' }}>
                            <img src={logo_footer} />
                        </div>
                    </div>



                    <button className="button-edit-kembali" onClick={setPreview}>SUNTING KEMBALI</button>

                    <button className="button-unggah" type='submit' form='form-gnrm'>UNGGAH LAPORAN</button>
                </div>
                        </div>
                    }
            </div>
            {/* -------------------------- PREVIEW SECTION START HERE ---------------------------------*/}
        </Fragment >
    );
}

export default FormGNRM;