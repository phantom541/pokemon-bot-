const db = require("../system/database")

module.exports = async (sock, msg, args) => {
  const item = args[0]
  const sender = msg.key.remoteJid
  await db.update("./data/players.json", async (players) => {
    const player = players[sender]
    if (!player) return

    const mart = db.read("./data/mart.json")
    let price = null
    for (const page in mart) {
      if (mart[page][item]) {
        price = mart[page][item]
        break
      }
    }

    if (!price) return sock.sendMessage(sender, { text: "Item cannot be sold" })
    if (!player.inventory || !player.inventory[item]) return sock.sendMessage(sender, { text: "You don't have that item" })

    const sellPrice = Math.floor(price * 0.5)
    player.gold += sellPrice
    player.inventory[item]--
    if (player.inventory[item] <= 0) delete player.inventory[item]

    sock.sendMessage(sender, { text: `💰 Sold ${item}\nGold received: ${sellPrice}` })
  })
}
