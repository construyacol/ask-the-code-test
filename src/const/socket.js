import io from 'socket.io-client';
import Environtment from "environment";

const { SocketUrl } = Environtment;
const socket = io(SocketUrl);

export default socket

