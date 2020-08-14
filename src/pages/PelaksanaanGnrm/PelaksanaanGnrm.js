import React,{Component,Fragment,useContext,useState,useEffect} from 'react';
import { AuthContext } from '../../context/Auth/AuthContext';
import { ArtikelContext } from '../../context/Artikel/artikelContext';
import axios from 'axios'
import './PelaksanaanGnrm.css';
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import SearchBar from '../../component/SearchBar/SearchBar';
import Card from '../../component/Card/Card';
import SearchBarAdmin from '../../component/SearchBarAdmin/SeacrhBarAdmin';
import plus from '../../assets/plus.png';
import Filter from '../../component/Filter/Filter';
import TabelGNRM from '../../component/TabelGNRM/TabelGNRM';
import Pagination from '../../component/Pagination/Pagination';
import { Link , useHistory  } from 'react-router-dom';
import Notification from '../../component/Notification/Notification';
import Spinner from '../../component/Spinner/Spinner'
import Popup from '../../component/Popup/Popup';
import bg_1 from '../../assets/decoration/bg_1.png'
import bg_2 from '../../assets/decoration/bg_2.png'
import bg_3 from '../../assets/decoration/bg_3.png'
import bg_4 from '../../assets/decoration/bg_4.png'
import {LayoutContext} from '../../context/Layout/LayoutContext'

