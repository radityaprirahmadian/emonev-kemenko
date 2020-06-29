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
import bg_1 from '../../assets/decoration/bg_1.png'
import bg_2 from '../../assets/decoration/bg_2.png'
import bg_3 from '../../assets/decoration/bg_3.png'
import bg_4 from '../../assets/decoration/bg_4.png'
import Spinner from '../../component/Spinner/Spinner'

const Reminder = (props) => {
    const { user, token } = useContext(AuthContext)
    const [loading, setLoading] = useState(false)

    const [ allReminder, setAllReminder ] = useState([])
    console.log(allReminder)

    const [ filter, setFilter ] = useState({
        limit: '10',
        page: '1',
        total: ''
    })

    const {
        limit,
        page,
        total
    } = filter

    const getAllReminder = async () => {
        setLoading(true)
        const config= {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`,
            }
        }
        try {
            const res = await axios.get(`https://test.bariqmbani.me/api/v1/notifikasi/tabel?page=${page}&limit=${limit}`,config)
            setAllReminder(res.data.notifikasi)
            setFilter({...filter, total: res.data.total})
            setLoading(false)
        }
        catch (err) {
            console.log(err.message)  
        }  
    }

    const deleteReminder = async (id) => {
        setLoading(true)
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
        setLoading(false)
    }


    useEffect(() => {
        getAllReminder()
    },[limit,page])
    
    return(
        <Fragment>
            <SideBarOff/>
            <Popup notif={props.notif}/>
                <div className="background-after-login">
                    <img src={bg_1} alt='bg1' style={{position: 'fixed' , top:'0' , left: '0'}}/>
                    <img src={bg_2} alt='bg2' style={{position: 'fixed' , top:'0' , right: '0'}}/>
                    <img src={bg_3} alt='bg3' style={{position: 'fixed' , bottom:'-200px' , left: '0'}}/>
                    <img src={bg_4} alt='bg4' style={{position: 'fixed' , bottom:'-50px' , right: '0'}}/>
                </div>
                {
                    user && user.role === 'owner' ?
                        ''
                    :
                        <Notification/>
                }
                    <div className="input-dan-tajuk">
                        <Link to={`/${user && user.role === 'owner' ? 'super-admin' : 'admin'}/formulir-reminder`}>
                            <button className="tambah-program">
                                <img src={plus}></img>
                                <div className="spacer"></div>
                                <p className="text-input-program">
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
                        <table className="table-reminder-owner"  style={{marginRight:'20px' , backgroundColor: 'white'}}>
                            <thead className="table-head-reminder">
                                <tr>
                                    <th width='191px' className={user && user.role === 'super_admin' ? 'd-none' : ''}>Instansi Tujuan</th>
                                    <th width='125px'>Akun Tujuan</th>
                                    <th width='220px'>Judul Reminder</th>
                                    <th width='421px'>Isi Reminder</th>
                                    <th width='155px'>Tanggal dan Waktu</th>
                                    <th width='42px'></th>
                                </tr>
                            </thead>
                            {
                                !loading && (
                                    <tbody className="table-body-reminder">
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
                limit={limit}
                page={page}
                total={total}
            />
        </Fragment>
    )
}


export default Reminder;