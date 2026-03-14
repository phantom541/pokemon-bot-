const db = require("../system/database")

module.exports = async (sock, msg, args) => {
  const sender = msg.key.remoteJid
  const action = args[0]?.toLowerCase()
  const item = args[1]
  const price = parseInt(args[2])

  if (action === "sell") {
    if (!item || isNaN(price)) return sock.sendMessage(sender, { text: "Usage: =market sell item price" })

    await db.update("./data/players.json", async (players) => {
      const player = players[sender]
      if (!player) return sock.sendMessage(sender, { text: "Register first using =register" })

      // Ownership verification
      if (!player.inventory || !player.inventory[item] || player.inventory[item] <= 0) {
        return sock.sendMessage(sender, { text: `You don't have ${item} to sell.` })
      }

      // Remove from player inventory
      player.inventory[item]--
      if (player.inventory[item] <= 0) delete player.inventory[item]

      await db.update("./data/market.json", async (market) => {
        market.push({
          seller: sender,
          item: item,
          price: price,
          id: Date.now()
        })
        sock.sendMessage(sender, { text: `📦 Listed ${item} for ${price} gold` })
      })
    })
  } else {
    const market = db.read("./data/market.json")
    if (market.length === 0) return sock.sendMessage(sender, { text: "Market is empty." })

    let text = "📦 Marketplace\n\n"
    market.forEach((list, i) => {
      text += `${i + 1}. ${list.item} - ${list.price} gold (Seller: @${list.seller.split("@")[0]})\n`
    })
    text += "\nUse =buyplayer listing_index"
    sock.sendMessage(sender, { text, mentions: market.map(l => l.seller) })
  }
}
