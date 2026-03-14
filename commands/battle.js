const db = require("../system/database")
const { getRandomEnemy } = require("../system/enemySystem")
const { battle } = require("../system/battleEngine")
const { STARTER_DRAGON } = require("../system/constants")

module.exports = async (sock, msg) => {
  const sender = msg.key.remoteJid
  await db.update("./data/players.json", async (players) => {
    const player = players[sender]
    if (!player) return sock.sendMessage(sender, { text: "Register first using =register" })

    const enemy = getRandomEnemy()
    const attacker = (player.team && player.team.length > 0) ? (player.dragons[player.team[0]] || STARTER_DRAGON) : (player.dragons[0] || STARTER_DRAGON)

    const result = battle(attacker, enemy)
    let log = `⚔️ Battle Started\n\n`
    log += result.log.join("\n")

    if (result.winner === attacker.name) {
      player.gold += enemy.gold
      log += `\n\n🏆 Victory!\nYou earned ${enemy.gold} gold.`
    } else {
      log += `\n\n☠️ You were defeated.`
    }
    sock.sendMessage(sender, { text: log })
  })
}
