import React,{Component,Fragment,useState,useContext,useEffect} from 'react';
import { AuthContext } from '../../context/Auth/AuthContext';
import { ArtikelContext } from '../../context/Artikel/artikelContext';
import axios from 'axios'
import './Monev.css';
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import SearchBar from '../../component/SearchBar/SearchBar';
import Card from '../../component/Card/Card';
import SearchBarAdmin from '../../component/SearchBarAdmin/SeacrhBarAdmin';
import plus from '../../assets/plus.png';
import FilterMonev from '../../component/FilterMonev/FilterMonev';
import TabelGNRM from '../../component/TabelGNRM/TabelGNRM';
import Pagination from '../../component/Pagination/Pagination';
import TabelMonev from '../../component/TabelMonev/TabelMonev';
import {Link} from 'react-router-dom';
import Notification from '../../component/Notification/Notification';
import Popup from '../../component/Popup/Popup';
import bg_1 from '../../assets/decoration/bg_1.png'
import bg_2 from '../../assets/decoration/bg_2.png'
import bg_3 from '../../assets/decoration/bg_3.png'
import bg_4 from '../../assets/decoration/bg_4.png'
import Spinner from '../../component/Spinner/Spinner'

const Monev =  (props) =>{
    const { resetDocument , editDocumentFalse, loading, setLoadingFalse, setLoadingTrue } = useContext(ArtikelContext)
    const { user, token, userDetail } = useContext(AuthContext)
    const [ documents , setDocuments] = useState([])
    console.log(documents)

    const [ filter, setFilter ] = useState({
        limit: '10',
        page: '1',
        tahun: '',
        periode: '',
        instansi: '',
        totalDoc: ''
    })

    const {
        limit,
        page,
        tahun,
        instansi,
        periode,
        totalDoc,
    } = filter

    console.log(filter)

    // const getDocumentLength = async () => {
    //     const config= {
    //         headers: {
    //             'X-Auth-Token': `aweuaweu ${token}`
    //         }
    //     }
    //     try {
    //         const res = await axios.get(`https://test.bariqmbani.me/api/v1/document?type=monev`, config)
    //         setFilter({...filter, totalDoc: res.data.document.length})
    //     }
    //     catch (err) {
    //         console.log(err)  
    //     }  
    // }

    const getAllDocument = async () => {
        setLoadingTrue()
        const config= {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`
            }
        }
        try {
            const res = await axios.get(`https://test.bariqmbani.me/api/v1/document?type=monev&tahun=${tahun}&instansi=${instansi}&limit=${limit}&page=${page}&periode=${periode}`, config)
            setDocuments(res.data.document)
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
            await axios.delete(`https://test.bariqmbani.me/api/v1/document/${id}?type=monev`,config)
            getAllDocument()
        }
        catch (err) {
            console.log(err)
        }
        setLoadingFalse()
    }

    const handleReset = () => {
        editDocumentFalse()
        resetDocument()
    }

    // useEffect(() => {
    //     getDocumentLength()
    // },[])

    useEffect(() => {
        getAllDocument()
    }, [limit,page])

        return(
            <Fragment>
                <SideBarOff/>
                <Popup notif={props.notif}/>
                    <div className="background-after-login">
                        <img src={bg_1} alt='bg1' style={{position: 'fixed' , top:'0' , left: '0'}}/>
                        <img src={bg_2} alt='bg2' style={{position: 'fixed' , top:'0' , right: '0'}}/>
                        <img src={bg_3} alt='bg3' style={{position: 'fixed' , bottom:'-200px' , left: '0'}}/>
                        <img src={bg_4} alt='bg4' style={{position: 'fixed' , bottom:'-50px' , right: '0'}}/>
                    </div>

                    <div style={{marginRight:'20px' , marginTop:'23px'}}>
                        <div className="tajuk-page-2">
                            <div>LAPORAN MONEV</div>
                            {
                                user && user.role === 'owner' ?
                                    ''
                                :
                                    <Notification/>
                            }
                        </div>
                        <div className="input-dan-tajuk">
                            <Link to={`/${userDetail&&userDetail.role === 'owner' ? 'super-admin' : 'admin'}/formulir-monev`}>
                                <button className="tambah-program" onClick={() => handleReset()}>
                                    <img src={plus}></img>
                                    <div className="spacer"></div>
                                    <p className="text-input-program">
                                        Input Laporan
                                    </p>
                                </button>
                            </Link>
                        </div>
                        
                        <FilterMonev
                            getDocument={getAllDocument}
                            setFilterDoc={setFilter}
                            filterDoc={filter}
                            instansi={instansi}
                            periode={periode}
                            tahun={tahun}
                        />

                        <div className="table-container">
                            <table className="table-monev" style={{marginRight:'20px'}}>
                                <thead className="table-head-monev">
                                    <tr>
                                        <th width='159px'>Tahun</th>
                                        <th width='276px'>Kegiatan Prioritas</th>
                                        <th width='193px'>Proyek Prioritas</th>
                                        <th width='193px' className={user&&user.role === 'owner' ? '' : 'd-none'}>Instansi</th>
                                        <th width='204px'>Periode Pelaporan</th>
                                        <th width='193px'>Penanggung Jawab</th>
                                        <th width='59px'></th>
                                        <th width='59px'></th>
                                        <th width='59px'></th>
                                    </tr>
                                </thead>
                                {
                                    !loading && (
                                        <tbody className="table-body-monev">
                                            {
                                                documents.map((document,index) => {
                                                    return(
                                                        <TabelMonev
                                                            document={document}
                                                            key={index}
                                                            kp={document.form.kp}
                                                            prop={document.form.prop}
                                                            id={document._id}
                                                            tahun={document.form.tahun}
                                                            instansi={document.instansi}
                                                            pihak={document.form.pihak_terkait}
                                                            // edit={}
                                                            delete={deleteDocument}    
                                                            periode={document.form.id_laporan}
                                                            penanggung_jawab={document.form.penanggung_jawab.nama}
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
            </Fragment>

        )
    }

export default Monev;