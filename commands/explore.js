const db = require("../system/database")
const inventory = require("../system/inventory")
const { checkCooldown } = require("../system/cooldown")

module.exports = async (sock, msg) => {
  const sender = msg.key.remoteJid
  await db.update("./data/players.json", async (players) => {
    const player = players[sender]
    if (!player) return sock.sendMessage(sender, { text: "Register first with =register" })

    const wait = checkCooldown(sender, "explore", 60000)
    if (wait > 0) return sock.sendMessage(sender, { text: `⏳ You must wait ${wait} seconds before exploring again.` })

    const roll = Math.random()
    let text = "🌍 You explore the wilds...\n\n"
    if (roll < 0.30) {
      const gold = Math.floor(Math.random() * 200) + 50
      player.gold += gold
      text += `💰 You found ${gold} gold.`
    } else if (roll < 0.50) {
      inventory.addItem(sender, "relic_fragment", 1)
      text += "🪨 You discovered a relic fragment."
    } else if (roll < 0.65) {
      inventory.addItem(sender, "dragon_egg", 1)
      text += "🥚 You found a mysterious dragon egg."
    } else if (roll < 0.80) {
      text += "⚔️ A wild creature appears.\nUse =battle to fight it."
    } else if (roll < 0.92) {
      text += "🏛️ You discovered a hidden dungeon.\nUse =dungeon to enter."
    } else {
      text += "🌫️ Nothing interesting happened."
    }
    sock.sendMessage(sender, { text })
  })
}
