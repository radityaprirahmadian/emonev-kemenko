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
import Spinner from '../../component/Spinner/Spinner'

const FormMonev =  (props) => {
    const { documentDetail, getDocumentDetail, resetDocument, isEditing, editDocumentFalse, isPreviewing, preview, loading,setLoadingFalse, setLoadingTrue } = useContext(ArtikelContext)
    const { token,userDetail } = useContext(AuthContext)
    const history = useHistory()
    const Link = Scroll.Link
    const id = props.match.params.id
    const type = 'monev'

    const [instansi,setInstansi] = useState('')
    const pilihanTahun = ['2020','2021','2022','2023']
    const pilihanPeriode = ['Tahunan', 'Caturwulanan']

    const [ instansiDetail , setInstansiDetail] = useState({})
    console.log(instansiDetail)

    useEffect(() => {
        const getInstansiDetail = async () => {
            const config = {
                headers: {
                    'X-Auth-Token': `aweuaweu ${token}`,
                }
            }
            try {
                const res = await axios.get(`https://test.bariqmbani.me/api/v1/instansi/${userDetail && userDetail.instansi._id}`,config)
                setInstansiDetail(res.data.instansi)
            }
            catch (err) {
                console.log(err)
            }
        }
        getInstansiDetail()
    },[])


    const [data, setData] = useState({
        tahun: '',
        id_laporan: '',
        tujuan_pelaporan: '',
        kegiatan: {
            nama_program: '',
        },
        kp: '',
        prop: '',
        gerakan: '',
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
        deleted_media: [],
        deleted_berkas: [],
        deleted_tempat: [],
        deleted_hasil: [],
        deleted_ketercapaian: [],
    })

    const {
        tahun,
        id_laporan,
        tujuan_pelaporan,
        kegiatan,
        nama_program,
        kp,
        prop,
        gerakan,
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
    const [mediaUrl, setMediaUrl] = useState([])

    const [berkas, setBerkas] = useState([])
    const [berkasUrl, setBerkasUrl] = useState([])

    const [lampiranTempat, setLampiranTempat] = useState([])
    const [lampiranTempatUrl, setLampiranTempatUrl] = useState([])
    
    const [lampiranHasil, setLampiranHasil] = useState([])
    const [lampiranHasiliUrl, setLampiranHasilUrl] = useState([])

    const [lampiranKetercapaian, setLampiranKetercapaian] = useState([])
    const [lampiranKetercapaianUrl, setLampiranKetercapaianUrl] = useState([])

    const [proyek, setProyek] = useState([])
    const [kpOptions, setKpOptions] = useState([])
    const [propOptions, setPropOptions] = useState([])
    const [gerakanOptions, setGerakanOptions] = useState([])
    const [selectedKp, setSelectedKp] = useState(false)
    const [deletedMedia, setDeletedMedia] = useState([])
    const [deletedBerkas, setDeletedBerkas] = useState([])
    const [deletedLampiranTempat, setDeletedLampiranTempat] = useState([])
    const [deletedLampiranHasil, setDeletedLampiranHasil] = useState([])
    const [deletedLampiranKetercapaian, setDeletedLampiranKetercapaian] = useState([])

    const [sk,setSk] = useState({
        sk_status: true,
        sk_no: '',
        sk_kendala: ''
    })

    const onChangeButton = (e) => {
        return setSk({...sk , sk_status: true})
    }

    const onChangeButtonFalse = (e) => {
        return setSk({...sk , sk_status: false})
    }

    const onChangeSK = (e) => {
        return setSk({...sk , [e.target.name]: e.target.value})
    }

    const [skFile,setSKFile] = useState([])
    const [skGambar , setSkGambar] = useState();
    const [skGambars , setSkGambars] = useState();

    const onChangeSKFile = (event) => {
        setSKFile([...event.target.files])
        event.target.value = null
    }

    const onChangeMedia = (event) => {
        setMedia([...media , ...event.target.files])
        event.target.value = null
    }

    const onChangeBerkas = (event) => {
        setBerkas([...berkas , ...event.target.files])
        event.target.value = null
    }

    const onChangeFilesTempat = (event) => {
        setLampiranTempat([...lampiranTempat , ...event.target.files])
        event.target.value = null
    }

    const onChangeFilesHasil = (event) => {
        setLampiranHasil([...lampiranHasil , ...event.target.files])
        event.target.value = null
    }

    const onChangeFilesKetercapaian = (event) => {
        setLampiranKetercapaian([...lampiranKetercapaian , ...event.target.files])
        event.target.value = null
    }
    const onChange = (event, property) => {
        if (event.target.name === 'kp') setSelectedKp(event.target.value)
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

    const onSubmitSK = async (event) => {
        setLoadingTrue()
        const formData = objectToFormData(sk)

        if (skFile.length > 0) {
            for (let i = 0; i < skFile.length; i++) {
                formData.append(`sk`, skFile[i])
            }
        }  else {formData.append('sk', new File([null], 'blob'))}

        const config = {
			headers: {
				'Content-Type': 'multipart/form-data',
				'X-Auth-Token': `aweuaweu ${token}`,
			},
		}

		const res = await axios.put(`https://test.bariqmbani.me/api/v1/instansi/${userDetail&&userDetail.instansi._id}`,formData,config,)
        setLoadingFalse()
    }

    const onSubmit = async (event) => {
        setLoadingTrue()
		event.preventDefault()

		const formData = objectToFormData(data)

		for (let i = 0; i < media.length; i++) {
			formData.append(`media`, media[i])
        }

        for (let i = 0; i < berkas.length; i++) {
			formData.append(`berkas`, berkas[i])
        }
        
        for (let i = 0; i < lampiranTempat.length; i++) {
			formData.append(`lampiran_tempat`, lampiranTempat[i])
        }
        
        for (let i = 0; i < lampiranHasil.length; i++) {
			formData.append(`lampiran_hasil`, lampiranHasil[i])
        }
        
        for (let i = 0; i < lampiranKetercapaian.length; i++) {
			formData.append(`lampiran_ketercapaian`, lampiranKetercapaian[i])
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
            history.push(`/${userDetail&&userDetail.role === 'owner' ? 'super-admin' : 'admin'}/laporan-monev`)
        }
        catch(err){
            alert(err.data.message)
        }
        setLoadingFalse()
    }
    
    const onEdit = async (event) => {
        setLoadingTrue()
		event.preventDefault()

		const formData = objectToFormData(data)

        if (berkas.length > 0) {
            for (let i = 0; i < berkas.length; i++) {
                formData.append(`berkas`, berkas[i])
            }
        }  else {formData.append('berkas', new File([null], 'blob'))}

        if (media.length > 0) {
            for (let i = 0; i < media.length; i++) {
                formData.append(`media`, media[i])
            }
        }  else {formData.append('media', new File([null], 'blob'))}

        if (lampiranTempat.length > 0) {
            for (let i = 0; i < lampiranTempat.length; i++) {
                formData.append(`lampiran_tempat`, lampiranTempat[i])
            }
        }  else {formData.append('lampiran_tempat', new File([null], 'blob'))}

        if (lampiranHasil.length > 0) {
            for (let i = 0; i < lampiranHasil.length; i++) {
                formData.append(`lampiran_hasil`, lampiranHasil[i])
            }
        }  else {formData.append('lampiran_hasil', new File([null], 'blob'))}

        if (lampiranKetercapaian.length > 0) {
            for (let i = 0; i < lampiranKetercapaian.length; i++) {
                formData.append(`lampiran_ketercapaian`, lampiranKetercapaian[i])
            }
        }  else {formData.append('lampiran_ketercapaian', new File([null], 'blob'))}
        

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
        history.push(`/${userDetail&&userDetail.role === 'owner' ? 'super-admin' : 'admin'}/laporan-monev`)
        alert(res.data.message)
        setLoadingFalse()
        editDocumentFalse()
    }

    const setPreview = (e) => {
        e.preventDefault()
        preview()
    }

    useEffect(() => {
            if(userDetail){
                setSk({
                    ...sk,
                    sk_no: userDetail&&userDetail.instansi.sk.no,
                    sk_kendala: userDetail&&userDetail.instansi.sk.kendala
                })
    
            const gambar = `https://test.bariqmbani.me${userDetail&&userDetail.instansi.sk.foto}`
            setSkGambar(gambar)
        }
    },[userDetail])

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
            setInstansi(documentDetail.instansi)
            setMedia(documentDetail.form.lampiran.media)
            setBerkas(documentDetail.form.lampiran.berkas)
            setLampiranTempat(documentDetail.form.lampiran.tempat)
            setLampiranHasil(documentDetail.form.lampiran.hasil)
            setLampiranKetercapaian(documentDetail.form.lampiran.ketercapaian)

            const mediaFileUrl = documentDetail.form.lampiran.media.map(media => `https://test.bariqmbani.me${media.path}`)
            const files = []
            mediaFileUrl.forEach(url => {
                fetch(url).then(res => res.blob()).then(blob => {
                    const objectURL = URL.createObjectURL(blob)
                    blob.name = getFileName(url)
                    files.push(blob)
                })
            })

            const mediaFileUrl2 = documentDetail.form.lampiran.berkas.map(berkas => `https://test.bariqmbani.me${berkas.path}`)
            const files2 = []
            mediaFileUrl2.forEach(url => {
                fetch(url).then(res => res.blob()).then(blob => {
                    const objectURL = URL.createObjectURL(blob)
                    blob.name = getFileName(url)
                    files2.push(blob)
                })
            })

            const mediaFileUrl3 = documentDetail.form.lampiran.tempat.map(tempat => `https://test.bariqmbani.me${tempat.path}`)
            const files3 = []
            mediaFileUrl3.forEach(url => {
                fetch(url).then(res => res.blob()).then(blob => {
                    const objectURL = URL.createObjectURL(blob)
                    blob.name = getFileName(url)
                    files3.push(blob)
                })
            })

            const mediaFileUrl4 = documentDetail.form.lampiran.hasil.map(hasil => `https://test.bariqmbani.me${hasil.path}`)
            const files4 = []
            mediaFileUrl4.forEach(url => {
                fetch(url).then(res => res.blob()).then(blob => {
                    const objectURL = URL.createObjectURL(blob)
                    blob.name = getFileName(url)
                    files4.push(blob)
                })
            })

            const mediaFileUrl5 = documentDetail.form.lampiran.ketercapaian.map(ketercapaian => `https://test.bariqmbani.me${ketercapaian.path}`)
            const files5 = []
            mediaFileUrl5.forEach(url => {
                fetch(url).then(res => res.blob()).then(blob => {
                    const objectURL = URL.createObjectURL(blob)
                    blob.name = getFileName(url)
                    files5.push(blob)
                })
            })

            setMedia(files)  
            setBerkas(files2)
            setLampiranTempat(files3)
            setLampiranHasil(files4)
            setLampiranKetercapaian(files5)

            setMediaUrl(mediaFileUrl)
            setBerkasUrl(mediaFileUrl2)
            setLampiranTempatUrl(mediaFileUrl3)
            setLampiranHasilUrl(mediaFileUrl4)
            setLampiranKetercapaianUrl(mediaFileUrl5)

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

    const onDeleteBerkas = (isFile, filename, data) => {
        setBerkasUrl(berkasUrl.filter(media => getFileName(media) !== filename))
        if (isFile) setBerkas(berkas.filter(media => media !== data))
        else setBerkas(berkas.filter(media => media.name !== filename))
        const deleted = [...deletedBerkas, filename]
        setDeletedBerkas(deleted)
    }

    const onDeleteTempat = (isFile, filename, data) => {
        setLampiranTempatUrl(lampiranTempatUrl.filter(media => getFileName(media) !== filename))
        if (isFile) setLampiranTempat(lampiranTempat.filter(media => media !== data))
        else setLampiranTempat(lampiranTempat.filter(media => media.name !== filename))
        const deleted = [...deletedLampiranTempat, filename]
        setDeletedLampiranTempat(deleted)
    }

    const onDeleteHasil = (isFile, filename, data) => {
        setLampiranHasilUrl(lampiranHasiliUrl.filter(media => getFileName(media) !== filename))
        if (isFile) setLampiranHasil(lampiranHasil.filter(media => media !== data))
        else setLampiranHasil(lampiranHasil.filter(media => media.name !== filename))
        const deleted = [...deletedLampiranHasil, filename]
        setDeletedLampiranHasil(deleted)
    }

    const onDeleteKetercapaian = (isFile, filename, data) => {
        setLampiranKetercapaianUrl(lampiranKetercapaianUrl.filter(media => getFileName(media) !== filename))
        if (isFile) setLampiranKetercapaian(lampiranKetercapaian.filter(media => media !== data))
        else setLampiranKetercapaian(lampiranKetercapaian.filter(media => media.name !== filename))
        const deleted = [...deletedLampiranKetercapaian, filename]
        setDeletedLampiranKetercapaian(deleted)
    }

    useEffect(() => {
        setData({ ...data, 
            deleted_media: deletedMedia, 
            deleted_berkas: deletedBerkas, 
            deleted_tempat: deletedLampiranTempat, 
            deleted_hasil: deletedLampiranHasil,
            deleted_ketercapaian: deletedLampiranKetercapaian, })
    }, [deletedMedia,deletedBerkas,deletedLampiranHasil,deletedLampiranTempat,deletedLampiranKetercapaian])


    return(
    <Fragment>
        <SideBarOff/>
        <div className="background-after-login"/>
        <Popup notif={props.notif}/>
        {/* -------------------------- FORM SECTION START HERE ---------------------------------*/}
        <div className={isPreviewing ? 'd-none': "form"}>
            <div className="tajuk-page">
                <h1> FORM LAPORAN MONITORING DAN EVALUASI GNRM</h1>
            </div>
            {
                loading ?
                <div style={{ marginLeft: '68px' }}>
                    <div className="d-flex justify-content-center align-items-center" style={{ width: '100%', height: '60vh', overflow: 'hidden' }}>
                        <Spinner />
                    </div> 
                </div>
                :
            <form style={{width:'fit-content' , height:'fit-content' , margin:'auto'}}>
                <Element id='identitas' name='identitas'>
                    <div className="monev-container">
                        <div className="form-monev">
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
                                <label>ID Laporan</label>
                                    {
                                        documentDetail && documentDetail.form.id_laporan ?
                                        <select 
                                            onChange={(event) => onChange(event)}  
                                            className="monev-id-program"
                                            name="id_laporan"
                                            style={{marginLeft:'127px'}}
                                        >
                                            
                                            {
                                                pilihanPeriode.map((periode, i) => <option key={i} selected={documentDetail.form.id_laporan === periode && true} title={periode} value={periode}>{periode}</option>)
                                            }
                                            
                                        </select> :
                                        <select 
                                            onChange={(event) => onChange(event)} 
                                            className="monev-id-laporan"
                                            name="id_laporan"
                                            style={{marginLeft:'127px'}}
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
                                <input className="monev-instansi" type="email" name="email" />
                            </div> */}
                            <div>
                                    <label>Nama Program</label>
                                    <input 
                                        className="gnrm-nama-program" 
                                        style={{height: "42px", 
                                                marginLeft: "91px", 
                                                width: "955px"}} 
                                        type="text" 
                                        name="nama_program"
                                        value={kegiatan.nama_program}
                                        onChange={(event) => onChange(event,'kegiatan')}
                                    />
                                </div>
                                {
                                    instansiDetail && instansiDetail.jenis === 'Kementerian' ?
                                        <Fragment>

                                            <div>
                                                <label>Kegiatan Prioritas</label>
                                                {
                                                    documentDetail && documentDetail.form.kp ?
                                                    <select 
                                                        onChange={onChange} 
                                                        class="gnrm-select"
                                                        name="kp"
                                                        style={{marginLeft: '69px', width:'955px' , height: '42px'}}
                                                    >
                                                        {
                                                            kpOptions.map((kp, i) => <option key={i} selected={documentDetail.form.kp === kp && true} title={kp} value={kp}>{kp.length > 113 ? `${kp.substr(0, 110)}...` : kp}</option>)
                                                        }
                                                    </select> :
                                                    <select 
                                                        onChange={onChange} 
                                                        class="gnrm-select"
                                                        name="kp"
                                                        style={{marginLeft: '69px', width:'955px' , height: '42px' }}
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
                                                        style={{marginLeft: '84px' , width:'955px'}}
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
                                                        style={{marginLeft: '83px', width:'955px'}}
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
                                        </Fragment>
                                    :
                                        <Fragment>
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
                                        </Fragment>
                                }
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

                <Element id='gugus_tugas' name='gugus_tugas'>
                        <div className="gnrm-container" >
                            <div className="gnrm-title">
                                GUGUS TUGAS GNRM
                            </div>
                            <div className="form-gnrm">
                            {
                                userDetail && userDetail.instansi.sk.status ? 
                                    <Fragment>
                                        <div>
                                            <label style={{textAlign:'left', clear:'both' , float:'left'}}>Input Nomor SK</label>
                                            <div
                                                className="gnrm-sasaran" 
                                                style={{height: "42px", 
                                                        marginLeft: '230px',
                                                        fontWeight:'700'
                                                        }}
                                            >{sk.sk_no}</div>
                                        </div>
                                        <div>
                                            <label style={{textAlign:'left', clear:'both' , float:'left'}}>Lampiran Berkas</label>
                                            <div style={{width:'fit-content' , height: 'fit-content', marginLeft:'230px'}}>
                                                <img src={skGambar} alt={getFileName(userDetail&&userDetail.instansi.sk.foto)} style={{width:'fit-content' , height: 'fit-content'}}/><br/>
                                                <div
                                                    className="gnrm-sasaran" 
                                                    style={{height: "42px", 
                                                            width: "955px",
                                                            fontWeight:'700'
                                                            }}
                                                >{getFileName(userDetail&&userDetail.instansi.sk.foto)}</div>
                                            </div>
                                        </div>
                                    </Fragment>
                                :
                                    <Fragment>
                                        <div>
                                            <label style={{textAlign:'left', clear:'both' , float:'left'}}>Sudah Terbentuk <br/> Gugus Tugas?</label>
                                            <div style={{marginLeft:'210px'}}>
                                                {
                                                    sk.sk_status ?
                                                        <Fragment>
                                                                <input type="radio" id="sudah" name="sk_status" value={sk.sk_status} checked={true} onChange={onChangeButton}/>
                                                                <label htmlFor="sudah" className='wowowow' style={{marginRight:'65px'}}>Sudah</label>
                                                                <input type="radio" id="belum" name="sk_status" value={sk.sk_status} onChange={onChangeButtonFalse}/>
                                                                <label htmlFor="belum" className='wowowow'>Belum</label>
                                                        </Fragment>
                                                    :
                                                        <Fragment>
                                                                <input type="radio" id="sudah" name="sk_status" value={sk.sk_status} onChange={onChangeButton}/>
                                                                <label htmlFor="sudah" style={{marginRight:'65px'}}>Sudah</label>
                                                                <input type="radio" id="belum" name="sk_status" value={sk.sk_status} checked={true} onChange={onChangeButtonFalse}/>
                                                                <label htmlFor="belum">Belum</label>
                                                        </Fragment>

                                                }
                                            </div>
                                        </div>
                                            {
                                                sk.sk_status ?
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
                                                            name="no_sk"
                                                            value={sk.no_sk}
                                                            onChange={onChangeSK}
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
                                                            accept="image/*"
                                                            name="media"
                                                            multiple
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
                                                        value={sk.sk_kendala}
                                                        onChange={onChangeSK}
                                                    />
                                                </div>
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
                            <div>
                                    <label>Lampiran Berkas</label>
                                    <label htmlFor='testing' className='label_lampiran'><span style={{marginRight:'15px'}}>+</span> PILIH Berkas</label>
                                    <input 
                                        id="testing"
                                        className="gnrm-penjelasan" 
                                        style={{height: "42px", 
                                                marginLeft: "28px", 
                                                width: "955px"}} 
                                        onChange={onChangeFilesTempat}
                                        type="file"
                                        accept="image/*"
                                        name="media"
                                        multiple
                                    />
                                </div>
                                <div>
                                    {
                                        lampiranTempat && lampiranTempat.length > 0 ? (
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
                                                    lampiranTempat.map((lampiran,index) => {
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
                                                                        onClick={(e) => onDeleteTempat(true, lampiran.name, lampiran)}> X </div>
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
                                                    lampiranTempatUrl.map((url,index) => {
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
                                                                        onClick={(e) => onDeleteTempat(false, getFileName(url))}> X </div>
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
                            HASIL MONITORING DAN KENDALA PROGRAM
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
                                <label style={{textAlign:'right', clear:'both' , float:'left'}}>Kendala Program</label>
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
                            <div>
                                    <label>Lampiran Media</label>
                                    <label htmlFor='testing2' className='label_lampiran'><span style={{marginRight:'15px'}}>+</span> PILIH BERKAS</label>
                                    <input 
                                        id="testing2"
                                        className="gnrm-penjelasan" 
                                        style={{height: "42px", 
                                                marginLeft: "28px", 
                                                width: "955px"}} 
                                        onChange={onChangeFilesHasil}
                                        type="file"
                                        accept="image/*"
                                        name="media"
                                        multiple
                                    />
                                </div>
                                <div>
                                    {
                                        lampiranHasil && lampiranHasil.length > 0 ? (
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
                                                    lampiranHasil.map((lampiran,index) => {
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
                                                                        onClick={(e) => onDeleteHasil(true, lampiran.name, lampiran)}> X </div>
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
                                                border: '1px solid #ACACAC',
                                                borderRadius: '5px',
                                                width: "955px",
                                                padding: '10px',
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                            }} 
                                            >
                                                {
                                                    lampiranHasiliUrl.map((url,index) => {
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
                                                                        onClick={(e) => onDeleteHasil(false, getFileName(url))}> X </div>
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
                            <div>
                                    <label>Lampiran Media</label>
                                    <label htmlFor='testing3' className='label_lampiran'><span style={{marginRight:'15px'}}>+</span> PILIH BERKAS</label>
                                    <input 
                                        id="testing3"
                                        className="gnrm-penjelasan" 
                                        style={{height: "42px", 
                                                marginLeft: "28px", 
                                                width: "955px"}} 
                                        onChange={onChangeFilesKetercapaian}
                                        type="file"
                                        accept="image/*"
                                        name="media"
                                        multiple
                                    />
                                </div>
                                <div>
                                    {
                                        lampiranKetercapaian && lampiranKetercapaian.length > 0 ? (
                                            <div style={{height: "fit-content", 
                                                marginLeft: "208px", 
                                                border: '1px solid #ACACAC',
                                                borderRadius: '5px',
                                                width: "955px",
                                                border: '1px solid black',
                                                padding: '10px',
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                            }} 
                                            >
                                                {
                                                    lampiranKetercapaian.map((lampiran,index) => {
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
                                                                        onClick={(e) => onDeleteKetercapaian(true, lampiran.name, lampiran)}> X </div>
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
                                                    lampiranKetercapaianUrl.map((url,index) => {
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
                                                                        onClick={(e) => onDeleteKetercapaian(false, getFileName(url))}> X </div>
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
                            <label htmlFor='testing4' className='label_lampiran'><span style={{marginRight:'15px'}}>+</span> PILIH BERKAS</label>
                            <input 
                                id="testing4"
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
                            </div>
                            <div>
                                {
                                    media && media.length > 0 ? (
                                        <div style={{height: "fit-content", 
                                            marginLeft: "208px", 
                                            border: '1px solid #ACACAC',
                                            borderRadius: '5px',
                                            width: "955px",
                                            padding: '10px',
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                        }} 
                                        >
                                            {
                                                media.map((lampiran,index) => {
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
                                                                    onClick={(e) => onDeleteMedia(true, lampiran.name, lampiran)}> X </div>
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
                            <div>
                                    <label>Lampiran Berkas</label>
                                    <label htmlFor='testing5' className='label_lampiran' style={{marginLeft:'70px'}}><span style={{marginRight:'15px'}}>+</span> PILIH BERKAS</label>
                                    <input 
                                        id="testing5"
                                        className="gnrm-penjelasan" 
                                        style={{height: "42px", 
                                                marginLeft: "28px", 
                                                width: "955px"}} 
                                        onChange={onChangeBerkas}
                                        type="file"
                                        accept="image/*"
                                        name="media"
                                        multiple
                                    />
                                </div>
                                <div>
                                    {
                                        berkas && berkas.length > 0 ? (
                                            <div style={{height: "fit-content", 
                                                border: '1px solid #ACACAC',
                                                borderRadius: '5px',
                                                marginLeft: "208px", 
                                                width: "955px",
                                                padding: '10px',
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                            }} 
                                            >
                                                {
                                                    berkas.map((lampiran,index) => {
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
                                                                        onClick={(e) => onDeleteBerkas(true, lampiran.name, lampiran)}> X </div>
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
                                                border: '1px solid #ACACAC',
                                                borderRadius: '5px',
                                                width: "955px",
                                                padding: '10px',
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                            }} 
                                            >
                                                {
                                                    berkasUrl.map((url,index) => {
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
                                                                        onClick={(e) => onDeleteBerkas(false, getFileName(url))}> X </div>
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
            }
            </div>
        {/* -------------------------- FORM SECTION END HERE ---------------------------------*/}
            
        {/* -------------------------- PREVIEW SECTION START HERE ---------------------------------*/}   
            <div className={isPreviewing ? "preview-page" : "d-none"}>
                    <div className="title-preview-page">
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