import { createContext } from "react";
import {io} from "socket.io-client";

const SocketContext = createContext();
const socket = io("http://localhost:5000");

export { SocketContext, socket };
 