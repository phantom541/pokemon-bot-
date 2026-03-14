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
Title: ${player.title || "None"}

Gold: ${player.gold}
Dragons: ${player.dragons ? player.dragons.length : 0}
Eyes: ${player.eyes ? player.eyes.length : 0}
Guild: ${player.guild || "None"}
Achievements: ${player.achievements ? player.achievements.length : 0}
`
  sock.sendMessage(sender, { text })
}
