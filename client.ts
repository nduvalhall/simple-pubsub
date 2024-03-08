import { io } from "socket.io-client"

const socket = io("http://localhost:3000")

function handleConnect() {
    console.log(socket.id)
}

socket.on("connect", () => handleConnect())
