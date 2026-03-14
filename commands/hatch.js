const db = require("../system/database")
const inventory = require("../system/inventory")
const { getRandomDragon, createPlayerDragon } = require("../system/dragonSystem")

module.exports = async (sock, msg) => {
  const sender = msg.key.remoteJid
  await db.update("./data/players.json", async (players) => {
    const player = players[sender]
    if (!player) return sock.sendMessage(sender, { text: "Register first using =register" })
    if (!inventory.hasItem(sender, "dragon_egg", 1)) return sock.sendMessage(sender, { text: "🥚 You need a dragon egg." })

    inventory.removeItem(sender, "dragon_egg", 1)
    const dragonData = getRandomDragon()
    const dragon = createPlayerDragon(dragonData)
    player.dragons.push(dragon)

    sock.sendMessage(sender, {
      text: `🐉 A dragon hatched!\n\nName: ${dragon.name}\nElement: ${dragon.element}\nRarity: ${dragon.rarity}`
    })
  })
}
