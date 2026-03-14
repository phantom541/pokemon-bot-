const db = require("../system/database")
const inventory = require("../system/inventory")

module.exports = async (sock, msg, args) => {
  const item = args[0]
  const sender = msg.key.remoteJid

  if (!item) {
    return sock.sendMessage(sender, {
      text: "Usage: =buy item_name"
    })
  }

  await db.update("./data/players.json", async (players) => {
    const player = players[sender]

    if (!player) {
      return sock.sendMessage(sender, {
        text: "Register first using =register"
      })
    }

    const mart = db.read("./data/mart.json")
    let price = null

    for (const page in mart) {
      if (mart[page][item]) {
        price = mart[page][item]
        break
      }
    }

    if (!price) {
      return sock.sendMessage(sender, {
        text: "Item not found in mart."
      })
    }

    if (player.gold < price) {
      return sock.sendMessage(sender, {
        text: `❌ Not enough gold.\nPrice: ${price.toLocaleString()}`
      })
    }

    player.gold -= price
    inventory.addItem(sender, item, 1)

    sock.sendMessage(sender, {
      text: `✅ Purchase successful!\nYou bought ${item}`
    })
  })
}
