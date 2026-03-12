const db = require("../system/database")
const { getRandomEnemy } = require("../system/enemySystem")
const { battle } = require("../system/battleEngine")
const { getPlayerBuffs } = require("../system/instability")
const { STARTER_DRAGON } = require("../system/constants")

module.exports = async (sock, msg, args) => {
  const sender = msg.key.remoteJid
  const players = db.read("./data/players.json")
  const player = players[sender]

  if(!player) return sock.sendMessage(sender,{text:"Register first =register"})
  if(player.dragons.length === 0) return sock.sendMessage(sender,{text:"You have no dragons!"})

  // pick dragon by index
  let idx = parseInt(args[0]) - 1
  if(isNaN(idx) || !player.dragons[idx]) idx = 0

  const dragon = player.dragons[idx]
  const enemy = getRandomEnemy()
  const options = getPlayerBuffs(player)

  const result = battle(dragon, enemy, options)

  let log = `⚔️ Battle Started: ${dragon.name} vs ${enemy.name}\n\n`
  log += result.log.join("\n")

  if(result.winner === dragon.name) {
    const goldEarned = enemy.gold
    player.gold += goldEarned
    log += `\n\n🏆 Victory! You earned ${goldEarned} gold.`
  } else {
    log += `\n\n☠️ ${dragon.name} was defeated.`
  }

  db.write("./data/players.json",players)
  sock.sendMessage(sender,{text:log})
}
