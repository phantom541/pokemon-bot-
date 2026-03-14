const register = require("../commands/register")
const profile = require("../commands/profile")
const guild = require("../commands/guild")
const dungeon = require("../commands/dungeon")
const titan = require("../commands/titan")
const battle = require("../commands/battle")
const explore = require("../commands/explore")
const inventory = require("../commands/inventory")
const mart = require("../commands/mart")
const buy = require("../commands/buy")
const hatch = require("../commands/hatch")
const dragons = require("../commands/dragons")
const dragonFight = require("../commands/dragonFight")
const dragonMoves = require("../commands/dragonmoves")
const team = require("../commands/team")
const setteam = require("../commands/setteam")
const sell = require("../commands/sell")
const pvp = require("../commands/pvp")
const hunt = require("../commands/hunt")
const capture = require("../commands/capture")
const raid = require("../commands/raid")
const market = require("../commands/market")
const buyplayer = require("../commands/buyplayer")
const title = require("../commands/title")
const quests = require("../commands/quests")
const breed = require("../commands/breed")

const { checkCooldown } = require("./cooldown")

const prefix = "="

module.exports = async (sock, msg, text) => {
  if (!text.startsWith(prefix)) return

  const sender = msg.key.remoteJid
  const globalWait = checkCooldown(sender, "global", 2000)
  if (globalWait > 0) return

  const args = text.slice(prefix.length).trim().split(" ")
  const command = args.shift().toLowerCase()

  switch (command) {
    case "register": register(sock, msg); break
    case "profile": profile(sock, msg); break
    case "guild": guild(sock, msg, args); break
    case "dungeon": dungeon(sock, msg, args); break
    case "titan": titan(sock, msg, args); break
    case "battle": battle(sock, msg); break
    case "explore": explore(sock, msg); break
    case "inventory": inventory(sock, msg); break
    case "mart": mart(sock, msg, args); break
    case "buy": buy(sock, msg, args); break
    case "hatch": hatch(sock, msg); break
    case "dragons": dragons(sock, msg); break
    case "dragonfight": dragonFight(sock, msg, args); break
    case "dragonmoves": dragonMoves(sock, msg, args); break
    case "team": team(sock, msg, args); break
    case "setteam": setteam(sock, msg, args); break
    case "sell": sell(sock, msg, args); break
    case "pvp": pvp(sock, msg, args); break
    case "hunt": hunt(sock, msg); break
    case "capture": capture(sock, msg); break
    case "raid": raid(sock, msg); break
    case "market": market(sock, msg, args); break
    case "buyplayer": buyplayer(sock, msg, args); break
    case "title": title(sock, msg, args); break
    case "quests": quests(sock, msg); break
    case "breed": breed(sock, msg, args); break
  }
}
