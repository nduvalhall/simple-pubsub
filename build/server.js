"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT) || 43069;
const server = (0, http_1.createServer)();
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
let connections = [];
function handleConnection(socket) {
    console.log("connection from", socket.id);
    connections.push({ id: socket.id, socket: socket, topics: new Set() });
}
function handleDisconnection(socket) {
    console.log("disconnection from", socket.id);
    connections = connections.filter((c) => c.id != socket.id);
}
function handleSubscription(socket, topic) {
    console.log(socket.id, "subscribed to", topic);
    let connection = connections.find((c) => c.id == socket.id);
    connection === null || connection === void 0 ? void 0 : connection.topics.add(topic);
}
function handleUnsubscription(socket, topic) {
    console.log(socket.id, "unsubscribed to", topic);
    let connection = connections.find((c) => c.id == socket.id);
    connection === null || connection === void 0 ? void 0 : connection.topics.delete(topic);
}
function handlePublish(socket, topic, message) {
    if (typeof message != "object") {
        socket.emit("error", { message: "message must be an Object" });
        console.error(socket.id, "published message must be an Object");
        return;
    }
    console.log(socket.id, "published to", topic, "->", message);
    connections.forEach((c) => {
        if (c.topics.has(topic)) {
            c.socket.emit("publish", topic, message);
        }
    });
}
io.on("connection", (socket) => {
    handleConnection(socket);
    socket.on("disconnect", () => handleDisconnection(socket));
    socket.on("subscribe", (topic) => handleSubscription(socket, topic));
    socket.on("unsubscribe", (topic) => handleUnsubscription(socket, topic));
    socket.on("publish", (topic, message) => handlePublish(socket, topic, message));
});
server.listen(PORT, HOST, () => {
    console.log(`Server listening on ${HOST}:${PORT}`);
});
