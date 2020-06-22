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
import { Link } from 'react-router-dom';
import Notification from '../../component/Notification/Notification';
import Popup from '../../component/Popup/Popup';
import bg_1 from '../../assets/decoration/bg_1.png'
import bg_2 from '../../assets/decoration/bg_2.png'
import bg_3 from '../../assets/decoration/bg_3.png'
import bg_4 from '../../assets/decoration/bg_4.png'

const GNRM  = (props) => {
    const { resetDocument , editDocumentFalse } = useContext(ArtikelContext)
    const { user, token, userDetail } = useContext(AuthContext)
    const [ documents , setDocuments] = useState([])
    const [ filterValue , setFilterValue ] = useState({})
    console.log(documents)

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

    const getDocumentLength = async () => {
        const config= {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`
            }
        }
        try {
            const res = await axios.get(`https://test.bariqmbani.me/api/v1/document?type=gnrm`, config)
            setFilterValue(res.data.filter)
            setFilter({...filter, totalDoc: res.data.document.length})
        }
        catch (err) {
            console.log(err)  
        }  
    }
    const getAllDocument = async () => {
        const config= {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`
            }
        }
        try {
            const res = await axios.get(`https://test.bariqmbani.me/api/v1/document?type=gnrm&tahun=${tahun}&instansi=${instansi}&limit=${limit}&page=${page}&kp=${kp}`, config)
            setDocuments(res.data.document)
        }
        catch (err) {
            console.log(err)  
        }  
    }

    const deleteDocument = async (id) => {
        const config = {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`
            }
        }
        try {
            await axios.delete(`https://test.bariqmbani.me/api/v1/document/${id}?type=gnrm`,config)
            getAllDocument()
            getDocumentLength()
        }
        catch (err) {
            console.log(err)
        }
    }

    const handleReset = () => {
        editDocumentFalse()
        resetDocument()
    }

    useEffect(() => {
        getDocumentLength()
    },[])

    useEffect(() => {
        getAllDocument()
    }, [limit,page])

        return(
            <Fragment>
                <SideBarOff/>
                <div className="background-after-login">
                        <img src={bg_1} alt='bg1' style={{position: 'fixed' , top:'0' , left: '0'}}/>
                        <img src={bg_2} alt='bg2' style={{position: 'fixed' , top:'0' , right: '0'}}/>
                        <img src={bg_3} alt='bg3' style={{position: 'fixed' , bottom:'-200px' , left: '0'}}/>
                        <img src={bg_4} alt='bg4' style={{position: 'fixed' , bottom:'-50px' , right: '0'}}/>
                    </div>
                    <Popup notif={props.notif}/>
                {
                    user && user.role === 'owner' ?
                        ''
                    :
                        <Notification/>
                }
                        <div style={{marginRight:'20px'}}>
                            <div className="input-dan-tajuk">
                                <Link to={`/${userDetail&&userDetail.role === 'owner' ? 'super-admin' : 'admin'}/formulir-gnrm`}>
                                    <button className="tambah-program" onClick={() => handleReset()}>
                                        <img src={plus}></img>
                                        <div className="spacer"></div>
                                        <h1 className="text-input-program">
                                            Input Program
                                        </h1>
                                    </button>
                                </Link>
                                <div className="spacer"></div>
                                <div className="tajuk-page-2">
                                    <p>RENCANA PELAKSANAAN PROGRAM</p>
                                </div>
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
                                        <th width='276px'>Kegiatan Prioritas</th>
                                        <th width='276px'>Proyek Prioritas</th>
                                        <th width='193px'>Instansi</th>
                                        <th width='204px'>Pihak Terkait</th>
                                        <th width='133px'>Pejabat Eselon</th>
                                        <th width='59px'></th>
                                        <th width='59px'></th>
                                        <th width='59px'></th>
                                    </tr>
                                </thead>
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
                            </table>
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

export default GNRM;