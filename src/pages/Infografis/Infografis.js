import React, { useContext , useState, useEffect } from 'react' ; 
import {AuthContext} from '../../context/Auth/AuthContext'
import SideBarOff from '../../component/SideBarOff/SideBarOff'
import axios from 'axios';
import FilterInfografis from '../../component/FilterInfografis/FilterInfografis'
import Notification from '../../component/Notification/Notification';
import TabelInfografis from '../../component/TabelInfografis/TabelInfografis';
import Pagination from '../../component/Pagination/Pagination';
import Popup from '../../component/Popup/Popup'

const Infografis = (props) => {
    const { user, token } = useContext(AuthContext)
    const [ documents , setDocuments] = useState([])
    const [ filter, setFilter ] = useState({
        limit: '10',
        page: '1',
        tahun: '',
        status: '',
        instansi: '',
        totalDoc: ''
    })

    const {
        limit,
        page,
        instansi,
        tahun,
        status,
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
                const res = await axios.get(`https://test.bariqmbani.me/api/v1/infografis?`, config)
                setFilter({...filter, totalDoc: res.data.infografis.length})
            } else {
                const res = await axios.get(`https://test.bariqmbani.me/api/v1/infografis?&instansi=${user && user.instansi.nama_pendek}`, config)
                setFilter({...filter, totalDoc: res.data.infografis.length})
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
                const res = await axios.get(`https://test.bariqmbani.me/api/v1/infografis?status=${status}&page=${page}&limit=${limit}&instansi=${instansi}`, config)
                setDocuments(res.data.infografis)
            } else {
                const res = await axios.get(`https://test.bariqmbani.me/api/v1/infografis?status=${status}&page=${page}&limit=${limit}&instansi=${user && user.instansi.nama_pendek}`, config)
                setDocuments(res.data.infografis)
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
            await axios.delete(`https://test.bariqmbani.me/api/v1/infografis/${id}`, config)
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
            <Popup notif={props.notif}/>
            {
                    user && user.role === 'owner' ?
                        ''
                    :
                        <Notification/>
                }
                            <div className="input-dan-tajuk">
                                <div></div>
                                <div className="spacer"></div>
                                <div className="tajuk-page-2">
                                    <p>INFOGRAFIS PELAKSANAAN PROGRAM</p>
                                </div>
                            </div>

                <FilterInfografis
                    getDocument={getAllDocument}
                    setFilter={setFilter}
                    filter={filter}
                    status={status}
                    tahun={tahun}
                />

                        <div className="table-container">
                            <table className="table-gnrm" style={{marginRight:'20px'}}>
                                <thead className="table-head">
                                    <tr>
                                        <th width='159px'>Tahun</th>
                                        <th width='276px'>Nama Program</th>
                                        <th width='193px' className={user && user.role === 'owner' ? '' : 'd-none'}>Instansi</th>
                                        <th width='59px'>Status</th>
                                        <th width='59px'></th>
                                        <th width='59px'></th>
                                        <th width='59px'></th>
                                        <th width='59px'></th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {
                                        documents.map((document,index) => {
                                            return(
                                                <TabelInfografis
                                                    // document={document}
                                                    key={index}
                                                    document={document}
                                                    id={document.gnrm_id}
                                                    instansi={document.instansi}
                                                    // tahun={document.form.tahun}
                                                    nama={document.nama_program}
                                                    status={document.status}
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
