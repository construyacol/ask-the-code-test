import { useEffect, useState } from "react";
// import io from "socket.io-client";
// import Environtment from "../../environment";
// import { useSelector } from "react-redux";
import socket from 'const/socket'
import { getToken } from '../utils'


export default function useSocket (channel, callback) {

    // const { SocketUrl } = Environtment;
    // const socket = io(SocketUrl);
    const [ socketData, setSocketData ] = useState()
    
    const startConnect = async() => {
        const { userToken } = await getToken()
        const body = { body: { access_token: userToken } };
        socket.emit("authentication", body);
    }

    useEffect(()=>{
        // socket.on("connect", startConnect)
        startConnect()
        socket.on(channel, (data) => {
            setSocketData(prevState => {
                return { ...prevState, ...data}
            })
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return [ socketData ]

}

