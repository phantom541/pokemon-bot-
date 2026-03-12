const startBot = require("./system/connect")
const commandHandler = require("./system/commandHandler")

async function main() {

 const sock = await startBot()

 sock.ev.on("messages.upsert", async ({ messages }) => {

  const msg = messages[0]

  if (!msg.message) return

  const text =
   msg.message.conversation ||
   msg.message.extendedTextMessage?.text

  if (!text) return

  commandHandler(sock, msg, text)

 })

}

main()
