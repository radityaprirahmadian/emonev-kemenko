import React,{useState,useEffect,Fragment,useContext} from 'react'
import { AuthContext } from '../../context/Auth/AuthContext'
import { NotifContext } from '../../context/Notifikasi/NotifContext'

const Popup = (props) => {
    const { notifNew , deleteNotifNew , setNotifNew , getReminder } = useContext(NotifContext)
    const {userDetail , token} = useContext(AuthContext)
    const [notifs,setNotifs] = useState([])
    const [not, setNot] = useState([])

    useEffect(() => {
        if(userDetail && userDetail.role === 'admin') {
            setNotifs(props.notif)
            setNotifNew(props.notif)
        }
    },[props.notif])

    useEffect(() => {
        if(userDetail && userDetail.role === 'admin') {
            if(notifs){
                if(notifs && notifs.length > not.length) {
                    getReminder(token)
                    alert('Anda Mendapatkan Sebuah Notifikasi Baru')
                    setNot(notifNew)
                    setNotifs([])
                }
            }
        }
    },[notifNew && notifNew.length])

    return(
        <Fragment/>
    )
}

export default Popup