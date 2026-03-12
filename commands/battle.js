const db = require("../system/database")
const { battle } = require("../system/battleEngine")
const { getPlayerBuffs } = require("../system/instability")

module.exports = async (sock, msg, args) => {
  const sender = msg.key.remoteJid
  const players = db.read("./data/players.json")
  const world = db.read("./data/world.json")

  const player = players[sender]
  if (!player) return sock.sendMessage(sender, { text: "Register first with =register" })

  // Pick a titan from world.activeTitans for now
  const titan = world.activeTitans?.[0]
  if (!titan) return sock.sendMessage(sender, { text: "No titans are active right now." })

  // Temporary attacker: pick first dragon, or create basic stats
  const attacker = player.dragons[0] || {
    name: "Starter Dragon",
    attack: 50,
    defense: 20,
    hp: 200,
    element: "fire",
    linkedEye: null,
    eye: null
  }

  const defender = {
    name: titan.name,
    attack: titan.attack || 60,
    defense: titan.defense || 30,
    hp: titan.hp || 300,
    element: titan.element || "fire",
    linkedEye: titan.linkedEye,
    eye: null
  }

  const options = getPlayerBuffs(player, defender)
  const result = battle(attacker, defender, options)

  sock.sendMessage(sender, { text: `⚔ Battle Result vs ${titan.name}:\n\n${result.log.join("\n")}\n\nWinner: ${result.winner}` })
}
