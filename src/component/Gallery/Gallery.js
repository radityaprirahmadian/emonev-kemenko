import React,{Fragment, Component, useEffect, useState, useContext} from 'react';
import './Gallery.css';
import axios from 'axios'
import background from '../../assets/background.png';
import trash from '../../assets/trash.png';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'
import { AuthContext } from '../../context/Auth/AuthContext';

const Gallery = () => {
    const { user, token, userDetail } = useContext(AuthContext)
    const [gallery , setGallery] = useState([])
    const [gambar,setGambar] = useState([])
    const [page , setPage] = useState('1')
    const [identifier,setIdentifier] = useState('')
    const [open, setOpen] = useState(false)
    const [galleriIndex , setGalleriIndex] = useState(0)
console.log(userDetail)
    const getAllGallery = async () => {
        try {
            if(userDetail){
                if(userDetail.role === 'admin'){
                    const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/galeri?instansi=${userDetail.instansi.nama_pendek}`)
                    console.log(res)
                    const wowo = res.data.galeri.map(galeri => galeri.media.map(galeri =>`https://api.simonev.revolusimental.go.id${galeri}` ))
                    setGallery(wowo)
                } else {
                    const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/galeri`)
                    console.log(res)
                    const wowo = res.data.galeri.map(galeri => galeri.media.map(galeri =>`https://api.simonev.revolusimental.go.id${galeri}` ))
                    setGallery(wowo)
                }
            }
            else {
                const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/galeri`)
                console.log(res)
                const wowo = res.data.galeri.map(galeri => galeri.media.map(galeri =>`https://api.simonev.revolusimental.go.id${galeri}` ))
                setGallery(wowo)
            }
        }
        catch(err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getAllGallery();
    },[])

    const deleteGallery = async (e) => {
        const config={
            headers: {
                'X-Auth-Token' : `aweuaweu ${token}`
            }
        }
        try {
            await axios.delete(`https://api.simonev.revolusimental.go.id/api/v1/galeri/${identifier}`,config)
            setIdentifier(null)
            getAllGallery()
            setGalleriIndex(galleriIndex+1)
        }
        catch (err) {
            console.log(err)
        }
    }

    const onOpen = (e,index,galler) => {
        e.preventDefault()
        setOpen(true)
        setGambar(galler)
        console.log(gambar)
    }

    const onClose = (e) => {
        e.preventDefault()
        setOpen(false)
    }

    const onClickGambar = (e) => {
        e.preventDefault()
        setIdentifier(gambar[galleriIndex].split('/').slice(-2).join('/'))
    }

    const onHapus = (e) => {
        deleteGallery()
    }
    console.log(identifier)
    console.log(gambar)


        return(
            <Fragment>
                <div className="gallery-container">
                    {
                        gallery.map((galler,index) => {
                            return(
                                <Fragment>
                                    <div className="gallery-item" onClick={(e) => onOpen(e,index,galler)}>
                                        <img src={galler[0]} alt={`gallery-${index}`} style={{cursor:'pointer'}}></img>
                                    </div>
                                        {
                                            open ? 
                                                <Fragment>
                                                    <Lightbox
                                                        mainSrc={gambar[galleriIndex]}
                                                        nextSrc={gambar[(galleriIndex + 1) % gambar.length]}
                                                        prevSrc={gambar[(galleriIndex + gambar.length - 1) % gambar.length]}
                                                        onCloseRequest={() => setOpen(false)}
                                                        onMovePrevRequest={() =>
                                                        setGalleriIndex((galleriIndex + gambar.length - 1) % gambar.length)}
                                                        onMoveNextRequest={() =>
                                                        setGalleriIndex((galleriIndex + 1) % gambar.length)}
                                                    />
                                                    {
                                                        user && user.role === 'owner' ?
                                                                <img src={trash} onClick={onClickGambar} style={{position:'fixed', top:'16px' , right:'150px' , zIndex:'9999'}}/>
                                                        : 
                                                        ''
                                                    }
                                                    {
                                                        identifier ? 
                                                            <button onClick={onHapus} style={{position:'fixed', top:'16px' , right:'600px' , zIndex:'9999'}} > HAPUS </button>
                                                        : 
                                                        ''
                                                    }
                                                </Fragment>
                                                
                                            : ''
                                        }
                                </Fragment> 
                            )
                        })
                    }
                </div>
            </Fragment>
        )
}

export default Gallery;