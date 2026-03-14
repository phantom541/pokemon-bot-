const db = require("../system/database")
const { battle } = require("../system/battleEngine")

module.exports = async (sock, msg, args) => {
  const sender = msg.key.remoteJid
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid
  if (!mentioned || mentioned.length === 0) return sock.sendMessage(sender, { text: "Tag a player to challenge" })

  const opponent = mentioned[0]
  const players = db.read("./data/players.json")
  const p1 = players[sender]
  const p2 = players[opponent]

  if (!p1 || !p2) return sock.sendMessage(sender, { text: "Both players must be registered" })
  if (!p1.team || !p2.team || p1.team.length === 0 || p2.team.length === 0) return sock.sendMessage(sender, { text: "Both players need dragon teams" })

  const d1 = p1.dragons[p1.team[0]]
  const d2 = p2.dragons[p2.team[0]]

  const result = battle(d1, d2)
  let log = `⚔️ PvP Dragon Battle\n\n${d1.name} vs ${d2.name}\n\n`
  log += result.log.join("\n")

  if (result.winner === d1.name) {
    await db.update("./data/players.json", async (p) => { p[sender].gold += 500 })
    log += `\n\n🏆 Winner: @${sender.split("@")[0]}`
  } else {
    await db.update("./data/players.json", async (p) => { p[opponent].gold += 500 })
    log += `\n\n🏆 Winner: @${opponent.split("@")[0]}`
  }

  sock.sendMessage(sender, { text: log, mentions: [sender, opponent] })
}
