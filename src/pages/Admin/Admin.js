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
    
    const [ filterUsers, setFilterUsers ] = useState({
        limit: '',
        page: '',
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
    } = filterUsers

    console.log(filterUsers)

    const getAllUser = async () => {
        const config= {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`
            }
        }
        try {
            const res = await axios.get(`https://test.bariqmbani.me/api/v1/user?limit=${limit}&page=${page}&nama=${nama}&username=&instansi=${instansi}`, config)
            // console.log(res)
            setUsers(res.data.users)
        }
        catch (err) {
            console.log(err)  
        }  
    }

    const deleteUser = async (id) => {
        const config = {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`
            }
        }
        try {
            await axios.delete(`https://test.bariqmbani.me/api/v1/user/${id}`,config)
            getAllUser()
        }
        catch (err) {
            console.log(err)
        }
    }

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
                                        setFilter={setFilterUsers} 
                                        filterUser={filterUsers} 
                                        nama={nama} 
                                        instansi={instansi}
                                    /> 
                                : 
                                ''
                            }

                            <div className="table-container">
                                <table className="table-admin">
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
                                setFilter={setFilterUsers}
                                filter={filterUsers}
                                total={totalUser}
                                limit={limit}
                                page={page}
                            />
            </Fragment>

        )
}

export default Admin;