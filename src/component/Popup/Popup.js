import React,{useState,useEffect,Fragment,useContext} from 'react'
import { AuthContext } from '../../context/Auth/AuthContext'
import { NotifContext } from '../../context/Notifikasi/NotifContext'

const Popup = (props) => {
    const { notifNew } = useContext(NotifContext)
    const {userDetail} = useContext(AuthContext)
    // const [notifs,setNotifs] = useState([])
    const [not, setNot] = useState([])

    console.log(notifNew)

    useEffect(() => {
        if(notifNew){
            if(notifNew && notifNew.length > not.length) {
                alert('notif baruu')
                setNot(notifNew)
            }
        }
    },[notifNew && notifNew.length])
    
    console.log(props.notif)

    return(
        <Fragment/>
    )
}

export default Popup