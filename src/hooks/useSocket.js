import { useEffect, useState } from "react";
// import io from "socket.io-client";
// import Environtment from "../../environment";
// import { useSelector } from "react-redux";
import socket from 'const/socket'
import { getUserToken } from 'utils/handleSession'


export default function useSocket (channel, callback) {

    // const { SocketUrl } = Environtment;
    // const socket = io(SocketUrl);
    const [ socketData, setSocketData ] = useState()
    
    const startConnect = async() => {
        const { userToken } = await getUserToken()
        const body = { body: { access_token: userToken } };
        socket.emit("authentication", body);
    }

    useEffect(()=>{
        socket.on("connect", startConnect)
        socket.on(channel, (data) => {
            setSocketData(prevState => {
                return { ...prevState, ...data}
            })
        });
        return () => {
            socket.off('connect');
            socket.off(channel);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return [ socketData ]

}

