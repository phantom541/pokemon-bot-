const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const pino = require("pino")

async function startBot() {

 const { state, saveCreds } = await useMultiFileAuthState("session")

 const sock = makeWASocket({
  auth: state,
  logger: pino({ level: "silent" })
 })

 sock.ev.on("creds.update", saveCreds)

 console.log("Bot connected")

 return sock
}

module.exports = startBot
