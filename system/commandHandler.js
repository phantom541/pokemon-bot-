const register = require("../commands/register")
const profile = require("../commands/profile")
const guild = require("../commands/guild")
const dungeon = require("../commands/dungeon")
const titan = require("../commands/titan")
const battle = require("../commands/battle")

const prefix = "="

module.exports = async (sock, msg, text) => {

 if (!text.startsWith(prefix)) return

 const args = text.slice(prefix.length).trim().split(" ")
 const command = args.shift().toLowerCase()

 switch (command) {

  case "register":
   register(sock, msg)
   break

  case "profile":
   profile(sock, msg)
   break

  case "guild":
   guild(sock, msg, args)
   break

  case "dungeon":
   dungeon(sock, msg, args)
   break

  case "titan":
   titan(sock, msg, args)
   break

  case "battle":
   battle(sock, msg, args)
   break
 }

}
