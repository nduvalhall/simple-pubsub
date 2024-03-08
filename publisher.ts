import { io } from "socket.io-client"
import { createInterface } from "readline"

const HOST = process.env.HOST || "127.0.0.1"
const PORT = Number(process.env.PORT) || 42069
const URL = `http://${HOST}:${PORT}`
const rl = createInterface({ input: process.stdin, output: process.stdout })

async function getInput(): Promise<string> {
    return new Promise((resolve) => rl.question("input: ", resolve))
}

const socket = io(URL)
let interval: NodeJS.Timeout | undefined = undefined

async function handleConnect() {
    console.log("connected to server on", URL)
    socket.emit("subscribe", "test-topic")

    while (true) {
        let input = await getInput()
        console.log("publishing to test-topic ->", { message: input })
        socket.emit("publish", "test-topic", { message: input })
    }
}

function handleDisconnect() {
    console.log("disconnected from server on", URL)
    clearInterval(interval)
}

socket.on("connect", () => handleConnect())
socket.on("disconnect", () => handleDisconnect())

process.on("SIGINT", () => {
    clearInterval(interval)
    socket.disconnect()
    process.exit()
})
