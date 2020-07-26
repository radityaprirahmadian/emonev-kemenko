import React,{ Component,Fragment,useState,useContext,useEffect} from 'react';
import './FormMonev.css';
import logo_kemenko from '../../assets/logo_kemenko.png'
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import logo_footer from '../../assets/logo_footer.png'
import images from '../../assets/image.png'
import imgFile from '../../assets/file.png'
import { Link,useHistory} from 'react-router-dom';
import axios from 'axios'
import objectToFormData from '../../objectToFormDataUtil'
import { AuthContext } from '../../context/Auth/AuthContext'
import { ArtikelContext } from '../../context/Artikel/artikelContext';
import Scroll , { Element } from 'react-scroll'
import Popup from '../../component/Popup/Popup';
import Spinner from '../../component/Spinner/Spinner'
import plus2 from '../../assets/plus2.png'
import bg_1 from '../../assets/decoration/bg_1.png'
import bg_2 from '../../assets/decoration/bg_2.png'
import bg_3 from '../../assets/decoration/bg_3.png'
import bg_4 from '../../assets/decoration/bg_4.png'
import {LayoutContext} from '../../context/Layout/LayoutContext'

const FormMonev =  (props) => {
    const { documentDetail, getDocumentDetail, resetDocument, isEditing, editDocument, editDocumentFalse, instansiDocumentDetail , isPreviewing, preview, loading,setLoadingFalse, setLoadingTrue } = useContext(ArtikelContext)
    const { token,userDetail } = useContext(AuthContext)
    const { sidebar } = useContext(LayoutContext)
    const history = useHistory()
    const Link = Scroll.Link
    const id = props.match.params.id
    const type = 'monev'

    const [instansi,setInstansi] = useState('')
    const pilihanTahun = [];
    const todaysYear = new Date().getFullYear();
    for (let year = todaysYear; year >= 2020; year--) {
        pilihanTahun.push(year);
    }
    const pilihanPeriode = ['Tahunan', 'Caturwulanan']

    const [ instansiDetail , setInstansiDetail] = useState({})

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
    let str2 = date + ' ' + month + ' ' + mydate.getFullYear();

    const [data, setData] = useState({
        tahun: '',
        id_laporan: '',
        tujuan_pelaporan: '',
        kegiatan: {
            nama_program: '',
        },
        kp: '',
        prop: '',
        sk_status: '',
        sk_no: '',
        sk_kendala : '',
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
        lokasi: '',
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
        lokasi,
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

    const [formGerakan, setFormGerakan] = useState([])
    const [proyek, setProyek] = useState([])
    const [kpOptions, setKpOptions] = useState([])
    const [propOptions, setPropOptions] = useState([])
    const [gerakanOptions, setGerakanOptions] = useState([])
    const [selectedKp, setSelectedKp] = useState(false)
    const [selectedGerakan, setSelectedGerakan] = useState({})
    const [deletedMedia, setDeletedMedia] = useState([])
    const [deletedBerkas, setDeletedBerkas] = useState([])
    const [deletedLampiranTempat, setDeletedLampiranTempat] = useState([])
    const [deletedLampiranHasil, setDeletedLampiranHasil] = useState([])
    const [deletedLampiranKetercapaian, setDeletedLampiranKetercapaian] = useState([])

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

    const onChangeButton = (e) => {
        return setData({...data , sk_status: true , sk_kendala: ''})
    }

    const onChangeButtonFalse = (e) => {
        return setData({...data , sk_status: false , sk_no: ''})
    }

    const onChangeSK = (e) => {
        return setData({...data , [e.target.name]: e.target.value})
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

    // const cekEkstension = (ext) => {
    //     if(ext !== 'pdf' || ext !== 'jpeg' || ext !== 'jpg' || ext !== 'png'){
    //         alert('Anda memasukkan file dengan eksensi yang salah!')
    //     }
    // }

    const isFileImage = (file) => {
        return file && file['type'].split('/')[0] === 'image';
    }
    
    const isFileImageUrl = (url) => {
        url = url.split('?')[0];
        const parts = url.split('.');
        const extension = parts[parts.length-1];
        const imageTypes = ['jpg','jpeg','tiff','png','gif','bmp', 'JPG' , 'PNG' , 'JPEG']
        if(imageTypes.indexOf(extension) !== -1) {
            return true;   
        } else return false;
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

        for (let i = 0; i < skFile.length; i++) {
            formData.append(`sk`, skFile[i])
        }

		// for (let pair of formData.entries()) {
		// 	console.log(pair[0] + ', ' + pair[1])
		// }

		const config = {
			headers: {
				'Content-Type': 'multipart/form-data',
				'X-Auth-Token': `aweuaweu ${token}`,
			},
		}

        try {
            const res = await axios.post('https://api.simonev.revolusimental.go.id/api/v1/document?type=monev',formData,config,)
            alert(res.data.message)
            history.push(`/${userDetail&&userDetail.role === 'owner' ? 'super-admin' : 'admin'}/laporan-monev`)
        }
        catch(err){
            alert(err.data.message)
        }
        setLoadingFalse()
    }
    

    const getFIleExtension = (filename) => {
        let ext = /^.+\.([^.]+)$/.exec(filename);
        return ext == null ? "" : ext[1];
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
        
        if (skFile.length > 0) {
                formData.append(`sk`, skFile[0])
            }

		// for (let pair of formData.entries()) {
		// 	console.log(pair[0] + ', ' + pair[1])
		// }

		const config = {
			headers: {
				'Content-Type': 'multipart/form-data',
				'X-Auth-Token': `aweuaweu ${token}`,
			},
		}

		try {
            const res = await axios.put(`https://api.simonev.revolusimental.go.id/api/v1/document/${props.match.params.id}?type=monev`,formData,config,)
        alert(res.data.message)
        history.push(`/${userDetail&&userDetail.role === 'owner' ? 'super-admin' : 'admin'}/laporan-monev`)

        editDocumentFalse()
        }
        catch(err) {
            console.log(err)
            alert(err.response.data.message)
        }
        setLoadingFalse()
    }

    const setPreview = (e) => {
        e.preventDefault()
        window.scrollTo(0, 0);
        preview()
    }

    const [ skExtension , setSkExtension] = useState('')
    const [ skFileUrl , setSkFileUrl] = useState([])

    useEffect(() => {
        if(instansiDetail){
            setData({
                ...data,
                sk_no: instansiDetail.sk&&instansiDetail.sk.no,
                sk_status: instansiDetail.sk&&instansiDetail.sk.status,
                sk_kendala: instansiDetail.sk&&instansiDetail.sk.kendala
            })
    
            const gambar = `https://api.simonev.revolusimental.go.id${instansiDetail.sk&&instansiDetail.sk.foto}`
            setSkGambar(gambar)
            const fileExt = getFIleExtension(gambar)
            setSkExtension(fileExt)
            
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
        }
    },[instansiDetail])

    // useEffect(() => {
    //     const mediaFileUrl = [`https://api.simonev.revolusimental.go.id${instansiDetail.sk&&instansiDetail.sk.foto}`]
    //     const files = []
    //     mediaFileUrl.forEach(url => {
    //         fetch(url).then(res => res.blob()).then(blob => {
    //             const objectURL = URL.createObjectURL(blob)
    //             blob.name = getFileName(url)
    //             files.push(blob)
    //         })
    //     })

    //     setSKFile(files)
    //     setSkFileUrl(mediaFileUrl)
    // }, [data.sk_status])


    useEffect(() => {
        window.scrollTo(0, 0);
        (async () => {
            const proyekData = await axios.get('https://api.simonev.revolusimental.go.id/api/v1/proyek')

            const { proyek, gerakan } = proyekData.data
            
            setProyek(proyek)
            setGerakanOptions(gerakan)
            setKpOptions((proyek.map(proyek => proyek.kp)))
        })()
    },[])

    useEffect(() => {
        if(props.match.params.id) {
            resetDocument()
            editDocument()
            getDocumentDetail({id,type})
            if(isPreviewing){
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
                    const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/document/${props.match.params.id}?type=monev`,config)
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
    },[userDetail,props.match.params.id])


    useEffect(() => {
        const getProp = (kp) => {
            let kpIndex
            proyek&&proyek.forEach((proyek, index) => {
                if (proyek.kp === kp) kpIndex = index
            })
            return proyek[kpIndex]&&proyek[kpIndex].prop
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
            setSelectedKp(documentDetail.form.kp)

            const gerakanArray = documentDetail.form.gerakan.split(',')
            const gerakanObj = {}

            gerakanArray.forEach((gerakan, i) => {
                gerakanObj[`gerakan-${i}`] = gerakan
            })

            setSelectedGerakan(gerakanObj)
            setFormGerakan(new Array(gerakanArray.length - 1))


            const mediaFileUrl = documentDetail && documentDetail.form.lampiran.media.map(media => `https://api.simonev.revolusimental.go.id${media.path}`)
            const files = []
            mediaFileUrl.forEach(url => {
                fetch(url).then(res => res.blob()).then(blob => {
                    const objectURL = URL.createObjectURL(blob)
                    blob.name = getFileName(url)
                    files.push(blob)
                })
            })

            const mediaFileUrl2 = documentDetail && documentDetail.form.lampiran.berkas.map(berkas => `https://api.simonev.revolusimental.go.id${berkas.path}`)
            const files2 = []
            mediaFileUrl2.forEach(url => {
                fetch(url).then(res => res.blob()).then(blob => {
                    const objectURL = URL.createObjectURL(blob)
                    blob.name = getFileName(url)
                    files2.push(blob)
                })
            })

            const mediaFileUrl3 = documentDetail &&  documentDetail.form.lampiran.tempat.map(tempat => `https://api.simonev.revolusimental.go.id${tempat.path}`)
            const files3 = []
            mediaFileUrl3.forEach(url => {
                fetch(url).then(res => res.blob()).then(blob => {
                    const objectURL = URL.createObjectURL(blob)
                    blob.name = getFileName(url)
                    files3.push(blob)
                })
            })

            const mediaFileUrl4 = documentDetail && documentDetail.form.lampiran.hasil.map(hasil => `https://api.simonev.revolusimental.go.id${hasil.path}`)
            const files4 = []
            mediaFileUrl4.forEach(url => {
                fetch(url).then(res => res.blob()).then(blob => {
                    const objectURL = URL.createObjectURL(blob)
                    blob.name = getFileName(url)
                    files4.push(blob)
                })
            })

            const mediaFileUrl5 = documentDetail && documentDetail.form.lampiran.ketercapaian.map(ketercapaian => `https://api.simonev.revolusimental.go.id${ketercapaian.path}`)
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
            <SideBarOff setId={props.setId}/>
            <div className="background-after-login">
                <img src={bg_1} alt='bg1' style={{position: 'fixed' , top:'0' , left: '0'}}/>
                <img src={bg_2} alt='bg2' style={{position: 'fixed' , top:'0' , right: '0'}}/>
                <img src={bg_3} alt='bg3' style={{position: 'fixed' , bottom:'-200px' , left: '0'}}/>
                <img src={bg_4} alt='bg4' style={{position: 'fixed' , bottom:'-50px' , right: '0'}}/>
            </div>
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
                <div style={sidebar ? {marginLeft:'188px' , transition: 'all 0.3s ease-in-out'} : {transition: 'all 0.3s ease-in-out'}}>
                {
                    !sidebar ?
                    <form style={{width:'fit-content' , height:'fit-content' , margin:'auto'}} id='form-monev' onSubmit={isEditing ? onEdit : onSubmit}>
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
                                    <label>Periode</label>
                                        {
                                            documentDetail && documentDetail.form.id_laporan ?
                                            <select 
                                                onChange={(event) => onChange(event)}  
                                                className="monev-id-program"
                                                name="id_laporan"
                                                style={{marginLeft:'150px'}}
                                            >
                                                
                                                {
                                                    pilihanPeriode.map((periode, i) => <option key={i} selected={documentDetail.form.id_laporan === periode && true} title={periode} value={periode}>{periode}</option>)
                                                }
                                                
                                            </select> :
                                            <select 
                                                onChange={(event) => onChange(event)} 
                                                className="monev-id-laporan"
                                                name="id_laporan"
                                                style={{marginLeft:'150px'}}
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
                                                                kpOptions&&kpOptions.map((kp, i) => <option key={i} selected={documentDetail.form.kp === kp && true} title={kp} value={kp}>{kp.length > 113 ? `${kp.substr(0, 110)}...` : kp}</option>)
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
                                                                kpOptions&&kpOptions.map((kp, i) => <option key={i} title={kp} value={kp}>{kp.length > 113 ? `${kp.substr(0, 110)}...` : kp}</option>)
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
                                                                propOptions&&propOptions.map((prop, i) => <option key={i} selected={documentDetail.form.prop === prop && true} title={prop} value={prop}>{prop.length > 113 ? `${prop.substr(0, 110)}...` : prop}</option>)
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
                                                                propOptions&&propOptions.map((prop, i) => <option key={i} title={prop} value={prop}>{prop.length > 113 ? `${prop.substr(0, 110)}...` : prop}</option>)
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
                            </div>
                            <div className="gnrm-navigation-button">
                                <Link 
                                    to="gugus_tugas"
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    offset={-30}
                                > 
                                    <button className="forward tes"><i className="material-icons" style={{fontSize:'36px'}}>expand_more</i></button>
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
                                                                 <label htmlFor='testing10' className='label_lampiran' style={{marginLeft: '110px'}}><span style={{marginRight:'15px'}}>+</span> PILIH DOKUMEN/FOTO</label>
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
                                                                            <label htmlFor='testing10' className='label_lampiran' style={{marginLeft: '110px'}}><span style={{marginRight:'15px'}}>+</span> PILIH DOKUMEN/FOTO</label>
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
                                        to="tujuan_pelaporan"
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
                                TUJUAN PROGRAM / KEGIATAN
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
                                    to="gugus_tugas"
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
                                        <label>Data Dukung</label>
                                        <label htmlFor='testing' className='label_lampiran'><span style={{marginRight:'15px'}}>+</span> PILIH DOKUMEN/FOTO</label>
                                        <input 
                                            id="testing"
                                            className="gnrm-penjelasan" 
                                            style={{height: "42px", 
                                                    marginLeft: "28px", 
                                                    width: "955px"}} 
                                            onChange={onChangeFilesTempat}
                                            type="file"
                                            accept="image/* , application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.presentationml.slideshow , text/plain, application/pdf"
                                            name="media"
                                            multiple
                                        />
                                    </div>
                                    <div>
                                        {
                                            lampiranTempat && lampiranTempat.length > 0 ? (
                                                <div style={{height: "fit-content", 
                                                    marginLeft: "213px", 
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
                                                        lampiranTempat.map((lampiran,index) => {
                                                            const fileType = isFileImage(lampiran)
                                                            const objectURL = URL.createObjectURL(lampiran)
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
                                                                                    !fileType ? 
                                                                                        <img src={imgFile} alt={lampiran.name} style={{width:'150px' , height:'150px'}}className="gnrm-media--image" />
                                                                                    :
                                                                                        <img src={objectURL} alt={lampiran.name} className="gnrm-media--image" />
                                                                                }
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
                                                    marginLeft: "213px", 
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
                                                        lampiranTempatUrl.map((url,index) => {
                                                            const fileType = isFileImageUrl(url)
                                                            // console.log(fileType)
                                                            return(
                                                                <div key={index}>
                                                                        <div style={{width:'150px', 
                                                                                    height:'150px', 
                                                                                    marginRight:'35px', 
                                                                                    position:'relative'}}
                                                                            className="d-flex align-items-center justify-content-center"
                                                                        >
                                                                            <div style={{width:'150px', height:'150px', overflow:'hidden', position:'absolute'}}>
                                                                                {
                                                                                    !fileType ? 
                                                                                        <img src={imgFile} alt={getFileName(url)} style={{width:'150px' , height:'150px'}}className="gnrm-media--image" />
                                                                                    :
                                                                                        <img src={url} alt={getFileName(url)} className="gnrm-media--image"/>
                                                                                }
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
                                        <label>Data Dukung</label>
                                        <label htmlFor='testing2' className='label_lampiran'><span style={{marginRight:'15px'}}>+</span> PILIH DOKUMEN/FOTO</label>
                                        <input 
                                            id="testing2"
                                            className="gnrm-penjelasan" 
                                            style={{height: "42px", 
                                                    marginLeft: "28px", 
                                                    width: "955px"}} 
                                            onChange={onChangeFilesHasil}
                                            type="file"
                                            accept="image/* , application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.presentationml.slideshow , text/plain, application/pdf"
                                            name="media"
                                            multiple
                                        />
                                    </div>
                                    <div>
                                        {
                                            lampiranHasil && lampiranHasil.length > 0 ? (
                                                <div style={{height: "fit-content", 
                                                    marginLeft: "213px", 
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
                                                        lampiranHasil.map((lampiran,index) => {
                                                            const fileType = isFileImage(lampiran)
                                                            const objectURL = URL.createObjectURL(lampiran)
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
                                                                                    !fileType ? 
                                                                                        <img src={imgFile} alt={lampiran.name} style={{width:'150px' , height:'150px'}}className="gnrm-media--image" />
                                                                                    :
                                                                                        <img src={objectURL} alt={lampiran.name} className="gnrm-media--image" />
                                                                                }
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
                                                    marginLeft: "213px", 
                                                    border: '1px solid #ACACAC',
                                                    borderRadius: '5px',
                                                    width: "955px",
                                                    padding: '10px',
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    overflow: 'hidden'
                                                }} 
                                                >
                                                    {
                                                        lampiranHasiliUrl.map((url,index) => {
                                                            const fileType = isFileImageUrl(url)
                                                            return(
                                                                <div key={index}>
                                                                        <div style={{width:'150px', 
                                                                                    height:'150px', 
                                                                                    marginRight:'35px', 
                                                                                    position:'relative'}}
                                                                            className="d-flex align-items-center justify-content-center"
                                                                        >
                                                                            <div style={{width:'150px', height:'150px', overflow:'hidden', position:'absolute'}}>
                                                                                {
                                                                                    fileType ? 
                                                                                        <img src={url} alt={getFileName(url)} className="gnrm-media--image"/>
                                                                                    :
                                                                                        <img src={imgFile} alt={getFileName(url)} style={{width:'150px' , height:'150px'}}className="gnrm-media--image" />
                                                                                }
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
                                        <label>Data Dukung</label>
                                        <label htmlFor='testing3' className='label_lampiran'><span style={{marginRight:'15px'}}>+</span> PILIH DOKUMEN/FOTO</label>
                                        <input 
                                            id="testing3"
                                            className="gnrm-penjelasan" 
                                            style={{height: "42px", 
                                                    marginLeft: "28px", 
                                                    width: "955px"}} 
                                            onChange={onChangeFilesKetercapaian}
                                            type="file"
                                            accept="image/* , application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.presentationml.slideshow , text/plain, application/pdf"
                                            name="media"
                                            multiple
                                        />
                                    </div>
                                    <div>
                                        {
                                            lampiranKetercapaian && lampiranKetercapaian.length > 0 ? (
                                                <div style={{height: "fit-content", 
                                                    marginLeft: "213px", 
                                                    border: '1px solid #ACACAC',
                                                    borderRadius: '5px',
                                                    width: "955px",
                                                    border: '1px solid black',
                                                    padding: '10px',
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    overflow: 'hidden'
                                                }} 
                                                >
                                                    {
                                                        lampiranKetercapaian.map((lampiran,index) => {
                                                            const fileType = isFileImage(lampiran)
                                                            const objectURL = URL.createObjectURL(lampiran)
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
                                                                                    !fileType ? 
                                                                                        <img src={imgFile} alt={lampiran.name} style={{width:'150px' , height:'150px'}}className="gnrm-media--image" />
                                                                                    :
                                                                                        <img src={objectURL} alt={lampiran.name} className="gnrm-media--image" />
                                                                                }
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
                                                    marginLeft: "213px", 
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
                                                        lampiranKetercapaianUrl.map((url,index) => {
                                                            const fileType = isFileImageUrl(url)
                                                            return(
                                                                <div key={index}>
                                                                        <div style={{width:'150px', 
                                                                                    height:'150px', 
                                                                                    marginRight:'35px', 
                                                                                    position:'relative'}}
                                                                            className="d-flex align-items-center justify-content-center"
                                                                        >
                                                                            <div style={{width:'150px', height:'150px', overflow:'hidden', position:'absolute'}}>
                                                                                {
                                                                                    fileType ? 
                                                                                        <img src={url} alt={getFileName(url)} className="gnrm-media--image"/>
                                                                                    :
                                                                                        <img src={imgFile} alt={getFileName(url)} style={{width:'150px' , height:'150px'}}className="gnrm-media--image" />
                                                                                }
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
{/* 
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
                                                overflow: 'hidden'
                                            }} 
                                            >
                                                {
                                                    media.map((lampiran,index) => {
                                                        const objectURL = URL.createObjectURL(lampiran)
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
                                                overflow: 'hidden'
                                            }} 
                                            >
                                                {
                                                    mediaUrl.map((url,index) => {
                                                        return(
                                                            <div key={index}>
                                                                    <div style={{width:'150px', 
                                                                                height:'150px',  
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
                                            accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.presentationml.slideshow , text/plain, application/pdf,"
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
                                                    overflow: 'hidden'
                                                }} 
                                                >
                                                    {
                                                        berkas.map((lampiran,index) => {
                                                            const objectURL = URL.createObjectURL(lampiran)
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
                                                                                <img src={imgFile} style={{width: '150px' , height: '150px'}} alt={lampiran.name} className="gnrm-media--image"/>
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
                                                    overflow: 'hidden'
                                                }} 
                                                >
                                                    {
                                                        berkasUrl.map((url,index) => {
                                                            return(
                                                                <div key={index}>
                                                                        <div style={{width:'150px', 
                                                                                    height:'150px', 
                                                                                    marginRight:'35px', 
                                                                                    position:'relative'}}
                                                                            className="d-flex align-items-center justify-content-center"
                                                                        >
                                                                            <div style={{width:'150px', height:'150px', overflow:'hidden', position:'absolute'}}>
                                                                                <img src={imgFile} style={{width: '150px' , height: '150px'}} alt={getFileName(url)} className="gnrm-media--image"/>
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
                    </Element> */}

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
                                <div>
                                    <label>Lokasi</label>
                                    <input 
                                        className="monev-nip" 
                                        style={{height:"42px",
                                                width: "955px",
                                                marginLeft: "160px" 
                                        }}
                                        type="text" 
                                        name="lokasi"
                                        value={lokasi}
                                        onChange={(event) => onChange(event)} 
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

                                <button className="simpan-monev" type='submit'>SIMPAN PERUBAHAN</button>
                                
                                <button className="preview-monev" onClick={setPreview}>PRATINJAU LAPORAN</button>
                                
                            </div>
                        </div>
                    </Element>
                </form>
                :
                <form style={{width:'fit-content' , height:'fit-content' , margin:'auto'}} id='form-monev' onSubmit={isEditing ? onEdit : onSubmit}>
                    <Element id='identitas' name='identitas'>
                        <div className="monev-container-off">
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
                                    <label>Periode</label>
                                        {
                                            documentDetail && documentDetail.form.id_laporan ?
                                            <select 
                                                onChange={(event) => onChange(event)}  
                                                className="monev-id-program"
                                                name="id_laporan"
                                                style={{marginLeft:'150px'}}
                                            >
                                                
                                                {
                                                    pilihanPeriode.map((periode, i) => <option key={i} selected={documentDetail.form.id_laporan === periode && true} title={periode} value={periode}>{periode}</option>)
                                                }
                                                
                                            </select> :
                                            <select 
                                                onChange={(event) => onChange(event)} 
                                                className="monev-id-laporan"
                                                name="id_laporan"
                                                style={{marginLeft:'150px'}}
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
                                                    width: "767px"}} 
                                            type="text" 
                                            name="nama_program"
                                            value={kegiatan.nama_program}
                                            onChange={(event) => onChange(event,'kegiatan')}
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
                                                            style={{marginLeft: '69px', width:'767px' , height: '42px'}}
                                                        >
                                                            {
                                                                kpOptions&&kpOptions.map((kp, i) => <option key={i} selected={documentDetail.form.kp === kp && true} title={kp} value={kp}>{kp.length > 113 ? `${kp.substr(0, 110)}...` : kp}</option>)
                                                            }
                                                        </select> :
                                                        <select 
                                                            onChange={onChange} 
                                                            class="gnrm-select"
                                                            name="kp"
                                                            style={{marginLeft: '69px', width:'767px' , height: '42px' }}
                                                        >
                                                            <option selected={true} hidden></option>
                                                            {
                                                                kpOptions&&kpOptions.map((kp, i) => <option key={i} title={kp} value={kp}>{kp.length > 90 ? `${kp.substr(0, 87)}...` : kp}</option>)
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
                                                            style={{marginLeft: '84px' , width:'767px'}}
                                                        >
                                                            {
                                                                propOptions&&propOptions.map((prop, i) => <option key={i} selected={documentDetail.form.prop === prop && true} title={prop} value={prop}>{prop.length > 90 ? `${prop.substr(0, 87)}...` : prop}</option>)
                                                            }
                                                            {!selectedKp && <option>{'Pilih Kegiatan Prioritas\n\nterlebih dahulu'}</option>}
                                                        </select> :
                                                        <select 
                                                            onChange={onChange} 
                                                            class="gnrm-select selectpicker"
                                                            name="prop"
                                                            style={{marginLeft: '83px', width:'767px'}}
                                                        >
                                                            <option selected={true} hidden></option>
                                                            {
                                                                propOptions&&propOptions.map((prop, i) => <option key={i} title={prop} value={prop}>{prop.length > 90 ? `${prop.substr(0, 87)}...` : prop}</option>)
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
                                            
                            </div>
                            <div className="gnrm-navigation-button">
                                <Link 
                                    to="gugus_tugas"
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    offset={-30}
                                > 
                                    <button className="forward tes1"><i className="material-icons" style={{fontSize:'36px'}}>expand_more</i></button>
                                </Link>
                            </div>
                        </div>
                    </Element>

                    <Element id='gugus_tugas' name='gugus_tugas'>
                            <div className="monev-container-off" >
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
                                                                 <label htmlFor='testing10' className='label_lampiran' style={{marginLeft: '110px'}}><span style={{marginRight:'15px'}}>+</span> PILIH DOKUMEN/FOTO</label>
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
                                                                                                                            fileExt.toLowerCase() === 'pdf' ? 
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
                                                                            <label htmlFor='testing10' className='label_lampiran' style={{marginLeft: '110px'}}><span style={{marginRight:'15px'}}>+</span> PILIH DOKUMEN/FOTO</label>
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
                                                                                                                            fileExt.toLowerCase() === 'pdf' ? 
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
                                        to="tujuan_pelaporan"
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

                    <Element id='tujuan_pelaporan' name='tujuan_pelaporan'>
                        <div className="monev-container-off">
                            <div className="monev-title">
                                TUJUAN PROGRAM / KEGIATAN
                            </div>
                            <div className="form-monev">
                                <div>
                                    <label style={{textAlign:'right', clear:'both' , float:'left'}} >Penjelasan</label>
                                    <textarea 
                                        className="monev-penjelasan" 
                                        style={{height:"220px",
                                                width: "767px",
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
                                    to="gugus_tugas"
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    offset={-30}
                                > 
                                    <button className="previous1"><i className="material-icons" style={{fontSize:'36px'}}>expand_less</i></button>
                                </Link>
                                <Link 
                                    to="waktu_tempat"
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    offset={-30}
                                > 
                                    <button className="forward1"><i className="material-icons" style={{fontSize:'36px'}}>expand_more</i></button>
                                </Link>
                            </div>
                        </div>
                    </Element>

                    <Element id='waktu_tempat' name='waktu_tempat'>
                        <div className="monev-container-off">
                            <div className="monev-title">
                                WAKTU, TEMPAT, DAN METODOLOGI MONEV
                            </div>
                            <div className="form-monev">
                                <div>
                                    <label>Waktu</label>
                                    <input 
                                        className="monev-waktu" 
                                        style={{height:"42px",
                                                width: "767px",
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
                                                width: "767px",
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
                                                width: "767px",
                                                marginLeft: "32px" 
                                        }}
                                        type="text" 
                                        name="metode"
                                        value={metode}
                                        onChange={(event) => onChange(event)} 
                                    />
                                </div>
                                <div>
                                        <label>Data Dukung</label>
                                        <label htmlFor='testing' className='label_lampiran'><span style={{marginRight:'15px'}}>+</span> PILIH DOKUMEN/FOTO</label>
                                        <input 
                                            id="testing"
                                            className="gnrm-penjelasan" 
                                            style={{height: "42px", 
                                                    marginLeft: "28px", 
                                                    width: "955px"}} 
                                            onChange={onChangeFilesTempat}
                                            type="file"
                                            accept="image/* , application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.presentationml.slideshow , text/plain, application/pdf"
                                            name="media"
                                            multiple
                                        />
                                    </div>
                                    <div>
                                        {
                                            lampiranTempat && lampiranTempat.length > 0 ? (
                                                <div style={{height: "fit-content", 
                                                    marginLeft: "213px", 
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
                                                        lampiranTempat.map((lampiran,index) => {
                                                            const fileType = isFileImage(lampiran)
                                                            const fileExt = getFIleExtension(lampiran.name)
                                                            const objectURL = URL.createObjectURL(lampiran)
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
                                                                                !fileType ? 
                                                                                    <img src={imgFile} alt={lampiran.name} style={{width:'150px' , height:'150px'}}className="gnrm-media--image" />
                                                                                :
                                                                                    <img src={objectURL} alt={lampiran.name} className="gnrm-media--image" />
                                                                            }
                                                                                {/* <img src={objectURL} alt={lampiran.name} className="gnrm-media--image"/> */}
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
                                                    marginLeft: "213px", 
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
                                                        lampiranTempatUrl.map((url,index) => {
                                                            const fileType = isFileImageUrl(url)
                                                            return(
                                                                <div key={index}>
                                                                        <div style={{width:'150px', 
                                                                                    height:'150px', 
                                                                                    marginRight:'35px', 
                                                                                    position:'relative'}}
                                                                            className="d-flex align-items-center justify-content-center"
                                                                        >
                                                                            <div style={{width:'150px', height:'150px', overflow:'hidden', position:'absolute'}}>
                                                                                {
                                                                                    fileType ? 
                                                                                        <img src={url} alt={getFileName(url)} className="gnrm-media--image"/>
                                                                                    :
                                                                                        <img src={imgFile} alt={getFileName(url)} style={{width:'150px' , height:'150px'}}className="gnrm-media--image" />
                                                                                }
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
                                    <button className="previous1"><i className="material-icons" style={{fontSize:'36px'}}>expand_less</i></button>
                                </Link>
                                <Link 
                                    to="hasil"
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    offset={-30}
                                > 
                                    <button className="forward1"><i className="material-icons" style={{fontSize:'36px'}}>expand_more</i></button>
                                </Link>
                            </div>
                        </div>
                    </Element>
                    
                    <Element id='hasil' name='hasil'>
                        <div className="monev-container-off">
                            <div className="monev-title">
                                HASIL MONITORING DAN KENDALA PROGRAM
                            </div>
                            <div className="form-monev">
                                <div>
                                    <label style={{textAlign:'right', clear:'both' , float:'left'}}>Hasil Monitoring</label>
                                    <textarea 
                                        className="monev-hasil-monitoring" 
                                        style={{height:"400px",
                                                width: "767px",
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
                                                width: "767px",
                                                marginLeft: "76px" 
                                        }}
                                        type="text" 
                                        name="evaluasi"
                                        value={evaluasi}
                                        onChange={(event) => onChange(event)} 
                                    />
                                </div>
                                <div>
                                        <label>Data Dukung</label>
                                        <label htmlFor='testing2' className='label_lampiran'><span style={{marginRight:'15px'}}>+</span> PILIH DOKUMEN/FOTO</label>
                                        <input 
                                            id="testing2"
                                            className="gnrm-penjelasan" 
                                            style={{height: "42px", 
                                                    marginLeft: "28px", 
                                                    width: "955px"}} 
                                            onChange={onChangeFilesHasil}
                                            type="file"
                                            accept="image/* , application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.presentationml.slideshow , text/plain, application/pdf"
                                            name="media"
                                            multiple
                                        />
                                    </div>
                                    <div>
                                        {
                                            lampiranHasil && lampiranHasil.length > 0 ? (
                                                <div style={{height: "fit-content", 
                                                    marginLeft: "213px", 
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
                                                        lampiranHasil.map((lampiran,index) => {
                                                            const fileType = isFileImage(lampiran)
                                                            const objectURL = URL.createObjectURL(lampiran)
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
                                                                                    !fileType ? 
                                                                                        <img src={imgFile} alt={lampiran.name} style={{width:'150px' , height:'150px'}}className="gnrm-media--image" />
                                                                                    :
                                                                                        <img src={objectURL} alt={lampiran.name} className="gnrm-media--image" />
                                                                                }
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
                                                    marginLeft: "213px", 
                                                    border: '1px solid #ACACAC',
                                                    borderRadius: '5px',
                                                    width: "767px",
                                                    padding: '10px',
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    overflow: 'hidden'
                                                }} 
                                                >
                                                    {
                                                        lampiranHasiliUrl.map((url,index) => {
                                                            const fileType = isFileImageUrl(url)
                                                            return(
                                                                <div key={index}>
                                                                        <div style={{width:'150px', 
                                                                                    height:'150px', 
                                                                                    marginRight:'35px', 
                                                                                    position:'relative'}}
                                                                            className="d-flex align-items-center justify-content-center"
                                                                        >
                                                                            <div style={{width:'150px', height:'150px', overflow:'hidden', position:'absolute'}}>
                                                                                {
                                                                                    fileType ? 
                                                                                        <img src={url} alt={getFileName(url)} className="gnrm-media--image"/>
                                                                                    :
                                                                                        <img src={imgFile} alt={getFileName(url)} style={{width:'150px' , height:'150px'}}className="gnrm-media--image" />
                                                                                }
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
                                    <button className="previous1"><i className="material-icons" style={{fontSize:'36px'}}>expand_less</i></button>
                                </Link>
                                <Link 
                                    to="ketercapaian"
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    offset={-30}
                                > 
                                    <button className="forward1"><i className="material-icons" style={{fontSize:'36px'}}>expand_more</i></button>
                                </Link>
                            </div>
                        </div>
                    </Element>

                    <Element id='ketercapaian' name='ketercapaian'>
                        <div className="monev-container-off">
                            <div className="monev-title">
                                KETERCAPAIAN TARGET DAN INDIKATOR
                            </div>
                            <div className="form-monev">
                                <div>
                                    <label style={{textAlign:'right', clear:'both' , float:'left'}}>Penjelasan</label>
                                    <textarea 
                                        className="monev-penjelasan" 
                                        style={{height:"300px",
                                                width: "767px",
                                                marginLeft: "127px" 
                                        }}
                                        type="text" 
                                        name="ketercapaian"
                                        value={ketercapaian}
                                        onChange={(event) => onChange(event)} 
                                    />
                                </div>
                                <div>
                                        <label>Data Dukung</label>
                                        <label htmlFor='testing3' className='label_lampiran'><span style={{marginRight:'15px'}}>+</span> PILIH DOKUMEN/FOTO</label>
                                        <input 
                                            id="testing3"
                                            className="gnrm-penjelasan" 
                                            style={{height: "42px", 
                                                    marginLeft: "28px", 
                                                    width: "767px"}} 
                                            onChange={onChangeFilesKetercapaian}
                                            type="file"
                                            accept="image/* , application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.presentationml.slideshow , text/plain, application/pdf"
                                            name="media"
                                            multiple
                                        />
                                    </div>
                                    <div>
                                        {
                                            lampiranKetercapaian && lampiranKetercapaian.length > 0 ? (
                                                <div style={{height: "fit-content", 
                                                    marginLeft: "213px", 
                                                    border: '1px solid #ACACAC',
                                                    borderRadius: '5px',
                                                    width: "767px",
                                                    border: '1px solid black',
                                                    padding: '10px',
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    overflow: 'hidden'
                                                }} 
                                                >
                                                    {
                                                        lampiranKetercapaian.map((lampiran,index) => {
                                                            const fileType = isFileImage(lampiran)
                                                            const objectURL = URL.createObjectURL(lampiran)
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
                                                                                    !fileType ? 
                                                                                        <img src={imgFile} alt={lampiran.name} style={{width:'150px' , height:'150px'}}className="gnrm-media--image" />
                                                                                    :
                                                                                        <img src={objectURL} alt={lampiran.name} className="gnrm-media--image" />
                                                                                }
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
                                                    marginLeft: "213px", 
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
                                                        lampiranKetercapaianUrl.map((url,index) => {
                                                            const fileType = isFileImageUrl(url)
                                                            return(
                                                                <div key={index}>
                                                                        <div style={{width:'150px', 
                                                                                    height:'150px', 
                                                                                    marginRight:'35px', 
                                                                                    position:'relative'}}
                                                                            className="d-flex align-items-center justify-content-center"
                                                                        >
                                                                            <div style={{width:'150px', height:'150px', overflow:'hidden', position:'absolute'}}>
                                                                                {
                                                                                    fileType ? 
                                                                                        <img src={url} alt={getFileName(url)} className="gnrm-media--image"/>
                                                                                    :
                                                                                        <img src={imgFile} alt={getFileName(url)} style={{width:'150px' , height:'150px'}}className="gnrm-media--image" />
                                                                                }
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
                                    <button className="previous1"><i className="material-icons" style={{fontSize:'36px'}}>expand_less</i></button>
                                </Link>
                                <Link 
                                    to="tindak_lanjut"
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    offset={-30}
                                > 
                                    <button className="forward1"><i className="material-icons" style={{fontSize:'36px'}}>expand_more</i></button>
                                </Link>
                            </div>
                        </div>
                    </Element>

                    <Element id='tindak_lanjut' name='tindak_lanjut'>
                        <div className="monev-container-off">
                            <div className="monev-title">
                                TINDAK LANJUT HASIL MONITORING DAN EVALUASI
                            </div>
                            <div className="form-monev">
                                <div>
                                    <label style={{textAlign:'right', clear:'both' , float:'left'}}>Penjelasan</label>
                                    <textarea 
                                        className="monev-penjelasan" 
                                        style={{height:"300px",
                                                width: "767px",
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
                                    <button className="previous1"><i className="material-icons" style={{fontSize:'36px'}}>expand_less</i></button>
                                </Link>
                                <Link 
                                    to="lampiran"
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    offset={-30}
                                > 
                                    <button className="forward1"><i className="material-icons" style={{fontSize:'36px'}}>expand_more</i></button>
                                </Link>
                            </div>
                        </div>
                    </Element>
{/* 
                    <Element id='lampiran' name='lampiran'>
                        <div className="monev-container-off">
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
                                            width: "767px"}} 
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
                                                width: "767px",
                                                padding: '10px',
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                overflow: 'hidden'
                                            }} 
                                            >
                                                {
                                                    media.map((lampiran,index) => {
                                                        const objectURL = URL.createObjectURL(lampiran)
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
                                                    mediaUrl.map((url,index) => {
                                                        return(
                                                            <div key={index}>
                                                                    <div style={{width:'150px', 
                                                                                height:'150px',  
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
                                            accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.presentationml.slideshow , text/plain, application/pdf,"
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
                                                    width: "767px",
                                                    padding: '10px',
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    overflow: 'hidden'
                                                }} 
                                                >
                                                    {
                                                        berkas.map((lampiran,index) => {
                                                            const objectURL = URL.createObjectURL(lampiran)
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
                                                                                <img src={imgFile} style={{width: '150px' , height: '150px'}} alt={lampiran.name} className="gnrm-media--image"/>
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
                                                    width: "767px",
                                                    padding: '10px',
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    overflow: 'hidden'
                                                }} 
                                                >
                                                    {
                                                        berkasUrl.map((url,index) => {
                                                            return(
                                                                <div key={index}>
                                                                        <div style={{width:'150px', 
                                                                                    height:'150px', 
                                                                                    marginRight:'35px', 
                                                                                    position:'relative'}}
                                                                            className="d-flex align-items-center justify-content-center"
                                                                        >
                                                                            <div style={{width:'150px', height:'150px', overflow:'hidden', position:'absolute'}}>
                                                                                <img src={imgFile} style={{width: '150px' , height: '150px'}} alt={getFileName(url)} className="gnrm-media--image"/>
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
                                    <button className="previous1"><i className="material-icons" style={{fontSize:'36px'}}>expand_less</i></button>
                                </Link>
                                <Link 
                                    to="penanggung_jawab"
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    offset={-30}
                                > 
                                    <button className="forward1"><i className="material-icons" style={{fontSize:'36px'}}>expand_more</i></button>
                                </Link>
                            </div>
                        </div>
                    </Element> */}

                    <Element id='penanggung_jawab' name='penanggung_jawab'>
                        <div className="monev-container-off" style={{marginBottom:"296px"}}>
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
                                <div>
                                    <label>Lokasi</label>
                                    <input 
                                        className="monev-nip" 
                                        style={{height:"42px",
                                                width: "767px",
                                                marginLeft: "160px" 
                                        }}
                                        type="text" 
                                        name="lokasi"
                                        value={lokasi}
                                        onChange={(event) => onChange(event)} 
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
                                    <button className="previous-last-11"><i className="material-icons">expand_less</i></button>
                                </Link>

                                <button className="simpan-monev" type='submit'>SIMPAN PERUBAHAN</button>
                                
                                <button className="preview-monev" onClick={setPreview}>PRATINJAU LAPORAN</button>
                                
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
            <div className={isPreviewing ? "preview-page" : "d-none"}>
                    <div className="title-preview-page">
                        PREVIEW LAPORAN
                    </div>
                    {
                    loading ?
                    <div style={{ marginLeft: '68px' }}>
                        <div className="d-flex justify-content-center align-items-center" style={{ width: '100%', height: '60vh', overflow: 'hidden' }}>
                            <Spinner />
                        </div> 
                    </div>
                    :
                    <div style={sidebar ? {marginLeft:'188px' , marginRight:'20px' ,  transition: 'all 0.3s ease-in-out'} : {transition: 'all 0.3s ease-in-out'}}>
                    <div className="preview-picture" style={{padding: '43px 98px' , marginLeft:'84px' , marginRight:'20px'}}>
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

                            <hr style={{backgroundColor: 'black'}}/>
                            <br/>
                            <div className="judul-preview" style={{textAlign:"center", fontSize:'12px'}}>
                                <h1 style={{lineHeight:'25px', fontWeight:'bold'}}>
                                    Proteksi Hasil Monitoring dan Evaluasi 
                                </h1>

                                <h1 style={{lineHeight:'25px', fontWeight:'bold'}}>
                                    GERAKAN NASIONAL REVOLUSI MENTAL (GNRM) Tahun {data.tahun}
                                </h1><br/>
                                
                                <h1 style={{lineHeight:'15px'}}>Dilarang menyalin, menyimpan, memperbanyak sebagian atau seluruh isi laporan ini dalam bentuk <br/> apapun kecuali oleh Koordinator Pelaksana Gerakan (KPG) dan Sekretariat Revolusi Mental</h1><br/>

                                <h1 style={{lineHeight:'35px', fontWeight:'bold'}}>
                                    LAPORAN MONITORING DAN EVALUASI<br/>
                                    GNRM {data.tahun}
                                </h1><br/>
                                
                                <h1 style={{lineHeight:'15px'}}> 
                                    Periode Laporan Program/Kegiatan
                                </h1>

                                <h1 style={{lineHeight:'15px'}}> 
                                    Laporan {data.id_laporan} GNRM Tahun {data.tahun} <br/>
                                    {instansiDocumentDetail && instansiDocumentDetail.nama}
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
                                        <tr>
                                            <td></td>
                                            <td style={{ paddingTop: '12px', paddingBottom: '32px' }}>Waktu Unggah : {str}</td>
                                        </tr>
                                       <tr style={{fontWeight:'bold'}}>
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
                                       <tr style={{fontWeight:'bold'}}>
                                            <td>2.</td>
                                            <td>Tujuan Program/Kegiatan</td> 
                                       </tr>
                                       <tr>
                                            <td></td>
                                            <td style={{paddingTop:'12px', paddingBottom:'32px'}}>
                                                Nama Program : {data.kegiatan.nama_program}<br />
                                                Kegiatan Prioritas : {data.kp}<br />
                                                Program Prioritas: {data.prop}<br />
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
                                                        lampiranTempat && lampiranTempat.filter(lampiran => isFileImage(lampiran) === true).map((lampiran,index) => {
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
                                                                        <img src={objectURL} alt={lampiran.name} style={{ width: '420px' , height: '420px' , objectFit:'contain'}} />
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
                                            <td style={{ paddingTop: '12px', paddingBottom: '32px' }}>
                                                {
                                                    lampiranTempat && lampiranTempat.filter(lampiran => isFileImage(lampiran) === false).map((lampiran,index) => {
                                                    const objectURL = URL.createObjectURL(lampiran)
                                                    return(
                                                        <p className="gnrm-media--name" style={{textAlign:'left'}}>
                                                            {lampiran.name}
                                                        </p>
                                                    )  
                                                    })
                                                }
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
                                                        lampiranHasil && lampiranHasil.filter(lampiran => isFileImage(lampiran) === true).map((lampiran,index) => {
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
                                                                        <img src={objectURL} alt={lampiran.name} style={{ width: '420px' , height: '420px' , objectFit:'contain'}} />
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
                                            <td style={{ paddingTop: '12px', paddingBottom: '32px' }}>
                                                {
                                                    lampiranHasil && lampiranHasil.filter(lampiran => isFileImage(lampiran) === false).map((lampiran,index) => {
                                                    const objectURL = URL.createObjectURL(lampiran)
                                                    return(
                                                        <p className="gnrm-media--name" style={{textAlign:'left'}}>
                                                            {lampiran.name}
                                                        </p>
                                                    )  
                                                    })
                                                }
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
                                                        lampiranKetercapaian && lampiranKetercapaian.filter(lampiran => isFileImage(lampiran) === true).map((lampiran,index) => {
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
                                                                        <img src={objectURL} alt={lampiran.name} style={{ width: '420px' , height: '420px' , objectFit:'contain'}} />
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
                                            <td style={{ paddingTop: '12px', paddingBottom: '32px' }}>
                                                {
                                                    lampiranKetercapaian && lampiranKetercapaian.filter(lampiran => isFileImage(lampiran) === false).map((lampiran,index) => {
                                                    const objectURL = URL.createObjectURL(lampiran)
                                                    return(
                                                        <p className="gnrm-media--name" style={{textAlign:'left'}}>
                                                            {lampiran.name}
                                                        </p>
                                                    )  
                                                    })
                                                }
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
                                       {/* <tr style={{fontWeight:'bold'}}>
                                            <td>7.</td>
                                            <td>Lampiran Media dan Berkas</td> 
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
                                                                    <div style={{ width: '420px', height: '420px' ,overflow: 'hidden', position: 'relative' }}>
                                                                        <img src={objectURL} alt={lampiran.name} style={{ width: '420px' , height: '420px', objectFit:'contain'}}/>
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
                                        </tr> */}
                                        {/* <tr>
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
                                                        berkas && berkas.map((lampiran,index) => {
                                                        return(
                                                            <div key={index}>
                                                                <div style={{
                                                                    width: '150px',
                                                                    height: '150px',
                                                                    marginRight: '35px',
                                                                    position: 'relative'
                                                                }}
                                                                    className="d-flex align-items-center justify-content-center"
                                                                >
                                                                    <div style={{ width: '150px', height: '150px', overflow: 'hidden', position: 'absolute' }}>
                                                                        <img src={imgFile} alt={lampiran.name} style={{ width: '150px', height: '150px'}} className="gnrm-media--image" />
                                                                    </div>
                                                                </div>
                                                                <div style={{
                                                                    marginTop: '10px',
                                                                    width: '150px',
                                                                    height: '20px',
                                                                    wordWrap: 'break-word',
                                                                    lineHeight: '20px',
                                                                }}
                                                                >
                                                                    <p className="gnrm-media--name" style={{textAlign:'center'}}>
                                                                        {lampiran.name.length > 18 ? `${lampiran.name.substr(0, 15)}...` : lampiran.name}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )  
                                                        })
                                                    }
                                                </div>
                                            </td>
                                        </tr> */}
                                       <tr>
                                            <td></td>
                                            <td style={{paddingTop:'154px'}}>
                                            Demikian  laporan monitoring dan evaluasi {data.id_laporan} GNRM ini disampaikan, <br/> 
                                            atas perhatian dan kerja samanya diucapkan terimakasih.</td> 
                                       </tr>
                                    </tbody> 
                                </table>
                            </div>
                            <div className="preview-ttd" style={{ marginTop: '10px', fontSize: '12px', textAlign:'right' }}>
                                <div style={{ textAlign: 'left'}}>
                                <h1 style={{marginLeft: '893px' }}>Pengesahan Laporan</h1>
                                {data.lokasi.length > 10 ?
                                    <h1 style={{textAlign:'right'}}>{data.lokasi}, {str2}</h1>
                                    :
                                    <h1 style={{marginLeft: '893px'}}>{data.lokasi}, {str2}</h1>
                                }
                                    <h1 style={{marginLeft: '893px' }}>{data.penanggung_jawab.jabatan}</h1>
                                    <br />
                                    <br />
                                    <br />
                                    <h1 style={{marginLeft: '893px' }}>TTD</h1>
                                    <br />
                                    <br />
                                    <br />
                                    <h1 style={{marginLeft: '893px' }}>{data.penanggung_jawab.nama}</h1>
                                    <h1 style={{marginLeft: '893px' }}>NIP. {data.penanggung_jawab.nip}</h1>
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
                            
                            <button className="button-unggah" type='submit' form="form-monev">UNGGAH LAPORAN</button>
                    </div>
                    </div>
                    }
                </div>
                {/* -------------------------- PREVIEW SECTION START HERE ---------------------------------*/}
        </Fragment>  
    );
}


export default FormMonev;