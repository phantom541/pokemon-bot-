const db = require("../system/database")
const { getRandomEnemy } = require("../system/enemySystem")
const { battle } = require("../system/battleEngine")
const { getPlayerBuffs } = require("../system/instability")
const { STARTER_DRAGON } = require("../system/constants")

module.exports = async (sock,msg) => {

 const sender = msg.key.remoteJid

 const players = db.read("./data/players.json")

 const player = players[sender]

 if(!player){
  return sock.sendMessage(sender,{text:"Register first using =register"})
 }

 const enemy = getRandomEnemy()
 const options = getPlayerBuffs(player)
 const attacker = player.dragons[0] || STARTER_DRAGON

 const result = battle(attacker, enemy, options)

 let log = `⚔️ Battle Started: ${attacker.name} vs ${enemy.name}\n\n`
 log += result.log.join("\n")

 if(result.winner === attacker.name){
  player.gold += enemy.gold
  log += `\n\n🏆 Victory!\nYou earned ${enemy.gold} gold.`
 } else {
  log += `\n\n☠️ You were defeated.`
 }

 db.write("./data/players.json",players)

 sock.sendMessage(sender,{text:log})

}
