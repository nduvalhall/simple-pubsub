"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT) || 42069;
const URL = `http://${HOST}:${PORT}`;
const socket = (0, socket_io_client_1.io)(URL);
let interval = undefined;
function handleConnect() {
    console.log("connected to server on", URL);
    socket.emit("subscribe", "test-topic");
}
function handleDisconnect() {
    console.log("disconnected from server on", URL);
    clearInterval(interval);
}
function handlePublish(topic, message) {
    console.log("received message from", topic, "->", message);
}
socket.on("connect", () => handleConnect());
socket.on("disconnect", () => handleDisconnect());
socket.on("publish", (topic, message) => handlePublish(topic, message));
process.on("SIGINT", () => {
    clearInterval(interval);
    socket.disconnect();
    process.exit();
});
