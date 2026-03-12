const db = require("../system/database")
const inventory = require("../system/inventory")

module.exports = async (sock, msg, args) => {

 const item = args[0]

 if (!item) {
  return sock.sendMessage(msg.key.remoteJid,{
   text:"Usage: =buy item_name"
  })
 }

 const mart = db.read("./data/mart.json")
 const players = db.read("./data/players.json")

 const sender = msg.key.remoteJid
 const player = players[sender]

 if (!player) {
  return sock.sendMessage(sender,{
   text:"Register first using =register"
  })
 }

 let price = null

 for (const page in mart) {
  if (mart[page][item]) {
   price = mart[page][item]
   break
  }
 }

 if (!price) {
  return sock.sendMessage(sender,{
   text:"Item not found in mart."
  })
 }

 if (player.gold < price) {
  return sock.sendMessage(sender,{
   text:`❌ Not enough gold.\nPrice: ${price.toLocaleString()}`
  })
 }

 player.gold -= price

 inventory.addItem(sender,item,1)

 db.write("./data/players.json",players)

 sock.sendMessage(sender,{
  text:`✅ Purchase successful!\nYou bought ${item}`
 })

}
