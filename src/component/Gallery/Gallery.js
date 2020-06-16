import React,{Fragment, Component, useEffect, useState} from 'react';
import './Gallery.css';
import axios from 'axios'
import background from '../../assets/background.png';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'

const Gallery = () => {
    const [gallery , setGallery] = useState([])
    const [gambar,setGambar] = useState([])
    const [page , setPage] = useState('1')
    const [open, setOpen] = useState(false)
    const [galleriIndex , setGalleriIndex] = useState(0)

    useEffect(() => {
        const getAllGallery = async () => {
            try {
                const res = await axios.get(`https://test.bariqmbani.me/api/v1/galeri`)
                console.log(res)
                const wow = res.data.galeri.map(galeri => galeri.media.map(galeri =>`https://test.bariqmbani.me${galeri}` ))
                setGallery(wow)
            }
            catch(err) {
                console.log(err)
            }
        }

        getAllGallery()
    },[])

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
    console.log(gallery)
    console.log(gambar)

        return(
            <Fragment>
                <div className="gallery-container">
                    {
                        gallery.map((galler,index) => {
                            return(
                                <Fragment>
                                    <div className="gallery-item" onClick={(e) => onOpen(e,index,galler)}>
                                        <img src={galler[0]} alt={`gallery-${index}`} ></img>
                                    </div>
                                        {
                                            open ? 
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
                                            : ''
                                        }
                                </Fragment>
                            )
                        })
                    }
                </div>


                )}
            </Fragment>
        )
}

export default Gallery;