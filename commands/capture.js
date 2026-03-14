const db = require("../system/database")

module.exports = async (sock, msg) => {
  const sender = msg.key.remoteJid
  await db.update("./data/world.json", async (world) => {
    if (!world.colossal) return sock.sendMessage(sender, { text: "No beast to capture" })

    await db.update("./data/players.json", async (players) => {
      const player = players[sender]
      const item = world.colossal.captureItem
      if (!player.inventory || !player.inventory[item]) return sock.sendMessage(sender, { text: `You need ${item} to capture this beast` })

      player.inventory[item]--
      if (player.inventory[item] <= 0) delete player.inventory[item]

      if (Math.random() < 0.1) {
        if (!player.titans) player.titans = []
        player.titans.push(world.colossal)
        world.colossal = null
        sock.sendMessage(sender, { text: "🎉 You captured the Colossal Beast!" })
      } else {
        sock.sendMessage(sender, { text: "❌ Capture failed" })
      }
    })
  })
}
