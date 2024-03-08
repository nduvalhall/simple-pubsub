import { createServer } from "http"
import { Server, Socket } from "socket.io"

const server = createServer()
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
})

function handleConnection(socket: Socket) {
    console.log("connection from", socket.id)
}

io.on("connection", (socket) => handleConnection(socket))

server.listen(3000, () => {
    console.log("Server listening on port 3000")
})
