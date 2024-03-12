"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const readline_1 = require("readline");
const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT) || 42069;
const URL = `http://${HOST}:${PORT}`;
const rl = (0, readline_1.createInterface)({ input: process.stdin, output: process.stdout });
function getInput() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => rl.question("input: ", resolve));
    });
}
const socket = (0, socket_io_client_1.io)(URL);
let interval = undefined;
function handleConnect() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("connected to server on", URL);
        socket.emit("subscribe", "test-topic");
        while (true) {
            let input = yield getInput();
            console.log("publishing to test-topic ->", { message: input });
            socket.emit("publish", "test-topic", { message: input });
        }
    });
}
function handleDisconnect() {
    console.log("disconnected from server on", URL);
    clearInterval(interval);
}
socket.on("connect", () => handleConnect());
socket.on("disconnect", () => handleDisconnect());
process.on("SIGINT", () => {
    clearInterval(interval);
    socket.disconnect();
    process.exit();
});
