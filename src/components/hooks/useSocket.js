import { useEffect } from "react";
import io from "socket.io-client";
import Environtment from "../../environment";
// import { useSelector } from "react-redux";
import { getToken } from '../utils'


export default function useSocket (channel, callback) {

    const { SocketUrl } = Environtment;
    const socket = io(SocketUrl);
    
    const startConnect = async() => {
        const { userToken } = await getToken()
        const body = { body: { access_token: userToken } };
        socket.emit("authentication", body);
    }

    useEffect(()=>{
        socket.on("connect", startConnect)
        socket.on("authenticated", () => {
            socket.on(channel, callback);
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

}

