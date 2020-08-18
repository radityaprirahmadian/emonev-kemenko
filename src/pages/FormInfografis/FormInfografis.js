import React,{Component,Fragment,useState,useContext,useEffect} from 'react';
import logo_kemenko from '../../assets/logo_kemenko.png'
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import {Link,useHistory} from 'react-router-dom';
import axios from 'axios'
import './FormInfografis.css'
import objectToFormData from '../../objectToFormDataUtil'
import lock from '../../assets/lock.png'
import { AuthContext } from '../../context/Auth/AuthContext'
import { ArtikelContext } from '../../context/Artikel/artikelContext';
import { InfografisContext } from '../../context/Infografis/InfografisContext';
import Popup from '../../component/Popup/Popup';
import Spinner from '../../component/Spinner/Spinner'
import bg_1 from '../../assets/decoration/bg_1.png'
import bg_2 from '../../assets/decoration/bg_2.png'
import bg_3 from '../../assets/decoration/bg_3.png'
import bg_4 from '../../assets/decoration/bg_4.png'
import {LayoutContext} from '../../context/Layout/LayoutContext'

const FormInfografis = (props) => {
    const { infografisDetail,setInfografis,isEditing,editDocument,editDocumentFalse, loading, setLoadingTrue, setLoadingFalse } = useContext(InfografisContext)
    const { token,userDetail } = useContext(AuthContext)
    const { sidebar } = useContext(LayoutContext)
    const history = useHistory()


    const [kabarGnrm,setKabarGnrm] = useState({
        deskripsi: '',
        judul : '',
        deleted_gambar: []
    })

    const {
        judul,
        deskripsi
    } = kabarGnrm

    const [media, setMedia] = useState([])
    const [mediaUrl, setMediaUrl] = useState([])
    const [deletedMedia, setDeletedMedia] = useState([])
    const [mediaSize , setMediaSize] = useState();
    console.log(mediaSize)

    const onChange = (e) => {
		setKabarGnrm({...kabarGnrm, [e.target.name]:e.target.value})
    }

    const onChangeFiles = (event) => {
        setMedia([...media , ...event.target.files])
        event.target.value = null
    }
    
    useEffect(() =>  {
        let size = 0;
        for (let i = 0 ; i < media.length ; i++) {
            size += media[i]&&media[i].size
        }
        setMediaSize(size)
    },[media])

    const onSubmit = async (event) => {
        setLoadingTrue()
        event.preventDefault()

        const formData = objectToFormData(kabarGnrm)

		for (let i = 0; i < media.length; i++) {
			formData.append(`gambar`, media[i])
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
            const res = await axios.post(`https://api.simonev.revolusimental.go.id/api/v1/kabar/`,formData,config)
            alert(res.data.message)
            setLoadingFalse()
            history.push(`/${userDetail&&userDetail.role === 'owner' ? 'super-admin' : 'admin'}/kabar-gnrm`)
        }
        catch(err) {
            alert(err.response.data.message)
            setLoadingFalse()
        }
    }

    const onEdit = async (event) => {
        setLoadingTrue()
        event.preventDefault()

		const formData = objectToFormData(kabarGnrm)

        if (media.length > 0) {
            for (let i = 0; i < media.length; i++) {
                formData.append(`gambar`, media[i])
            }
        }  else {formData.append('gambar', new File([null], 'blob'))}

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
            const res = await axios.put(`https://api.simonev.revolusimental.go.id/api/v1/kabar/${props.match.params.id}`,formData,config)
            alert(res.data.message)
            editDocumentFalse()
            setLoadingFalse()
            history.push(`/${userDetail&&userDetail.role === 'owner' ? 'super-admin' : 'admin'}/kabar-gnrm`)
        }
        catch(err) {
            alert(err.response.data.message)
            setLoadingFalse()
        }
    }
    
    const getFileName = (url) => {
        const split = url.split('/')
        return split[split.length - 1]
    }

    // const urlToFile = async (url) => {
    //     const getFileName = (url) => {
    //         const split = url.split('/')
    //         return split[split.length -1]
    //     }
        
    //     const name = getFileName(url)
        
    //     try {
    //         const res = await fetch(url)
    //         const blob = res.blob()
    //         return new File([blob],name)
    //     }
    //     catch(err) {
    //         console.log(err)
    //     }
    // }

    const onDeleteMedia = (isFile, filename, data) => {
        setMediaUrl(mediaUrl.filter(media => getFileName(media) !== filename))
        if (isFile) setMedia(media.filter(media => media !== data))
        else setMedia(media.filter(media => media.name !== filename))
        const deleted = [...deletedMedia, filename]
        setDeletedMedia(deleted)
    }

    useEffect(() => {
        if(props.match.params.id) {
            setInfografis(props.match.params.id)
        }
    },[props.match.params.id])

    useEffect(() => {
        if(infografisDetail){
            editDocument()
            setKabarGnrm({judul: infografisDetail.judul , deskripsi: infografisDetail.deskripsi})

            const mediaFileUrl = infografisDetail.gambar.map(gambar => `https://api.simonev.revolusimental.go.id${gambar.path}`)
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


    },[infografisDetail])

    useEffect(() => {
        setKabarGnrm({ ...kabarGnrm, deleted_gambar: deletedMedia})
    }, [deletedMedia])

    return(
        <Fragment>
            <SideBarOff setId={props.setId}/>
            <div className="background-after-login"/>
            <Popup notif={props.notif}/>
            <div className="background-after-login">
                <img src={bg_1} alt='bg1' style={{position: 'fixed' , top:'0' , left: '0'}}/>
                <img src={bg_2} alt='bg2' style={{position: 'fixed' , top:'0' , right: '0'}}/>
                <img src={bg_3} alt='bg3' style={{position: 'fixed' , bottom:'-200px' , left: '0'}}/>
                <img src={bg_4} alt='bg4' style={{position: 'fixed' , bottom:'-50px' , right: '0'}}/>
            </div>
            <div className="tajuk-page">
                <h1>FORMULIR KABAR GNRM</h1>
            </div>
            <div  style={{width:'fit-content' , height: 'fit-content', margin: 'auto'}}>

                {
                    loading ?
                        <div style={{ marginLeft: '68px' }}>
                            <div className="d-flex justify-content-center align-items-center" style={{ width: '100%', height: '60vh', overflow: 'hidden' }}>
                                <Spinner />
                            </div> 
                        </div>
                    :
                    <div style={sidebar ? {marginLeft:'188px' , transition: 'all 0.3s ease-in-out'} : {transition: 'all 0.3s ease-in-out'}}>
                        <form>
                            {
                                !sidebar ?
                                <Fragment>

                                    <div className="form-container" style={{marginRight:'20px' , transition: 'all 0.3s ease-in-out'}}>
                                        <div className="form-infografis">
                                            <div>
                                                <label>Judul Berita</label>
                                                <input 
                                                    type="text"
                                                    style={{width:'955px', height:'42px' , marginLeft:'123px', transition: 'all 0.3s ease-in-out'}} 
                                                    name='judul'
                                                    value={judul}
                                                    onChange={onChange}
                                                >
                                                </input>
                                            </div>
                                            <div>
                                                <label style={{textAlign:'right', clear:'both' , float:'left'}}>Penjelasan</label>
                                                <textarea  
                                                    type="text"
                                                    style={{width:'955px', height:'159px' , marginLeft:'130px' , transition: 'all 0.3s ease-in-out' , borderRadius: '5px' , borderColor:'#acacac' , padding:'10px'}} 
                                                    name='deskripsi'
                                                    className='deskripsi'
                                                    value={deskripsi}
                                                    onChange={onChange}
                                                >
                                                </textarea>
                                            </div>
                                            <div className='div_lampiran'>
                                                <label>Lampiran Kabar</label>
                                                <label htmlFor='testing' className='label_lampiran' style={{marginLeft:'87px' , width:'170px'}}><span style={{marginRight:'15px'}}>+</span> PILIH BERKAS</label>
                                                <input 
                                                    id="testing"
                                                    className="gnrm-penjelasan" 
                                                    onChange={onChangeFiles}
                                                    type="file"
                                                    accept=".jpg,.png,.jpeg"
                                                    name="media"
                                                    multiple
                                                />
                                                <h1 className='penjelasan_lampiran'>(Ukuran maksimal berkas 25MB, Gambar Potrait dengan skala 1:1)</h1>
                                            </div>
                                            <div>
                                                {
                                                    media && media.length > 0 ? (
                                                        <div style={{height: "fit-content", 
                                                            marginLeft: "217px", 
                                                            width: "955px",
                                                            border: '1px solid #ACACAC',
                                                            borderRadius: '5px',
                                                            transition: 'all 0.3s ease-in-out',
                                                            padding: '10px',
                                                            display: 'flex',
                                                            flexWrap: 'wrap',
                                                            overflow: 'hidden'
                                                        }} 
                                                        >
                                                            {
                                                                media.map((media,index) => {
                                                                    const objectURL = URL.createObjectURL(media)
                                                                    return(
                                                                        <div key={index}>
                                                                                <div style={{
                                                                                            marginTop:'10px',
                                                                                            width:'150px', 
                                                                                            height:'150px', 
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
                                                            marginLeft: "217px", 
                                                            width: "955px",
                                                            border: '1px solid #ACACAC',
                                                            borderRadius: '5px',
                                                            padding: '10px',
                                                            display: 'flex',
                                                            flexWrap: 'wrap',
                                                            transition: 'all 0.3s ease-in-out',
                                                            overflow: 'hidden'
                                                        }} 
                                                        >
                                                            {
                                                                mediaUrl.map((url,index) => {
                                                                    return(
                                                                        <div key={index}>
                                                                                <div style={{width:'150px', 
                                                                                            height:'150px', 
                                                                                            marginTop:'10px',
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
                                            <div>
                                                {
                                                    mediaSize > 25165824 ?
                                                        <div style={{marginLeft:'217px', color:'red'}}>Ukuran berkas melebihi ukuran maksimal (25MB)!</div>
                                                    : ''
                                                }
                                            </div>
                                        </div>

                                        <div className="admin-navigation-button" style={{textAlign:'right'}}>
                                            {
                                                isEditing ? 
                                                    <button type="submit" className="unggah-infografis" onClick={onEdit}>UNGGAH KABAR GNRM</button>
                                                :
                                                    <button type="submit" className="unggah-infografis" onClick={onSubmit}>UNGGAH KABAR GNRM</button>
                                            }
                                        </div>
                                    </div>
                                </Fragment>
                                :
                                <Fragment>
                                    <div className="form-container-test" style={{marginRight:'20px', transition: 'all 0.3s ease-in-out'}}>
                                        <div className="form-infografis">
                                            <div>
                                                <label>Judul Berita</label>
                                                <input 
                                                    type="text"
                                                    style={{width:'767px', height:'42px' , transition: 'all 0.3s ease-in-out' , marginLeft:'123px'}} 
                                                    name='judul'
                                                    value={judul}
                                                    onChange={onChange}
                                                >
                                                </input>
                                            </div>
                                            <div>
                                                <label style={{textAlign:'right', clear:'both' , float:'left'}}>Penjelasan</label>
                                                <textarea  
                                                    type="text"
                                                    className='deskripsi'
                                                    style={{width:'767px', height:'159px' , transition: 'all 0.3s ease-in-out', marginLeft:'130px' , borderRadius: '5px' , borderColor:'#acacac' , padding:'10px'}} 
                                                    name='deskripsi'
                                                    value={deskripsi}
                                                    onChange={onChange}
                                                >
                                                </textarea>
                                            </div>
                                            <div className='div_lampiran'>
                                                <label>Lampiran Kabar</label>
                                                <label htmlFor='testing' className='label_lampiran' style={{marginLeft:'87px' , width:'170px'}}><span style={{marginRight:'15px'}}>+</span> PILIH BERKAS</label>
                                                <input 
                                                    id="testing"
                                                    className="gnrm-penjelasan" 
                                                    onChange={onChangeFiles}
                                                    type="file"
                                                    accept=".jpg,.png,.jpeg"
                                                    name="media"
                                                    multiple
                                                />
                                                <h1 className='penjelasan_lampiran'>(Ukuran maksimal berkas 25MB, Gambar Potrait dengan skala 1:1)</h1>
                                            </div>
                                            <div>
                                                {
                                                    media && media.length > 0 ? (
                                                        <div style={{height: "fit-content", 
                                                            marginLeft: "217px", 
                                                            width: "767px",
                                                            border: '1px solid #ACACAC',
                                                            borderRadius: '5px',
                                                            padding: '10px',
                                                            display: 'flex',
                                                            flexWrap: 'wrap',
                                                            transition: 'all 0.3s ease-in-out',
                                                            overflow: 'hidden'
                                                        }} 
                                                        >
                                                            {
                                                                media.map((media,index) => {
                                                                    const objectURL = URL.createObjectURL(media)
                                                                    return(
                                                                        <div key={index}>
                                                                                <div style={{width:'150px', 
                                                                                            height:'150px', 
                                                                                            marginTop:'10px', 
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
                                                            marginLeft: "217px", 
                                                            width: "767px",
                                                            border: '1px solid #ACACAC',
                                                            borderRadius: '5px',
                                                            padding: '10px',
                                                            display: 'flex',
                                                            transition: 'all 0.3s ease-in-out',
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
                                                                                            marginTop:'10px', 
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
                                                {
                                                    mediaSize > 25165824 ?
                                                        <div style={{marginLeft:'217px', color:'red'}}>Ukuran berkas melebihi ukuran maksimal (25MB)!</div>
                                                    : ''
                                                }
                                        </div>
                                        <div className="admin-navigation-button" style={{textAlign:'right'}}>
                                            {
                                                isEditing ? 
                                                    <button type="submit" className="unggah-infografis" onClick={onEdit}>UNGGAH KABAR GNRM</button>
                                                :
                                                    <button type="submit" className="unggah-infografis" onClick={onSubmit}>UNGGAH KABAR GNRM</button>
                                            }
                                        </div>
                                    </div>
                                </Fragment>
                            }
                        </form>
                    </div>
                }
            </div>
        </Fragment>
    )
}

export default FormInfografis;