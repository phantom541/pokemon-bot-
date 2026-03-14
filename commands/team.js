const db = require("../system/database")

module.exports = async (sock, msg, args) => {
  const sender = msg.key.remoteJid
  const players = db.read("./data/players.json")
  const player = players[sender]
  if (!player) return sock.sendMessage(sender, { text: "Register first" })

  if (args.length === 0) {
    if (!player.team || player.team.length === 0) {
      return sock.sendMessage(sender, { text: "You have no team set.\nUse =setteam 1 2 3" })
    }
    let text = "🐉 Your Active Dragon Team\n\n"
    player.team.forEach((idx) => {
      const d = player.dragons[idx]
      if (d) text += `${d.name} (Lv ${d.level})\n`
    })
    return sock.sendMessage(sender, { text })
  }
}
