const db = require("../system/database")

module.exports = async (sock, msg, args) => {
  const sender = msg.key.remoteJid
  await db.update("./data/players.json", async (players) => {
    const player = players[sender]
    if (!player) return sock.sendMessage(sender, { text: "Register first" })
    if (args.length < 1) return sock.sendMessage(sender, { text: "Usage: =setteam 1 2 3" })

    const indexes = args.map(n => parseInt(n) - 1).filter(idx => idx >= 0 && idx < player.dragons.length)
    if (indexes.length === 0) return sock.sendMessage(sender, { text: "Invalid dragon indexes." })

    player.team = indexes.slice(0, 3) // Limit to 3
    sock.sendMessage(sender, { text: "✅ Dragon team updated" })
  })
}
