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
import Filter from '../../component/Filter/Filter';
import TabelGNRM from '../../component/TabelGNRM/TabelGNRM';
import Pagination from '../../component/Pagination/Pagination';
import TabelMonev from '../../component/TabelMonev/TabelMonev';
import {Link} from 'react-router-dom';
import Notification from '../../component/Notification/Notification';
import Popup from '../../component/Popup/Popup';

const Monev =  (props) =>{
    const { resetDocument , editDocumentFalse } = useContext(ArtikelContext)
    const { user, token } = useContext(AuthContext)
    const [ documents , setDocuments] = useState([])
    console.log(documents)

    const [ filter, setFilter ] = useState({
        limit: '',
        page: '',
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

    const getAllDocument = async () => {
        const config= {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`
            }
        }
        try {
            const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/document?type=monev&tahun=${tahun}&instansi=${instansi}&limit=${limit}&page=${page}&periode=${periode}`, config)
            setDocuments(res.data.document)
            console.log(res.data)
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
            await axios.delete(`https://api.simonev.revolusimental.go.id/api/v1/document/${id}?type=monev`,config)
            getAllDocument()
        }
        catch (err) {
            console.log(err)
        }
    }

    const handleReset = () => {
        editDocumentFalse()
        resetDocument()
    }

    const [ lebar , setLebar] = useState('')
    useEffect(() => {
        setLebar(window.screen.width) 
        console.log(lebar)
    } , [window.screen.width])

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
                        <div className="input-dan-tajuk">
                            <Link to='/formulir-monev'>
                                <button className="tambah-laporan" onClick={() => handleReset()}>
                                    <img src={plus}></img>
                                    <div className="spacer"></div>
                                    <p className="text-input-laporan">
                                        Input Laporan
                                    </p>
                                </button>
                            </Link>
                            <div className="spacer"></div>
                            <div className="tajuk-page-2">
                                <p>LAPORAN MONEV</p>
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
                            <table className="table-monev">
                                <thead className="table-head-monev">
                                    <tr>
                                        <th width='159px'>Tahun</th>
                                        <th width='276px'>Nama Gerakan</th>
                                        <th width='193px'>Instansi</th>
                                        <th width='204px'>Periode Pelaporan</th>
                                        <th width='193px'>Penanggung Jawab</th>
                                        <th width='59px'></th>
                                        <th width='59px'></th>
                                        <th width='59px'></th>
                                    </tr>
                                </thead>
                                <tbody className="table-body-monev">
                                    {
                                        documents.map((document,index) => {
                                            return(
                                                <TabelMonev
                                                    key={index}
                                                    id={document._id}
                                                    tahun={document.form.tahun}
                                                    instansi={document.instansi}
                                                    periode={document.form.id_laporan}
                                                    penanggung_jawab={document.form.penanggung_jawab.nama}
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
            </Fragment>

        )
    }

export default Monev;