const db = require("../system/database")

module.exports = async (sock, msg, args) => {
  const sender = msg.key.remoteJid
  const players = db.read("./data/players.json")
  const player = players[sender]
  if (!player) return sock.sendMessage(sender, { text: "Register first" })

  const index = parseInt(args[0]) - 1
  const dragon = player.dragons[index]
  if (!dragon) return sock.sendMessage(sender, { text: "Dragon not found" })

  let text = `🐉 ${dragon.name} Moves\n\n`
  if (!dragon.moves || dragon.moves.length === 0) {
    text += "No moves learned yet."
  } else {
    dragon.moves.forEach((m, i) => {
      text += `${i + 1}. ${m}\n`
    })
  }
  sock.sendMessage(sender, { text })
}
