const db = require("../system/database")
const dungeonEngine = require("../system/dungeonEngine")

module.exports = async (sock, msg, args) => {
  const sender = msg.key.remoteJid
  const players = db.read("./data/players.json")
  const player = players[sender]

  if (!player) return sock.sendMessage(sender, { text: "Register first with =register" })

  const level = args[0] || "easy"

  const dungeon = dungeonEngine.generateDungeon(level)

  // Use battle engine to fight enemies
  const result = dungeonEngine.fightDungeon(player, dungeon)

  // Add gold reward
  player.gold += Math.floor(result.totalGold)
  db.write("./data/players.json", players)

  // Send battle log as message
  sock.sendMessage(sender, { text: `🏰 You explored ${dungeon.name}\n\n${result.log.join("\n")}\n💰 Gold earned: ${Math.floor(result.totalGold)}` })
}
