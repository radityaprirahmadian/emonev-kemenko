import React, {createContext, useReducer, useEffect} from 'react';
import NotifReducer from './NotifReducer';
import axios from 'axios';

export const NotifContext = createContext();

const NotifState = (props) => {
    const initialState = {
        token: localStorage.getItem('token'),
        reminder: null,
        allReminder: [],
        notifNew: []
    };
    
    const [state,dispatch] = useReducer(NotifReducer,initialState)
    console.log(state)
    console.log(state.notifNew)

    const setAllReminder = (data) => {
        console.log(data)
        dispatch({
            type: 'GET_ALL_REMINDER_TOTAL',
            payload: data
        })
    }

    const setNotifNew = (data) => {
        console.log(data)
        dispatch({
            type: 'SET_NOTIF',
            payload: data
        })
    }
    
    const getReminder = async (token) => {
        const config = {
            headers: {
                'X-Auth-Token' : `aweuaweu ${token}`
            }
        }
        try {
            const res = await axios.get('https://api.simonev.revolusimental.go.id/api/v1/notifikasi',config)
            dispatch({
                type: 'GET_ALL_REMINDER',
                payload: res.data.notifikasi
            })
            setAllReminder(res.data.notifikasi.length)
        }
        catch(err) {
            console.log(err)
        }
    }

    const resetNotif = () => {
        dispatch({
            type: 'RESET_NOTIFICATION'
        })
    }
    return(
        <NotifContext.Provider 
            value={{
                token: state.token,
                reminder: state.reminder,
                allReminder: state.allReminder,
                notifNew: state.notifNew,
                setAllReminder,
                getReminder,
                resetNotif,
                setNotifNew
            }}
        >
            {props.children}
        </NotifContext.Provider>
    )
}

export default NotifState;