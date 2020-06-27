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
                    const res = await axios.get(`https://test.bariqmbani.me/api/v1/galeri?instansi=${userDetail.instansi.nama_pendek}`)
                    console.log(res)
                    const wowo = res.data.galeri.map(galeri => galeri.media.map(galeri =>`https://test.bariqmbani.me${galeri}` ))
                    setGallery(wowo)
                } else {
                    const res = await axios.get(`https://test.bariqmbani.me/api/v1/galeri`)
                    console.log(res)
                    const wowo = res.data.galeri.map(galeri => galeri.media.map(galeri =>`https://test.bariqmbani.me${galeri}` ))
                    setGallery(wowo)
                }
            }
            else {
                const res = await axios.get(`https://test.bariqmbani.me/api/v1/galeri`)
                console.log(res)
                const wowo = res.data.galeri.map(galeri => galeri.media.map(galeri =>`https://test.bariqmbani.me${galeri}` ))
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
            await axios.delete(`https://test.bariqmbani.me/api/v1/galeri/${identifier}`,config)
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


    const arrayTest = ['1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1']

    const [awal,setAwal] = useState(0)
    const [batas,setBatas] = useState(9)
    const [activePage,setActivePage] = useState(1)
    const [totalPage,setTotalPage] = useState(1)
    const [paging,setPaging] = useState([])

    useEffect(() => {
        if(arrayTest.length % 9 === 0 ) {
            setTotalPage(parseInt(arrayTest.length / 9))
        } else setTotalPage(parseInt(arrayTest.length / 9 + 1))
    },[])

    useEffect(() => {
        for(let i = 1 ; i <= totalPage ; i++){
            setPaging([paging + i])
            console.log('paging' , paging)
        }
    },[totalPage])

    const handleGallery = (e) => {
        e.preventDefault()
        if(batas + 1 <= arrayTest.length ) {
            setAwal(awal + 9)
            setBatas(batas + 9)
            setActivePage(activePage+1)
        }
    }

    const handleGalleryPrev = (e) => {
        e.preventDefault()
        if(awal >= 9) {
            setAwal(awal - 9)
            setBatas(batas - 9)
            setActivePage(activePage-1)
        }
    }

    console.log(arrayTest.length)
    console.log(awal)
    console.log(batas)
    console.log(paging)

        return(
            <Fragment>
                <div className="gallery-container">
                    {
                        arrayTest.slice((awal),(batas)).map((array,index) => {
                            return(
                                <div className="gallery-item" key={index}>
                                    <img className='test_decor' src={background} alt='est'></img>
                                    <img className='test_gambar_gallery' src={background} alt='est' style={{cursor:'pointer' }}></img>
                                    <div className='test_gallery'></div>
                                </div>
                            )
                        })
                    }



                    
                    {/* {
                        gallery.map((galler,index) => {
                            return(
                                <Fragment>

                                    <div className="gallery-item" onClick={(e) => onOpen(e,index,galler)}>
                                        <div className='test_gallery'></div>
                                        <img src={galler[0]} alt={`gallery-${index}`} style={{cursor:'pointer' }}></img>
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
                    } */}
                </div>
                    <br/>
                    <br/>
                    <div className="gallery-pagination">
                        <i class="material-icons" onClick={handleGalleryPrev}>chevron_left</i>
                        <ul>
                            {
                                
                            }
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                            <li>5</li>
                        </ul>
                        <i class="material-icons" onClick={handleGallery}>chevron_right</i>
                    </div>
            </Fragment>
        )
}

export default Gallery;