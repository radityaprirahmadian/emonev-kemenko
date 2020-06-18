import React,{Component,Fragment, useContext, useState, useEffect} from 'react';
import { AuthContext } from '../../context/Auth/AuthContext';
import axios from 'axios';
import './Admin.css';

import SideBarOff from '../../component/SideBarOff/SideBarOff';
import Popup from '../../component/Popup/Popup';
import SearchBar from '../../component/SearchBar/SearchBar';
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

const Admin = (props) => {
    const { user, token } = useContext(AuthContext)

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

    console.log(filter)

    const getAllUserLength = async () => {
        const config= {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`
            }
        }
        try {
            const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/user`, config)
            setFilter({...filter, totalUser: res.data.users.length})
        }
        catch (err) {
            console.log(err)  
        }  
    }

    const getAllUser = async () => {
        const config= {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`
            }
        }
        try {
            const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/user?limit=${limit}&page=${page}&nama=${nama}&username=&instansi=${instansi}`, config)
            // console.log(res)
            setUsers(res.data.users)
        }
        catch (err) {
            console.log(err)  
        }  
    }

    // const getAllUser = async () => {
    //     const config= {
    //         headers: {
    //             'X-Auth-Token': `aweuaweu ${token}`
    //         }
    //     }
    //     try {
    //         const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/user?limit=${limit}&page=${page}&nama=${nama}&username=&instansi=${instansi}`, config)
    //         // console.log(res)
    //         setUsers(res.data.users)
    //     }
    //     catch (err) {
    //         console.log(err)  
    //     }  
    // }

    const deleteUser = async (id) => {
        const config = {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`
            }
        }
        try {
            await axios.delete(`https://api.simonev.revolusimental.go.id/api/v1/user/${id}`,config)
            getAllUser()
            getAllUserLength()
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getAllUserLength()
    },[])

    useEffect(() => {  
        getAllUser()
        // setFilterUsers({
        //     ...filterUsers,
        //     totalUser: users.length
        // })  
    }, [limit,page])

    console.log(users)
    console.log(users.length)

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
                                <Link to='/formulir-admin'>
                                    <button className="tambah-admin">
                                        <img src={plus}></img>
                                        <div className="spacer"></div>
                                        <p className="text-input-admin">
                                            Input Admin
                                        </p>
                                    </button>
                                </Link>
                                <div className="spacer"></div>
                                <div className="tajuk-page-2">
                                    <p>KELOLA ADMIN</p>
                                </div>
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
                                <table className="table-admin" style={{marginRight:'20px'}}>
                                    <thead className="table-head-admin">
                                        <tr>
                                            <th width='258px'>Nama</th>
                                            <th width='258px' className={user && user.role === 'super_admin' ? 'd-none' : ''}>Instansi</th>
                                            <th width='258px'>Username</th>
                                            <th width='133px' className={user && user.role === 'super_admin' ? 'd-none' : ''}>Level</th>
                                            <th width='42px'></th>
                                            <th width='42px'></th>
                                        </tr>
                                    </thead>
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
                                </table>
                            </div>

                            <Pagination
                                setFilter={setFilter}
                                filter={filter}
                                total={totalUser}
                                limit={limit}
                                page={page}
                            />
            </Fragment>

        )
}

export default Admin;