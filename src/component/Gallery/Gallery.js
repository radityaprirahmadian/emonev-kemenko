import React,{Fragment, Component, useEffect, useState, useContext} from 'react';
import './Gallery.css';
import axios from 'axios'
import triangle from '../../assets/Vector.png';
import hapuss from '../../assets/mdi_delete.png';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'
import Pagination from "react-js-pagination";
import { AuthContext } from '../../context/Auth/AuthContext';
import { BrowserRouter as Router, Route, Link, NavLink, useLocation } from "react-router-dom";
import ReactPaginate from 'react-paginate';
// import ".../bootstrap/less/bootstrap.less";
import Spinner from '../../component/Spinner/Spinner'

const Gallery = (props) => {
    const { user, token, userDetail } = useContext(AuthContext)
    const [gallery , setGallery] = useState([])
    const [gambar,setGambar] = useState([])
    const [page , setPage] = useState('1')
    const [identifier,setIdentifier] = useState('')
    const [total , setTotal] =  useState('')
    const [open, setOpen] = useState(false)
    const [galleriIndex , setGalleriIndex] = useState(0)
    const [loading,setLoading] = useState(false)
    console.log(userDetail)

    const [filter,setFilter] = useState({
        pages: '1',
        limit: '9'
    })

    const {
        pages,
        limit
    } = filter

    console.log(gallery)

    const getAllGallery = async () => {
        setLoading(true)
        try {
            if(userDetail){
                if(userDetail.role === 'admin'){
                    const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/galeri?instansi=${userDetail&&userDetail.instansi.nama_pendek}&page=${pages}&limit=${limit}`)
                    setTotal(res.data.total_gnrm)
                    setPage(Math.ceil(res.data.total / 9))
                    console.log(res)
                    const wowo = res.data.galeri.map(galeri => galeri.media.map(galeri =>`https://api.simonev.revolusimental.go.id${galeri}` ))
                    setGallery(res.data.galeri)
                } else {
                    const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/galeri?page=${pages}&limit=${limit}`)
                    setTotal(res.data.total_gnrm)
                    setPage(Math.ceil(res.data.total / 9))
                    const wowo = res.data.galeri.map(galeri => galeri.media.map(galeri =>`https://api.simonev.revolusimental.go.id${galeri}` ))
                    setGallery(res.data.galeri)
                    console.log(res)

                }
            }
            else {
                const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/galeri?page=${pages}&limit=${limit}`)
                setTotal(res.data.total_gnrm)
                setPage(Math.ceil(res.data.total / 9))
                console.log(res)
                const wowo = res.data.galeri.map(galeri => galeri.media.map(galeri =>`https://api.simonev.revolusimental.go.id${galeri}` ))
                setGallery(res.data.galeri)
            }
        }
        catch(err) {
            console.log(err)
        }
        setLoading(false)
    }

    useEffect(() => {
        getAllGallery();
    },[filter , userDetail])

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

    const onTidakHapus = (e) => {
        e.preventDefault()
        setIdentifier('')
    }

    const handleChange = (pageNumber) => {
        setFilter({...filter , pages: JSON.stringify(pageNumber)})
        console.log(pageNumber)
    }

    // const arrayTest = ['1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1']

    // const [awal,setAwal] = useState(0)
    // const [batas,setBatas] = useState(9)
    // const [activePage,setActivePage] = useState(1)
    // const [totalPage,setTotalPage] = useState(1)
    // const [paging,setPaging] = useState([])

    // useEffect(() => {
    //     if(arrayTest.length % 9 === 0 ) {
    //         setTotalPage(parseInt(arrayTest.length / 9))
    //     } else setTotalPage(parseInt(arrayTest.length / 9 + 1))
    // },[])

    // useEffect(() => {
    //     for(let i = 1 ; i <= totalPage ; i++){
    //         setPaging([paging + i])
    //         console.log('paging' , paging)
    //     }
    // },[totalPage])

    // const handleGallery = (e) => {
    //     e.preventDefault()
    //     if(batas + 1 <= arrayTest.length ) {
    //         setAwal(awal + 9)
    //         setBatas(batas + 9)
    //         setActivePage(activePage+1)
    //     }
    // }

    // const handleChange = (pageNumber) => {
    //     setFilter({...filter,pages: pageNumber})
    // }
    // const handleGalleryPrev = (e) => {
    //     e.preventDefault()
    //     if(awal >= 9) {
    //         setAwal(awal - 9)
    //         setBatas(batas - 9)
    //         setActivePage(activePage-1)
    //     }
    // }

    // console.log(arrayTest.length)
    // console.log(awal)
    // console.log(batas)
    // console.log(paging)

        return(
            <Fragment>
                {
                    loading ?
                        <div style={{ marginLeft: '68px' }}>
                            <div className="d-flex justify-content-center align-items-center" style={{ width: '100%', height: '60vh', overflow: 'hidden' }}>
                                <Spinner />
                            </div> 
                        </div>
                        :
                        <Fragment>
                            <div className="gallery-container">
                                {
                                    gallery.map((galleri,index) => {
                                        const wowo = galleri.media.map(galeri =>`https://api.simonev.revolusimental.go.id${galeri}` )
                                        return(
                                            <Fragment>

                                                <div className="gallery-item" onClick={(e) => onOpen(e,index,wowo)}>
                                                    <img src={`https://api.simonev.revolusimental.go.id${galleri.media[0]}`} alt={`gallery-${index}`} style={{cursor:'pointer' }} className="test_gambar_gallery"></img>
                                                    <div className='test_gallery'></div>
                                                    <div className='hover-nama'>
                                                        {galleri.instansi.toUpperCase()}
                                                        {/* <img src={triangle} className='triangle' alt=''/> */}
                                                    </div> 
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
                                                                            <img src={hapuss} onClick={onClickGambar} style={{position:'fixed', top:'16px' , right:'150px' , zIndex:'9999' , cursor:'pointer'}}/>
                                                                    : 
                                                                    ''
                                                                }
                                                                {
                                                                    identifier ? 
                                                                        <div style={{position: 'fixed' ,top:'16px' , right:'600px', zIndex: '9999' ,backgroundColor: 'rgba(0,0,0,0.4)'}}>
                                                                            <div className="popup_delete" style={{width:'400px',height:'300px', borderRadius:'10px', padding:'28px', zIndex:'9998', backgroundColor:'white', position:'fixed',top:'20%',left:'40%'}}>
                                                                                <h1 style={{textAlign:'center', fontWeight:'700' , marginBottom:'32px' , fontSize:'18px'}}>Konfirmasi</h1><br/>
                                                                                <h1 style={{fontSize:'18px', textAlign:'center' , fontWeight:'normal', lineHeight:'20px'}}>Apakah anda yakin akan menghapus <br/> gambar ini?</h1>
                                                                                <div style={{marginTop:'30px', textAlign:'center'}}>
                                                                                    <button onClick={onHapus}  className="preview-gnrm" style={{width:'294px' , fontSize:'24px', height: '50px', borderRadius:'20px', backgroundColor:'#D4362E', color: 'white' , marginBottom:'16px' , boxShadow:'none'}}>Ya</button><br/>
                                                                                    <button onClick={onTidakHapus} className="preview-gnrm" style={{width:'294px' , fontSize:'24px', height: '50px', borderRadius:'20px', backgroundColor: '#E9E9E9' , color :'#656A6A' , boxShadow:'none'}}>Tidak</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
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
                            
                            {
                                !props.pagination ?
                                    <div className="div-button-gallery">
                                        <Link to='/galeri'>
                                            <button className="button-lihat-gallery">
                                                LIHAT GALERI LAINNYA
                                            </button>
                                        </Link>
                                    </div>
                                : ''
                            }
                            {
                                props.pagination && total > '9' ?
                                        <Pagination
                                            itemClass="page-item"
                                            linkClass="page-link"
                                            activePage={parseInt(pages)}
                                            itemsCountPerPage={parseInt(limit)}
                                            totalItemsCount={parseInt(total)}
                                            pageRangeDisplayed={5}
                                            onChange={handleChange}
                                            activeClass={'active'}
                                        />
                                : ''
                            }
                        </div>
                    </Fragment>
                }
            </Fragment>
        )
}

export default Gallery;