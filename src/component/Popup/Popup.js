import React,{useState,useEffect,Fragment,useContext} from 'react'
import { AuthContext } from '../../context/Auth/AuthContext'
import { NotifContext } from '../../context/Notifikasi/NotifContext'

const Popup = (props) => {
    const { notifNew , deleteNotifNew , setNotifNew , getReminder } = useContext(NotifContext)
    const {userDetail , token} = useContext(AuthContext)
    const [notifs,setNotifs] = useState([])
    const [not, setNot] = useState([])
    const [tes, setTest] = useState(1)
    let test = 1
    let test2 = 1

    console.log(notifNew)
    console.log(notifs)
    console.log(not)

    // useEffect(() => {
    //     if(userDetail && userDetail.role === 'admin') {
    //         if(props.notif && props.notif.length > not.length){
    //             console.log('a')
    //             setTest(!tes)
    //             setNotifs(props.notif)
    //             setNotifNew(props.notif)
    //         } else {
    //             setNotifs([])
    //             deleteNotifNew()
    //         }
    //         // test = test + 1;
    //     }
    // },[props.notif])

    // useEffect(() => {
    //     if(userDetail && userDetail.role === 'admin') {
    //         if(notifNew && (notifNew.length) > not.length) {
    //             alert('Anda mendapatkan notifikasi baru')
    //             deleteNotifNew()
    //             setNot(notifNew)
    //         }
    //         // if(test > test2) {
    //         //     alert('Anda mendapatkan notifikasi baru')
    //         //     test2 = test2 + 1
    //         // }
    //     }
    // },[notifNew])

    useEffect(() => {
        setNotifs(props.notif)
        setNotifNew(props.notif)
    },[props.notif])

    useEffect(() => {
        if(notifs){
            if(notifs && notifs.length > not.length) {
                getReminder(token)
                alert('Anda Mendapatkan Sebuah Notifikasi Baru')
                setNot(notifNew)
                setNotifs([])
            }
        }
    },[notifNew && notifNew.length])

    
    console.log(props.notif)

    return(
        <Fragment/>
    )
}

export default Popup