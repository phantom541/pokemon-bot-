const db = require("../system/database")

module.exports = async (sock, msg, args) => {
  const sender = msg.key.remoteJid
  const players = db.read("./data/players.json")
  const player = players[sender]
  if (!player) return sock.sendMessage(sender, { text: "Register first using =register" })

  const action = args[0]
  if (action === "create") {
    const name = args.slice(1).join(" ")
    if (!name) return sock.sendMessage(sender, { text: "Usage: =guild create GuildName" })

    await db.update("./data/guilds.json", async (guilds) => {
      if (guilds[name]) return sock.sendMessage(sender, { text: "Guild already exists." })

      await db.update("./data/players.json", async (ps) => {
        const p = ps[sender]
        if (p.guild) return sock.sendMessage(sender, { text: "You are already in a guild." })

        guilds[name] = {
          name,
          leader: sender,
          members: [sender],
          level: 1,
          vault: 0,
          eyes: []
        }
        p.guild = name
        sock.sendMessage(sender, { text: `🏰 Guild ${name} created` })
      })
    })
  } else if (action === "info") {
    if (!player.guild) return sock.sendMessage(sender, { text: "You are not in a guild" })

    const guilds = db.read("./data/guilds.json")
    const g = guilds[player.guild]
    if (!g) return sock.sendMessage(sender, { text: "Guild data not found." })

    let text = `🏰 Guild: ${g.name}\n`
    text += `Leader: @${g.leader.split("@")[0]}\n`
    text += `Members: ${g.members.length}\n`
    text += `Level: ${g.level}\n`
    text += `Vault: ${g.vault} gold\n`
    text += `Eyes: ${g.eyes.length}\n`

    sock.sendMessage(sender, { text, mentions: [g.leader] })
  } else {
    sock.sendMessage(sender, { text: "Guild commands:\n=guild create Name\n=guild info" })
  }
}
