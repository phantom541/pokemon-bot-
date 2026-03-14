const db = require("../system/database")

module.exports = async (sock, msg) => {
  const sender = msg.key.remoteJid
  const players = db.read("./data/players.json")
  const dragons = db.read("./data/dragons.json")
  const beasts = db.read("./data/beasts.json")
  const guardians = db.read("./data/guardians.json")
  const world = db.read("./data/world.json")
  const player = players[sender]

  if (!player) return sock.sendMessage(sender, { text: "Register first" })

  let enemy, type
  if (world.guardian) {
    enemy = world.guardian
    type = "World Guardian"
  } else if (world.colossal) {
    enemy = world.colossal
    type = "Colossal Beast"
  } else {
    const keys = Object.keys(dragons)
    const randomKey = keys[Math.floor(Math.random() * keys.length)]
    enemy = { ...dragons[randomKey], hp: dragons[randomKey].baseHP, attack: dragons[randomKey].baseAttack }
    type = "Wild Dragon"
  }

  const { battle } = require("../system/battleEngine")
  const attacker = (player.team && player.team.length > 0) ? (player.dragons[player.team[0]]) : (player.dragons[0])
  if (!attacker) return sock.sendMessage(sender, { text: "You need a dragon to hunt!" })

  const result = battle(attacker, enemy)
  let log = `⚔️ Encounter: ${type}\n\n${attacker.name} vs ${enemy.name}\n\n`
  log += result.log.join("\n")

  if (result.winner === attacker.name) {
    await db.update("./data/players.json", async (p) => {
      p[sender].gold += enemy.reward || 200
    })
    log += `\n\n🏆 You defeated ${enemy.name}!`
    if (world.guardian || world.colossal) {
      await db.update("./data/world.json", async (w) => {
        if (world.guardian && enemy.name === world.guardian.name) w.guardian = null
        if (world.colossal && enemy.name === world.colossal.name) w.colossal = null
      })
    }
  } else {
    log += `\n\n💀 Your dragon was defeated`
  }
  sock.sendMessage(sender, { text: log })
}
