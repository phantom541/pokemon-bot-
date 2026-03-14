const db = require("../system/database")

module.exports = async (sock, msg) => {
  const sender = msg.key.remoteJid
  const players = db.read("./data/players.json")
  const player = players[sender]
  if (!player) return sock.sendMessage(sender, { text: "Register first" })
  if (!player.dragons || player.dragons.length === 0) return sock.sendMessage(sender, { text: "🐉 You have no dragons." })

  let text = "🐉 Your Dragons\n\n"
  player.dragons.forEach((d, i) => {
    text += `${i + 1}. ${d.name}\n`
    text += `Level: ${d.level} | XP: ${d.xp}/${d.level * 100}\n`
    text += `HP: ${d.hp} | ATK: ${d.attack}\n`
    text += `Element: ${d.element}\n\n`
  })
  sock.sendMessage(sender, { text })
}
