import React, { Fragment, useState, useContext, useEffect } from 'react';
import './Notification.css';
import lonceng from '../../assets/lonceng.png';
import { Link, useHistory , useLocation} from 'react-router-dom'
import { NotifContext } from '../../context/Notifikasi/NotifContext';
import axios from 'axios'
import { AuthContext } from '../../context/Auth/AuthContext';
import CardPopup from '../CardPopup/CardPopup';
import polygon from '../../assets/Polygon_1.png';

const Notification = () => {
    const { allReminder, reminder, setAllReminder , getReminder } = useContext(NotifContext)
    const { user,token } = useContext(AuthContext);
    const [loading , setLoading ] = useState(false)
    const { pathname } = useLocation()
    const [hide,setHide] = useState(true)
    const [ reminderRev,setReminderRev ] = useState([])
    const history = useHistory()
    
    const onClick = (e) => {
        getReminder(token)
        e.preventDefault()
        setHide(!hide)
    }

    useEffect(() => {
        getReminder(token)
    },[token])

    useEffect(() => {
        const arr = []
        allReminder.filter(reminder => reminder.dibaca === false).map(reminder => {
            arr.push(reminder)
        })
        setReminderRev(arr)
    },[reminder])


    const updateDibaca = async (id) => {
        setLoading(true)
        const data = { dibaca: true }

        const config= {
            headers: {
                'X-Auth-Token': `Bearer ${token}`
            }
        }
        try {
            const res = await axios.put(`https://api.simonev.revolusimental.go.id/api/v1/notifikasi/${id}`, data, config)   
        }
        catch (err) {
            console.log(err)  
        }  
    }

    const onDetail = (e) => {
        allReminder.map(reminder => {
            updateDibaca(reminder._id)
        })
        history.push(`/${user && user.role === 'owner' ? 'super-admin' : 'admin'}/notifikasi-saya`)
        setReminderRev([])
    }


        return(
            <Fragment>
                <div className="notification">
                    <button style={{backgroundColor:'rgba(0,0,0,0)'}} onClick={onClick}>
                        <img src={lonceng} />
                        <div className="notification-counter">{reminder}</div>
                    </button>
                    {
                        hide ?
                        ''
                        :
                        <div className="notif-popup-div">
                            <div className="notif-popup-title">
                                <img src={polygon} alt='polygon' className='polygon'></img>
                                <div style={{marginLeft:'20px'}}>Hari Ini</div>
                                <div className='spacer'></div>
                                <div className='popup-right' onClick={onDetail}>LIHAT SEMUA NOTIFIKASI</div>
                            </div>
                            <div>
                                {
                                    reminderRev.slice(0,3).map((reminder,index) => {
                                        return(  
                                            reminder.dari ?
                                                <CardPopup
                                                    key={index}
                                                    jadwal={reminder.jadwal}
                                                    nama={reminder.dari.nama}
                                                    dari={reminder.dari.instansi}
                                                    logo={reminder.dari.logo}
                                                    foto={reminder.dari.foto}
                                                />
                                            :
                                                <CardPopup
                                                    key={index}
                                                    jadwal={reminder.jadwal}
                                                />
                                            
                                        )
                                    })
                                }
                            </div>
                        </div>
                    }
                </div>
            </Fragment>
        )
}

export default Notification;