const db = require("../system/database")

module.exports = async (sock, msg, args) => {
  const sender = msg.key.remoteJid
  const listId = parseInt(args[0])
  if (isNaN(listId)) return sock.sendMessage(sender, { text: "Usage: =buyplayer listing_index" })

  await db.update("./data/market.json", async (market) => {
    const listing = market[listId - 1]
    if (!listing) return sock.sendMessage(sender, { text: "Listing not found" })

    await db.update("./data/players.json", async (players) => {
      const buyer = players[sender]
      const seller = players[listing.seller]
      if (buyer.gold < listing.price) return sock.sendMessage(sender, { text: "Not enough gold" })

      buyer.gold -= listing.price
      if (seller) seller.gold += listing.price

      const { addItem } = require("../system/inventory")
      addItem(sender, listing.item, 1)

      market.splice(listId - 1, 1)
      sock.sendMessage(sender, { text: `✅ Bought ${listing.item} for ${listing.price} gold` })
    })
  })
}
