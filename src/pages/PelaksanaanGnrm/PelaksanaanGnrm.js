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

const GNRM  = (props) => {
    const { resetDocument , editDocumentFalse } = useContext(ArtikelContext)
    const { user, token } = useContext(AuthContext)
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
        periode,
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
            const res = await axios.get(`https://test.bariqmbani.me/api/v1/document?type=gnrm&tahun=${tahun}&instansi=${instansi}&limit=${limit}&page=${page}&periode=${periode}`, config)
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


    const lebar = window.screen.width
    console.log(lebar)

    useEffect(() => {
        getDocumentLength()
    },[])

    useEffect(() => {
        getAllDocument()
    }, [limit,page])

        return(
            <Fragment>
                <SideBarOff/>
                <Popup notif={props.notif}/>
                {
                    user && user.role === 'owner' ?
                        ''
                    :
                        <Notification/>
                }
                        <div style={{marginRight:'20px'}}>
                            <div className="input-dan-tajuk">
                                <Link to="/formulir-gnrm">
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
                            getDocument={getAllDocument}
                            setFilterDoc={setFilter}
                            filterDoc={filter}
                            instansi={instansi}
                            periode={periode}
                            tahun={tahun}
                        />

                        <div className="table-container">
                            <table className="table-gnrm">
                                <thead className="table-head">
                                    <tr>
                                        <th width='159px'>Tahun</th>
                                        <th width='276px'>Nama Program</th>
                                        <th width='193px'>Instansi</th>
                                        <th width='204px'>Pihak Terkait</th>
                                        <th width='193px'>Pejabat Eselon</th>
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
                                                    id={document._id}
                                                    tahun={document.form.tahun}
                                                    nama={document.form.kegiatan.nama_program}
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