const db = require("../system/database")

module.exports = async (sock, msg) => {

 const sender = msg.key.remoteJid

 const players = db.read("./data/players.json")

 if (players[sender]) {

  sock.sendMessage(sender, { text: "You are already registered." })
  return

 }

 players[sender] = {
  id: sender,
  gold: 1000,
  dragons: [],
  rareDragons: [],
  titans: [],
  eyes: [],
  guild: null,
  inventory: {}
 }

 db.write("./data/players.json", players)

 sock.sendMessage(sender, { text: "🐉 Registration complete.\nYou are now a Dragon Tamer." })

}
