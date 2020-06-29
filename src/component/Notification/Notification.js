import React, { Fragment, useState, Component, useContext, useEffect } from 'react';
import './Notification.css';
import lonceng from '../../assets/lonceng.png';
import { Link, useHistory } from 'react-router-dom'
import { NotifContext } from '../../context/Notifikasi/NotifContext';
import { AuthContext } from '../../context/Auth/AuthContext';
import avatar from '../../assets/avatar.png';
import CardPopup from '../CardPopup/CardPopup';

const Notification = () => {
    const { allReminder, reminder, setAllReminder , getReminder } = useContext(NotifContext)
    const { user,token } = useContext(AuthContext);
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
    },[])

    useEffect(() => {
        setReminderRev(allReminder)
    },[allReminder])

    const onDetail = (e) => {
        history.push(`/${user && user.role === 'owner' ? 'super-admin' : 'admin'}/notifikasi`)
    }


    // console.log(reminder)
        return(
            <Fragment>
                <div className="notification">
                    {/* <Link to={`/${user && user.role === 'owner' ? 'super-admin' : 'admin'}/notifikasi`}> */}
                        <button style={{backgroundColor:'rgba(0,0,0,0)'}} onClick={onClick}>
                            <img src={lonceng} />
                            <div className="notification-counter">{reminder}</div>
                        </button>
                    {/* </Link> */}
                    {
                        hide ?
                        ''
                        :
                        <div className="notif-popup-div">
                            <div className="notif-popup-title">
                                <div style={{marginLeft:'20px'}}>Hari Ini</div>
                                <div className='spacer'></div>
                                <div className='popup-right' onClick={onDetail}>LIHAT SEMUA NOTIFIKASI</div>
                            </div>
                            <div>
                                {
                                    reminderRev.slice(0,3).map((reminder,index) => {
                                        return(
                                            
                                            <CardPopup
                                            key={index}
                                                jadwal={reminder.jadwal}
                                                nama={reminder.dari.nama}
                                                dari={reminder.dari.instansi}
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