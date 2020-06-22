import React, { useContext , useState, useEffect } from 'react' ; 
import {AuthContext} from '../../context/Auth/AuthContext'
import SideBarOff from '../../component/SideBarOff/SideBarOff'
import {Link} from 'react-router-dom'
import plus from '../../assets/plus.png'
import axios from 'axios';
import FilterInfografis from '../../component/FilterInfografis/FilterInfografis'
import Notification from '../../component/Notification/Notification';
import TabelInfografis from '../../component/TabelInfografis/TabelInfografis';
import Pagination from '../../component/Pagination/Pagination';
import Popup from '../../component/Popup/Popup'

const Infografis = (props) => {
    const { user, token, userDetail } = useContext(AuthContext)
    const [ documents , setDocuments] = useState([])
    const [ filterValue , setFilterValue ] = useState({})
    console.log(documents)
    const [ filter, setFilter ] = useState({
        limit: '10',
        page: '1',
        tahun: '',
        instansi: '',
        totalDoc: ''
    })

    const {
        limit,
        page,
        instansi,
        tahun,
        totalDoc,
    } = filter

    const getDocumentLength = async () => {
        const config= {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`
            }
        }
        try {
            if(user && user.role === 'owner') {
                const res = await axios.get(`https://test.bariqmbani.me/api/v1/kabar?`, config)
                setFilterValue(res.data.filter)
                setFilter({...filter, totalDoc: res.data.kabar.length})
            } else {
                const res = await axios.get(`https://test.bariqmbani.me/api/v1/kabar?instansi=${user && user.instansi.nama_pendek}`, config)
                setFilterValue(res.data.filter)
                setFilter({...filter, totalDoc: res.data.kabar.length})
            }
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
            if(user && user.role === 'owner') {
                const res = await axios.get(`https://test.bariqmbani.me/api/v1/kabar?tahun=${tahun}&page=${page}&limit=${limit}&instansi=${instansi}`, config)
                setDocuments(res.data.kabar)
            } else {
                const res = await axios.get(`https://test.bariqmbani.me/api/v1/kabar?tahun=${tahun}&page=${page}&limit=${limit}&instansi=${user && user.instansi.nama_pendek}`, config)
                setDocuments(res.data.kabar)
            }
        }
        catch (err) {
            console.log(err)  
        }  
    }

    const deleteDocument = async (id) => {
        const config= {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`
            }
        }
        try {
            await axios.delete(`https://test.bariqmbani.me/api/v1/kabar/${id}`, config)
            getAllDocument()
        }
        catch (err) {
            console.log(err)  
        }  
    }
    
    useEffect(() => {
        getDocumentLength()
        getAllDocument()
    },[])

    useEffect(() => {
        getAllDocument()
    }, [limit,page])

    return(
        <div>
            <SideBarOff/>
            <div className="background-after-login"/>
            <Popup notif={props.notif}/>
            {
                    user && user.role === 'owner' ?
                        ''
                    :
                        <Notification/>
                }
                            <div className="input-dan-tajuk">
                                <Link to={`/${userDetail&&userDetail.role === 'owner' ? 'super-admin' : 'admin'}/formulir-kabar-gnrm`}>
                                    <button className="tambah-program">
                                        <img src={plus}></img>
                                        <div className="spacer"></div>
                                        <h1 className="text-input-program" style={{marginRight:'12px'}}>
                                            Input Kabar GNRM
                                        </h1>
                                    </button>
                                </Link>
                                <div className="spacer"></div>
                                <div className="tajuk-page-2">
                                    <p>KABAR GNRM</p>
                                </div>
                            </div>

                <FilterInfografis
                    filterValue={filterValue}
                    getDocument={getAllDocument}
                    setFilter={setFilter}
                    filter={filter}
                    tahun={tahun}
                />

                        <div className="table-container">
                            <table className="table-gnrm" style={{marginRight:'20px'}}>
                                <thead className="table-head">
                                    <tr>
                                        <th width='159px'>Tahun</th>
                                        <th width='276px'>Judul Kabar</th>
                                        <th width='193px' className={user && user.role === 'owner' ? '' : 'd-none'}>Instansi</th>
                                        <th width='59px'></th>
                                        <th width='59px'></th>
                                        <th width='59px'></th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {
                                        documents && documents.map((document,index) => {
                                            return(
                                                <TabelInfografis
                                                    // document={document}
                                                    key={index}
                                                    id={document._id}
                                                    gambar={document.gambar}
                                                    instansi={document.instansi.nama_pendek}
                                                    tahun={document.tahun}
                                                    judul={document.judul}
                                                    // tahun={document.form.tahun}
                                                    // pihak={document.form.pihak_terkait}
                                                    // pejabat={document.form.penanggung_jawab.nama}
                                                    // // edit={}
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
    )
}

export default Infografis;
