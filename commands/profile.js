const db = require("../system/database")

module.exports = async (sock, msg) => {

 const sender = msg.key.remoteJid

 const players = db.read("./data/players.json")

 const player = players[sender]

 if (!player) {

  sock.sendMessage(sender, { text: "You must register first using =register" })
  return

 }

 const text = `
🐉 Dragon Tamer Profile

Gold: ${player.gold}
Dragons: ${player.dragons.length}
Rare Dragons: ${player.rareDragons.length}
Eyes: ${player.eyes.length}
Guild: ${player.guild || "None"}
`

 sock.sendMessage(sender, { text })

}
