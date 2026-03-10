const db = require("../system/database")
const worldManager = require("../system/worldManager")

module.exports = async (sock, msg, args) => {
  const sender = msg.key.remoteJid
  const players = db.read("./data/players.json")
  const player = players[sender]

  if (!player) return sock.sendMessage(sender, { text: "Register first with =register" })

  // Spawn or pick active titan
  let world = db.read("./data/world.json")
  if (!world.activeTitans || world.activeTitans.length === 0) {
    const titan = worldManager.spawnTitan()
    if (!titan) return sock.sendMessage(sender, { text: "No titans available to spawn." })
    world = db.read("./data/world.json")
    sock.sendMessage(sender, { text: `🌋 A Titan has appeared: ${titan.name}` })
  }

  const titan = world.activeTitans[0]

  // Fight the titan
  const result = worldManager.fightTitan(player, titan)

  // Gold reward
  const goldEarned = 500 // simple fixed reward for now
  player.gold += goldEarned
  db.write("./data/players.json", players)

  sock.sendMessage(sender, {
    text: `⚔ Battle vs ${titan.name}:\n\n${result.log.join("\n")}\n\nWinner: ${result.winner}\n💰 Gold earned: ${goldEarned}`
  })
}
