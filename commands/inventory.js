const db = require("../system/database")

module.exports = async (sock, msg) => {

 const sender = msg.key.remoteJid

 const players = db.read("./data/players.json")

 const player = players[sender]

 if (!player) {
  return sock.sendMessage(sender,{ text: "Register first with =register" })
 }

 const inv = player.inventory || {}

 if (Object.keys(inv).length === 0) {
  return sock.sendMessage(sender,{ text: "🎒 Your inventory is empty." })
 }

 let text = "🎒 Inventory\n\n"

 for (const item in inv) {
  text += `${item} x${inv[item]}\n`
 }

 sock.sendMessage(sender,{ text })

}
