import React,{Component,Fragment,useContext,useState,useEffect} from 'react';
import './Reminder.css';
import { AuthContext } from '../../context/Auth/AuthContext';
import { Link } from 'react-router-dom'
import axios from 'axios'
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import SearchBar from '../../component/SearchBar/SearchBar';
import plus from '../../assets/plus.png';
import Pagination from '../../component/Pagination/Pagination';
import TabelReminder from '../../component/TabelReminder/TabelRemider';
import Notification from '../../component/Notification/Notification';
import TabelAdminOwner from '../../component/TabelAdmin/TabelAdminOwner';
import TabelReminderOwner from '../../component/TabelReminder/TabelReminderOwner';
import Popup from '../../component/Popup/Popup';

const Reminder = (props) => {
    const { user, token } = useContext(AuthContext)
    const kentoks = localStorage.getItem('token')

    const [ allReminder, setAllReminder ] = useState([])
    console.log(allReminder)

    const [ filter, setFilter ] = useState({
        limit: '',
        page: '',
        total: ''
    })

    const {
        limit,
        page,
        total
    } = filter

    const getAllReminder = async () => {
        const config= {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`,
            }
        }
        try {
            const res = await axios.get(`https://test.bariqmbani.me/api/v1/notifikasi/tabel?page=${page}&limit=${limit}`,config)
            setAllReminder(res.data.notifikasi)
            console.log(res.data)
        }
        catch (err) {
            console.log(err.message)  
        }  
    }

    const deleteReminder = async (id) => {
        const config= {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`
            }
        }
        try {
            await axios.delete(`https://test.bariqmbani.me/api/v1/notifikasi/${id}`, config)
            getAllReminder()
        }
        catch (err) {
            console.log(err.message)  
        }
    }

    useEffect(() => {
        getAllReminder()
    },[])

    useEffect(() => {
        getAllReminder()
    },[limit])
    
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
                        <Link to='/formulir-reminder'>
                            <button className="tambah-reminder">
                                <img src={plus}></img>
                                <div className="spacer"></div>
                                <p className="text-input-reminder">
                                    Buat Reminder
                                </p>
                            </button>
                        </Link>
                        <div className="spacer"></div>
                        <div className="tajuk-page-2">
                            <p>REMINDER</p>
                        </div>
                    </div>
                    <div className="table-container">
                        <table className="table-reminder-owner"  style={{marginRight:'20px'}}>
                            <thead className="table-head-reminder-owner">
                                <tr>
                                    <th width='191px' className={user && user.role === 'super_admin' ? 'd-none' : ''}>Instansi Tujuan</th>
                                    <th width='125px'>Akun Tujuan</th>
                                    <th width='220px'>Judul Reminder</th>
                                    <th width='421px'>Isi Reminder</th>
                                    <th width='155px'>Tanggal dan Waktu</th>
                                    <th width='42px'></th>
                                </tr>
                            </thead>
                            <tbody className="table-body-reminder-owner">
                                {
                                    allReminder.map((reminder,index) => {
                                        return(
                                            <TabelReminder
                                                key={index}
                                                id={reminder._id}
                                                judul={reminder.judul}
                                                isi={reminder.isi}
                                                kepada={reminder.kepada.instansi}
                                                nama={reminder.kepada.nama}
                                                delete={deleteReminder}
                                                tanggal={reminder.jadwal}
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
                limit={limit}
                page={page}
                total={total}
            />
        </Fragment>
    )
}


export default Reminder;