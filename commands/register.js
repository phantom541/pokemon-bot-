const db = require("../system/database")

module.exports = async (sock, msg) => {
  const sender = msg.key.remoteJid
  await db.update("./data/players.json", async (players) => {
    if (players[sender]) {
      return sock.sendMessage(sender, { text: "You are already registered." })
    }

    players[sender] = {
      id: sender,
      gold: 1000,
      dragons: [],
      team: [],
      inventory: {},
      achievements: [],
      quests: [],
      title: null,
      guild: null,
      stats: {
        battles: 0,
        wins: 0,
        explores: 0
      }
    }
    sock.sendMessage(sender, { text: "🐉 Registration complete.\nYou are now a Dragon Tamer." })
  })
}
