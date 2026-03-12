const db = require("../system/database")
const worldManager = require("../system/worldManager")
const eyeSystem = require("../system/eyeSystem")
const instability = require("../system/instability")
const { checkCooldown } = require("../system/cooldown")

module.exports = async (sock, msg, args) => {

 const sender = msg.key.remoteJid

 // Use db.update for atomic player and world updates
 await db.update("./data/players.json", async (players) => {
  const player = players[sender]

  if (!player) {
   return sock.sendMessage(sender, { text: "Register first with =register" })
  }

  const wait = checkCooldown(sender, "titan", 300000)

  if (wait > 0) {
   return sock.sendMessage(sender, {
    text: `⏳ Titans need time to recover. Wait ${wait} seconds.`
   })
  }

  // Use db.update for world state
  await db.update("./data/world.json", async (world) => {
   const titan = world.activeTitans?.[0]

   if (!titan) {
    return sock.sendMessage(sender, { text: "No Titan is active." })
   }

   const result = worldManager.fightTitan(player, titan)

   let rewardText = ""

   if (result.winner === (player.dragons[0]?.name || "Starter Dragon")) {

    const gold = 500
    player.gold += gold

    rewardText += `💰 Gold earned: ${gold}\n`

    // Remove titan since it was defeated
    world.activeTitans.shift()

    // Eye drop attempt
    const eye = eyeSystem.tryEyeDrop()

    if (eye && player.guild) {
     eyeSystem.giveEyeToGuild(player, eye)
     rewardText += `👁 Your guild obtained the Eye of ${eye.toUpperCase()}!\n`

     // Instability check
     const guilds = db.read("./data/guilds.json")
     const guild = guilds[player.guild]
     const instabilityMsg = instability.checkInstability(guild)
     if (instabilityMsg) {
      rewardText += instabilityMsg
     }
    }
   }

   sock.sendMessage(sender,{
    text:
  `⚔ Titan Battle

  ${result.log.join("\n")}

  Winner: ${result.winner}

  ${rewardText}`
   })
  })
 })
}
