const db = require("../system/database")

module.exports = async (sock, msg) => {
  const sender = msg.key.remoteJid
  const players = db.read("./data/players.json")
  const player = players[sender]
  if (!player) return sock.sendMessage(sender, { text: "Register first using =register" })

  if (!player.quests || player.quests.length === 0) {
    return sock.sendMessage(sender, { text: "No active quests" })
  }

  let text = "📜 Your Quests\n\n"
  player.quests.forEach(q => {
    text += `${q.id}: ${q.progress}/${q.goal}${q.complete ? " (Complete!)" : ""}\n`
  })
  sock.sendMessage(sender, { text })
}
