import React,{Component,Fragment,useState,useEffect,useContext} from 'react';
import axios from 'axios'
import './Notifikasi.css';
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import SearchBar from '../../component/SearchBar/SearchBar';
import plus from '../../assets/plus.png';
import Pagination from '../../component/Pagination/Pagination';
import TabelReminder from '../../component/TabelReminder/TabelRemider';
import SearchBarAdmin from '../../component/SearchBarAdmin/SeacrhBarAdmin';
import avatar from '../../assets/avatar.png';
import { AuthContext } from '../../context/Auth/AuthContext';
import io from 'socket.io-client'
import { NotifContext } from '../../context/Notifikasi/NotifContext';
import CardNotif from '../../component/CardNotif/CardNotif';
import Popup from '../../component/Popup/Popup'

const Notifikasi = (props) => {
    const { token } = useContext(AuthContext)
    const { allReminder , setAllReminder, reminder, getReminder } = useContext(NotifContext)
    const [ reminderRev,setReminderRev ] = useState([])
    
    useEffect(() => {
        getReminder(token)
    },[])

    useEffect(() => {
        setReminderRev(allReminder.reverse())
    },[allReminder])

    console.log(allReminder)
    return(
        <Fragment>
            <SideBarOff/>
                <Popup notif={props.notif}/>
                    <div className="input-dan-tajuk">
                        <div className="spacer"></div>
                        <div className="tajuk-page-2">
                            <p>NOTIFIKASI</p>
                        </div>
                    </div>

                    <div className="notifikasi-card">
                        <div className="notifikasi-card-header">
                            Hari ini
                        </div>
                        {
                            allReminder ? (
                                reminderRev.map((reminder,index) => {
                                    return(
                                        <CardNotif 
                                            key={index}
                                            jadwal={reminder.jadwal}
                                            judul={reminder.judul}
                                            nama={reminder.dari.nama}
                                            dari={reminder.dari.instansi}
                                            isi={reminder.isi}
                                        />
                                    )
                                })
                            )
                            : ''
                        }
                    </div>
        </Fragment>

    )
}

export default Notifikasi;