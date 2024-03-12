import { createServer } from "http"
import { Server, Socket } from "socket.io"

const HOST = process.env.HOST || "127.0.0.1"
const PORT = Number(process.env.PORT) || 42069

const server = createServer()
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
})

type Connection = {
    id: string
    socket: Socket
    topics: Set<string>
}

let connections: Connection[] = []

function handleConnection(socket: Socket) {
    console.log("connection from", socket.id)
    connections.push({ id: socket.id, socket: socket, topics: new Set() })
}

function handleDisconnection(socket: Socket) {
    console.log("disconnection from", socket.id)
    connections = connections.filter((c) => c.id != socket.id)
}

function handleSubscription(socket: Socket, topic: string) {
    console.log(socket.id, "subscribed to", topic)
    let connection = connections.find((c) => c.id == socket.id)
    connection?.topics.add(topic)
}

function handleUnsubscription(socket: Socket, topic: string) {
    console.log(socket.id, "unsubscribed to", topic)
    let connection = connections.find((c) => c.id == socket.id)
    connection?.topics.delete(topic)
}

function handlePublish(socket: Socket, topic: string, message: Object) {
    if (typeof message != "object") {
        socket.emit("error", { message: "message must be an Object" })
        console.error(socket.id, "published message must be an Object")
        return
    }

    console.log(socket.id, "published to", topic, "->", message)
    connections.forEach((c) => {
        if (c.topics.has(topic)) {
            c.socket.emit("publish", topic, message)
        }
    })
}

io.on("connection", (socket) => {
    handleConnection(socket)
    socket.on("disconnect", () => handleDisconnection(socket))
    socket.on("subscribe", (topic: string) => handleSubscription(socket, topic))
    socket.on("unsubscribe", (topic: string) => handleUnsubscription(socket, topic))
    socket.on("publish", (topic: string, message: Object) => handlePublish(socket, topic, message))
})

server.listen(PORT, HOST, () => {
    console.log(`Server listening on ${HOST}:${PORT}`)
})
