const db = require("../system/database")

module.exports = async (sock, msg, args) => {
  const sender = msg.key.remoteJid
  await db.update("./data/players.json", async (players) => {
    const player = players[sender]
    if (!player) return sock.sendMessage(sender, { text: "Register first using =register" })

    const breeds = db.read("./data/breeding.json")

    if (args.length < 2) return sock.sendMessage(sender, { text: "Usage: =breed 1 2" })

    const d1 = player.dragons[parseInt(args[0]) - 1]
    const d2 = player.dragons[parseInt(args[1]) - 1]
    if (!d1 || !d2) return sock.sendMessage(sender, { text: "Invalid dragons" })

    const key = `${d1.element}_${d2.element}`
    const result = breeds[key] || breeds[`${d2.element}_${d1.element}`]

    if (!result) return sock.sendMessage(sender, { text: "Breeding failed (No compatible combination)" })

    const { addItem } = require("../system/inventory")
    addItem(sender, "dragon_egg", 1)

    sock.sendMessage(sender, { text: `Successfully bred ${d1.name} and ${d2.name}!\n🥚 You received a new egg!` })
  })
}
