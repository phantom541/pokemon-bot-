const db = require("../system/database")

module.exports = async (sock, msg, args) => {

 const page = args[0] || "1"

 const mart = db.read("./data/mart.json")

 const key = "page" + page

 if (!mart[key]) {
  return sock.sendMessage(msg.key.remoteJid,{
   text:"Mart page not found. Pages: 1-6"
  })
 }

 let text = `🏪 Dragon Mart — Page ${page}\n\n`

 const items = mart[key]

 for (const item in items) {

  const price = items[item].toLocaleString()

  text += `${item} — ${price} gold\n`
 }

 text += `\nUse =buy item_name`

 sock.sendMessage(msg.key.remoteJid,{ text })

}
