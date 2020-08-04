import React, { useContext , useState, useEffect } from 'react' ; 
import {AuthContext} from '../../context/Auth/AuthContext'
import {LayoutContext} from '../../context/Layout/LayoutContext'
import SideBarOff from '../../component/SideBarOff/SideBarOff'
import {Link} from 'react-router-dom'
import plus from '../../assets/plus.png'
import axios from 'axios';
import FilterInfografis from '../../component/FilterInfografis/FilterInfografis'
import Notification from '../../component/Notification/Notification';
import TabelInfografis from '../../component/TabelInfografis/TabelInfografis';
import Pagination from '../../component/Pagination/Pagination';
import Popup from '../../component/Popup/Popup'
import Spinner from '../../component/Spinner/Spinner'
import bg_1 from '../../assets/decoration/bg_1.png'
import bg_2 from '../../assets/decoration/bg_2.png'
import bg_3 from '../../assets/decoration/bg_3.png'
import bg_4 from '../../assets/decoration/bg_4.png'

const Infografis = (props) => {
    const { user, token, userDetail } = useContext(AuthContext)
    const { sidebar } = useContext(LayoutContext)
    const [ documents , setDocuments] = useState([])
    const [ filterValue , setFilterValue ] = useState({})
    const [loading, setLoading] = useState(false)

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

    // const getDocumentLength = async () => {
    //     const config= {
    //         headers: {
    //             'X-Auth-Token': `aweuaweu ${token}`
    //         }
    //     }
    //     try {
    //         if(user && user.role === 'owner') {
    //             const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/kabar?`, config)
    //             setFilterValue(res.data.filter)
    //             setFilter({...filter, totalDoc: res.data.kabar.length})
    //         } else {
    //             const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/kabar?instansi=${user && user.instansi.nama_pendek}`, config)
    //             setFilterValue(res.data.filter)
    //             setFilter({...filter, totalDoc: res.data.kabar.length})
    //         }
    //     }
    //     catch (err) {
    //         console.log(err)  
    //     }  
    // }

    const getAllDocument = async () => {
        setLoading(true)
        const config= {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`
            }
        }
        try {
            if(user && user.role === 'owner') {
                const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/kabar?tahun=${tahun}&page=${page}&limit=${limit}&instansi=${instansi}`, config)
                setDocuments(res.data.kabar)
                setFilterValue(res.data.filter)
                setFilter({...filter, totalDoc: res.data.total})
                setLoading(false)
            } else {
                const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/kabar?tahun=${tahun}&page=${page}&limit=${limit}&instansi=${user && user.instansi.nama_pendek}`, config)
                setDocuments(res.data.kabar)
                setFilterValue(res.data.filter)
                setFilter({...filter, totalDoc: res.data.total})
                setLoading(false)
            }
        }
        catch (err) {
            console.log(err)  
        }  
    }

    const deleteDocument = async (id) => {
        setLoading(true)
        const config= {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`
            }
        }
        try {
            const res = await axios.delete(`https://api.simonev.revolusimental.go.id/api/v1/kabar/${id}`, config)
            alert(res.data.message)
            getAllDocument()
        }
        catch (err) {
            console.log(err)  
        }  
        setLoading(false)
    }
    
    useEffect(() => {
        window.scrollTo(0, 0);
    },[])
    useEffect(() => {
        getAllDocument()
    },[user])

    useEffect(() => {
        getAllDocument()
    }, [limit,page])

    return(
        <div>
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
                            <div>KABAR GNRM</div>
                            {
                                user && user.role === 'owner' ?
                                    ''
                                :
                                    <Notification/>
                            }
                        </div>
                        <div style={sidebar ? {marginLeft:'188px' , transition: 'all 0.3s ease-in-out'} : {transition: 'all 0.3s ease-in-out'}}>
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
                            </div>

                        <FilterInfografis
                            filterValue={filterValue}
                            getDocument={getAllDocument}
                            setFilter={setFilter}
                            filter={filter}
                        />

                        <div className="table-container">
                            <table className="table-gnrm" style={{marginRight:'20px'}}>
                                <thead className="table-head">
                                    <tr>
                                        <th width='159px'>Tahun</th>
                                        <th width='276px'>Judul Berita</th>
                                        <th width='193px' className={user && user.role === 'owner' ? '' : 'd-none'}>Instansi</th>
                                        <th width='59px'></th>
                                        <th width='59px'></th>
                                        <th width='59px'></th>
                                    </tr>
                                </thead>
                                {
                                    !loading && (
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
        </div>
    )
}

export default Infografis;
