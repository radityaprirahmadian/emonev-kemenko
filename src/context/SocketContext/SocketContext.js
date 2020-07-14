import React , { createContext, useContext, useState } from 'react';
import io from 'socket.io-client'
import { AuthContext } from '../Auth/AuthContext';

export const SocketContext = createContext();



const SocketState = (props) => {
    const socket = io('https://api.simonev.revolusimental.go.id')
    const [notifs, setNotifs] = useState([])

    const getNotif = (id) => {
        let cleanup = false;
        if (!cleanup) {
    
          socket.on("connect", () => {
            socket.emit("notif_subscribe", { user: id });
          });
    
          socket.on("notif_receive", payload => {
            setNotifs([...notifs, payload].reverse());
          });
        }

        return () => {
            cleanup = true;
          };
    }

    return(
        <SocketContext.Provider 
            value={{socket,notifs,getNotif}}
        >
            {props.children}
        </SocketContext.Provider>
    )
}

export default SocketState;