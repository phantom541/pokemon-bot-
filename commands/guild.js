const db = require("../system/database")

module.exports = async (sock, msg, args) => {
  const sender = msg.key.remoteJid
  const players = db.read("./data/players.json")
  const guilds = db.read("./data/guilds.json")

  const player = players[sender]
  if (!player) return sock.sendMessage(sender, { text: "Register first with =register" })

  const action = args[0]?.toLowerCase()

  switch(action) {
    case "create":
      const name = args.slice(1).join(" ")
      if (!name) return sock.sendMessage(sender, { text: "Usage: =guild create GuildName" })
      if (player.guild) return sock.sendMessage(sender, { text: "You are already in a guild." })

      if (guilds[name]) return sock.sendMessage(sender, { text: "Guild already exists." })

      guilds[name] = { name, members: [sender], titans: [], eyes: [] }
      player.guild = name

      db.write("./data/players.json", players)
      db.write("./data/guilds.json", guilds)
      return sock.sendMessage(sender, { text: `Guild ${name} created!` })

    case "join":
      const joinName = args.slice(1).join(" ")
      if (!joinName) return sock.sendMessage(sender, { text: "Usage: =guild join GuildName" })
      if (player.guild) return sock.sendMessage(sender, { text: "Leave your current guild first." })
      if (!guilds[joinName]) return sock.sendMessage(sender, { text: "Guild does not exist." })

      guilds[joinName].members.push(sender)
      player.guild = joinName

      db.write("./data/players.json", players)
      db.write("./data/guilds.json", guilds)
      return sock.sendMessage(sender, { text: `Joined guild ${joinName}!` })

    case "leave":
      if (!player.guild) return sock.sendMessage(sender, { text: "You are not in a guild." })
      const gName = player.guild
      guilds[gName].members = guilds[gName].members.filter(m => m !== sender)
      player.guild = null

      db.write("./data/players.json", players)
      db.write("./data/guilds.json", guilds)
      return sock.sendMessage(sender, { text: `Left guild ${gName}` })

    default:
      sock.sendMessage(sender, { text: "Guild commands:\n=guild create Name\n=guild join Name\n=guild leave" })
  }
}
