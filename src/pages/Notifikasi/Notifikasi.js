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
import bg_1 from '../../assets/decoration/bg_1.png'
import bg_2 from '../../assets/decoration/bg_2.png'
import bg_3 from '../../assets/decoration/bg_3.png'
import bg_4 from '../../assets/decoration/bg_4.png'

const Notifikasi = (props) => {
    const { token } = useContext(AuthContext)
    const { allReminder , setAllReminder, reminder, getReminder } = useContext(NotifContext)
    const [ reminderRev,setReminderRev ] = useState([])
    
    useEffect(() => {
        getReminder(token)
    },[])

    useEffect(() => {
        setReminderRev(allReminder)
    },[allReminder])

    console.log(allReminder)
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