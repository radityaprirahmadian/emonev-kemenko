import React, { Component, useContext, useEffect } from 'react';
import './Notification.css';
import lonceng from '../../assets/lonceng.png';
import { Link } from 'react-router-dom'
import { NotifContext } from '../../context/Notifikasi/NotifContext';
import { AuthContext } from '../../context/Auth/AuthContext';

const Notification = () => {
    const { allReminder, reminder, setAllReminder , getReminder } = useContext(NotifContext)
    const { user } = useContext(AuthContext);

    // console.log(reminder)
        return(
            <div className="notification">
                <Link to={`/${user && user.role === 'owner' ? 'super-admin' : 'admin'}/notifikasi`}>
                    <button><img src={lonceng} />
                        <div className="notification-counter">{reminder}</div>
                    </button>
                </Link>
            </div>
        )
}

export default Notification;