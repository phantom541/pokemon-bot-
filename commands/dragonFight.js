const db = require("../system/database")
const { getRandomEnemy } = require("../system/enemySystem")
const { battle } = require("../system/battleEngine")
const { getPlayerBuffs } = require("../system/instability")
const { STARTER_DRAGON } = require("../system/constants")
const { addXP, checkEvolution, checkSkills } = require("../system/dragonSystem")

module.exports = async (sock, msg, args) => {
  const sender = msg.key.remoteJid
  await db.update("./data/players.json", async (players) => {
    const player = players[sender]
    if (!player) return sock.sendMessage(sender, { text: "Register first using =register" })

    const enemy = getRandomEnemy()
    const options = getPlayerBuffs(player)

    let dragonIdx = (player.team && player.team.length > 0) ? player.team[0] : 0
    let attacker = player.dragons[dragonIdx] || STARTER_DRAGON

    const result = battle(attacker, enemy, options)
    let log = `⚔️ Battle Started: ${attacker.name} vs ${enemy.name}\n\n`
    log += result.log.join("\n")

    if (result.winner === attacker.name) {
      player.gold += enemy.gold
      const xpEarned = 50
      log += `\n\n🏆 Victory!\nYou earned ${enemy.gold} gold and ${xpEarned} XP.`

      if (player.dragons[dragonIdx]) {
        const leveled = addXP(player.dragons[dragonIdx], xpEarned)
        checkSkills(player.dragons[dragonIdx])
        checkEvolution(player.dragons[dragonIdx])
        if (leveled) log += `\n\n✨ ${attacker.name} leveled up to Lv ${player.dragons[dragonIdx].level}!`
      }
    } else {
      log += `\n\n☠️ You were defeated.`
    }
    sock.sendMessage(sender, { text: log })
  })
}
