const db = require("../system/database")

module.exports = async (sock, msg, args) => {
  const sender = msg.key.remoteJid
  const title = args.join(" ")
  if (!title) return sock.sendMessage(sender, { text: "Usage: =title TitleName" })

  await db.update("./data/players.json", async (players) => {
    const player = players[sender]
    if (!player) return sock.sendMessage(sender, { text: "Register first using =register" })
    if (!player.achievements || !player.achievements.includes(title)) return sock.sendMessage(sender, { text: "You haven't unlocked that title" })

    player.title = title
    sock.sendMessage(sender, { text: `🏅 Title set to ${title}` })
  })
}
