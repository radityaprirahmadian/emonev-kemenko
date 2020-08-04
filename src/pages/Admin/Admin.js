import React,{Component,Fragment, useContext, useState, useEffect} from 'react';
import { AuthContext } from '../../context/Auth/AuthContext';
import {LayoutContext} from '../../context/Layout/LayoutContext'
import axios from 'axios';
import './Admin.css';

import SideBarOff from '../../component/SideBarOff/SideBarOff';
import Popup from '../../component/Popup/Popup';
import plus from '../../assets/plus.png';
import Filter from '../../component/Filter/Filter';
import TabelGNRM from '../../component/TabelGNRM/TabelGNRM';
import Pagination from '../../component/Pagination/Pagination';
import TabelAdminOwner from '../../component/TabelAdmin/TabelAdminOwner';
import TabelAdmin from '../../component/TabelAdmin/TabelAdmin';
import FilterAdmin from '../../component/FilterAdmin/FilterAdmin';
import { Link } from 'react-router-dom';
import SearchBarAdmin from '../../component/SearchBarAdmin/SeacrhBarAdmin';
import Notification from '../../component/Notification/Notification';
import bg_1 from '../../assets/decoration/bg_1.png'
import bg_2 from '../../assets/decoration/bg_2.png'
import bg_3 from '../../assets/decoration/bg_3.png'
import bg_4 from '../../assets/decoration/bg_4.png'
import Spinner from '../../component/Spinner/Spinner'

const Admin = (props) => {
    const { user, token , userDetail} = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const { sidebar } = useContext(LayoutContext)
    const [ users , setUsers] = useState([]);
    
    const [ filter, setFilter ] = useState({
        limit: '10',
        page: '1',
        nama: '',
        instansi: '',
        totalUser: ''
    })

    const {
        limit,
        page,
        nama,
        instansi,
        totalUser,
    } = filter


    const getAllUser = async () => {
        setLoading(true)
        const config= {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`
            }
        }
        try {
            const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/user?limit=${limit}&page=${page}&nama=${nama}&username=&instansi=${instansi}`, config)
            setUsers(res.data.users)
            setFilter({...filter, totalUser: res.data.total})
            setLoading(false)
        }
        catch (err) {
            console.log(err)  
        }  
    }

    const deleteUser = async (id) => {
        setLoading(true)
        const config = {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`
            }
        }
        try {
            const res = await axios.delete(`https://api.simonev.revolusimental.go.id/api/v1/user/${id}`,config)
            alert(res.data.message)
            getAllUser()
        }
        catch (err) {
            console.log(err)
        }
        setLoading(false)
    }

    useEffect(() => {  
        getAllUser()
    }, [limit,page])

        return(
            <Fragment>
                <SideBarOff setId={props.setId}/>
                <Popup notif={props.notif}/>
                    <div className="background-after-login">
                        <img src={bg_1} alt='bg1' style={{position: 'fixed' , top:'0' , left: '0'}}/>
                        <img src={bg_2} alt='bg2' style={{position: 'fixed' , top:'0' , right: '0'}}/>
                        <img src={bg_3} alt='bg3' style={{position: 'fixed' , bottom:'-200px' , left: '0'}}/>
                        <img src={bg_4} alt='bg4' style={{position: 'fixed' , bottom:'-50px' , right: '0'}}/>
                    </div>
                    <div style={{marginRight:'20px' , marginTop:'23px'}}>
                        <div className="tajuk-page-2">
                            <div>KELOLA ADMIN</div>
                            {
                                user && user.role === 'owner' ?
                                    ''
                                :
                                    <Notification/>
                            }
                        </div>
                    <div style={sidebar ? {marginLeft:'188px' , marginRight: '20px' , transition: 'all 0.3s ease-in-out'} : {transition: 'all 0.3s ease-in-out'}}>
                        <div className="input-dan-tajuk">
                            <Link to={`/${userDetail&&userDetail.role === 'owner' ? 'super-admin' : 'admin'}/formulir-tambah-admin`}>
                                <button className="tambah-program">
                                    <img src={plus}></img>
                                    <div className="spacer"></div>
                                    <p className="text-input-program">
                                        Input Admin
                                    </p>
                                </button>
                            </Link>
                        </div>
                        {
                            user && user.role === 'owner' ? 
                                <FilterAdmin 
                                    getUser={getAllUser}
                                    setFilter={setFilter} 
                                    filterUser={filter} 
                                    nama={nama} 
                                    instansi={instansi}
                                /> 
                            : 
                            ''
                        }
                        <div className="table-container">
                            <table className="table-admin" style={{marginRight:'20px', backgroundColor:'white'}}>
                                <thead className="table-head-admin">
                                    <tr>
                                        <th width={sidebar ? '195px' :'258px'} style={{transition: 'all 0.3s ease-in-out'}}>Nama</th>
                                        <th width={sidebar ? '195px' : '258px'} className={user && user.role === 'super_admin' ? 'd-none' : ''} style={{transition: 'all 0.3s ease-in-out'}}>Instansi</th>
                                        <th width={sidebar ? '196px' : '258px'} style={{transition: 'all 0.3s ease-in-out'}}>Nama Pengguna</th>
                                        <th width='133px'>Peran</th>
                                        <th width='42px'></th>
                                        <th width='42px'></th>
                                    </tr>
                                </thead>
                                {
                                    !loading && (
                                        <tbody className="table-body-admin">
                                            {
                                                users.map(user => {
                                                    return(
                                                        <TabelAdmin 
                                                            key={user._id}
                                                            id={user._id} 
                                                            nama={user.nama} 
                                                            instansi={user.instansi.nama_pendek} 
                                                            username={user.username} 
                                                            role={user.role}
                                                            delete={deleteUser}
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
                            total={totalUser}
                            limit={limit}
                            page={page}
                        />
                    </div>
                </div>
            </Fragment>
        )
}

export default Admin;