const GNRM  = (props) => {
    const { resetDocument , editDocumentFalse, loading, setLoadingFalse, setLoadingTrue , preview } = useContext(ArtikelContext)
    const { user, token, userDetail } = useContext(AuthContext)
    const { sidebar } = useContext(LayoutContext)
    const [ documents , setDocuments] = useState([])
    const history = useHistory()
    const [ filterValue , setFilterValue ] = useState({})

    const [ filter, setFilter ] = useState({
        limit: '10',
        page: '1',
        tahun: '',
        kp: '',
        instansi: '',
        totalDoc: ''
    })

    const {
        limit,
        page,
        tahun,
        kp,
        instansi,
        totalDoc,
    } = filter

    const getAllDocument = async () => {
        setLoadingTrue()
        const config= {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`
            }
        }
        try {
            const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/document?type=gnrm&tahun=${tahun}&instansi=${instansi}&limit=${limit}&page=${page}&kp=${kp}`, config)
            setDocuments(res.data.document)
            setFilterValue(res.data.filter)
            setFilter({...filter, totalDoc: res.data.total})
            setLoadingFalse()
        }
        catch (err) {
            console.log(err)  
        }  
    }

    const deleteDocument = async (id) => {
        setLoadingTrue()
        const config = {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`
            }
        }
        try {
            const res = await axios.delete(`https://api.simonev.revolusimental.go.id/api/v1/document/${id}?type=gnrm`,config)
            alert(res.data.message)
            getAllDocument()
        }
        catch (err) {
            alert(err.response.data.message)
        }
        setLoadingFalse()
    }

    const handleReset = () => {
        editDocumentFalse()
        resetDocument()
        preview()
        history.push(`/${userDetail&&userDetail.role === 'owner' ? 'super-admin' : 'admin'}/formulir-gnrm`)
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    useEffect(() => {
        getAllDocument()
    }, [limit,page])

    // if (!loading) {
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

                        <div style={{marginRight:'20px' , marginTop:'23px'}}>
                            <div className="tajuk-page-2">
                                <div>RENCANA PELAKSANAAN PROGRAM</div>
                                {
                                    user && user.role === 'owner' ?
                                        ''
                                    :
                                        <Notification/>
                                }
                            </div>
                            <div style={sidebar ? {marginLeft:'188px' , transition: 'all 0.3s ease-in-out'} : {transition: 'all 0.3s ease-in-out'}}>
                            <div className="input-dan-tajuk">
                                    <button className="tambah-program" onClick={() => handleReset()}>
                                        <img src={plus}></img>
                                        <div className="spacer"></div>
                                        <h1 className="text-input-program">
                                            Input Program
                                        </h1>
                                    </button>
                            </div>
                        
                        <Filter
                            filterValue={filterValue}
                            getDocument={getAllDocument}
                            setFilterDoc={setFilter}
                            filterDoc={filter}
                        />

                        <div className="table-container">
                            <table className="table-gnrm">
                                <thead className="table-head">
                                    <tr>
                                        <th width='70px'>Tahun</th>
                                        <th width={sidebar ? '216px' : '276px'} style={{transition: 'all 0.3s ease-in-out'}}>Kegiatan Prioritas</th>
                                        <th width={sidebar ? '216px' : '276px'} style={{transition: 'all 0.3s ease-in-out'}}>Proyek Prioritas</th>
                                        <th width={sidebar ? '160px' : '193px'} style={{transition: 'all 0.3s ease-in-out'}} className={user&&user.role === 'owner' ? ''  : 'd-none'}>Instansi</th>
                                        <th width={sidebar ? '160px' : '293px'} style={{transition: 'all 0.3s ease-in-out'}}>Pihak Terkait</th>
                                        <th width='161px'>Penanggung Jawab</th>
                                        <th width='59px'></th>
                                        <th width='59px'></th>
                                        <th width='59px'></th>
                                    </tr>
                                </thead>
                                {
                                    !loading && (
                                        <tbody className="table-body">
                                            {
                                                documents.map((document,index) => {
                                                    return(
                                                        <TabelGNRM
                                                            document={document}
                                                            key={index}
                                                            kp={document.form.kp}
                                                            prop={document.form.prop}
                                                            id={document._id}
                                                            tahun={document.form.tahun}
                                                            instansi={document.instansi}
                                                            pihak={document.form.pihak_terkait}
                                                            pejabat={document.form.penanggung_jawab.nama}
                                                            // edit={}
                                                            delete={deleteDocument}    
                                                        />
                                                    )
                                                })
                                            }
                                        </tbody>
                                    )
                                }
                            </table>
                            {
                                loading && 
                                <div style={{ marginLeft: '68px' }}>
                                    <div className="d-flex justify-content-center align-items-center" style={{ width: '100%', height: '60vh', overflow: 'hidden' }}>
                                        <Spinner />
                                    </div> 
                                </div>
                            }
                        </div>
                        <Pagination
                            setFilter={setFilter}
                            filter={filter}
                            total={totalDoc}
                            limit={limit}
                            page={page}
                        />
                </div>
                </div>
            </Fragment>

        )
    // } else {
    //     return (
    //         <Fragment>
    //             <SideBarOff/>
    //             <div className="background-after-login">
    //                 <img src={bg_1} alt='bg1' style={{position: 'fixed' , top:'0' , left: '0'}}/>
    //                 <img src={bg_2} alt='bg2' style={{position: 'fixed' , top:'0' , right: '0'}}/>
    //                 <img src={bg_3} alt='bg3' style={{position: 'fixed' , bottom:'-200px' , left: '0'}}/>
    //                 <img src={bg_4} alt='bg4' style={{position: 'fixed' , bottom:'-50px' , right: '0'}}/>
    //             </div>
    //             <div style={{marginRight:'20px'}}>
    //                         <div className="input-dan-tajuk">
    //                             <Link to={`/${userDetail&&userDetail.role === 'owner' ? 'super-admin' : 'admin'}/formulir-gnrm`}>
    //                                 <button className="tambah-program" onClick={() => handleReset()}>
    //                                     <img src={plus}></img>
    //                                     <div className="spacer"></div>
    //                                     <h1 className="text-input-program">
    //                                         Input Program
    //                                     </h1>
    //                                 </button>
    //                             </Link>
    //                             <div className="spacer"></div>
    //                             <div className="tajuk-page-2">
    //                                 <p>RENCANA PELAKSANAAN PROGRAM</p>
    //                             </div>
    //                         </div>
                        
    //                     <Filter
    //                         filterValue={filterValue}
    //                         getDocument={getAllDocument}
    //                         setFilterDoc={setFilter}
    //                         filterDoc={filter}
    //                     />
    //                     <div className="table-container">
    //                         <table className="table-gnrm">
    //                             <thead className="table-head">
    //                                 <tr>
    //                                     <th width='70px'>Tahun</th>
    //                                     <th width='276px'>Kegiatan Prioritas</th>
    //                                     <th width='276px'>Proyek Prioritas</th>
    //                                     <th width='193px'>Instansi</th>
    //                                     <th width='204px'>Pihak Terkait</th>
    //                                     <th width='133px'>Pejabat Eselon</th>
    //                                     <th width='59px'></th>
    //                                     <th width='59px'></th>
    //                                     <th width='59px'></th>
    //                                 </tr>
    //                             </thead>
    //                         </table>
    //                         <div className="d-flex justify-content-center align-items-center" style={{ height: '40ch' }}>
    //                             <Spinner />
    //                         </div>
    //                     </div>
    //             </div>
    //             <Popup notif={props.notif}/>
    //         </Fragment>
    //     )
    // }

}

export default GNRM;