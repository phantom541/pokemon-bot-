const db = require("../system/database")

module.exports = async (sock, msg) => {
  const sender = msg.key.remoteJid
  const players = db.read("./data/players.json")
  const player = players[sender]
  if (!player) return sock.sendMessage(sender, { text: "Register first using =register" })

  if (!player.guild) return sock.sendMessage(sender, { text: "Join a guild first" })

  await db.update("./data/world.json", async (w) => {
    if (!w.raid) {
      const raids = db.read("./data/raids.json")
      const boss = raids[Math.floor(Math.random() * raids.length)]
      w.raid = { boss: { ...boss }, attackers: [] }
    }

    const raid = w.raid
    const dragon = player.dragons[player.team ? player.team[0] : 0] || player.dragons[0]
    if (!dragon) return sock.sendMessage(sender, { text: "You need a dragon to raid!" })

    const damage = dragon.attack
    raid.boss.hp -= damage
    raid.attackers.push(sender)

    let text = `⚔️ Guild Raid\n\n${dragon.name} dealt ${damage} damage\nBoss HP: ${Math.max(raid.boss.hp, 0)}`

    if (raid.boss.hp <= 0) {
      text += `\n\n🏆 Titan defeated!\n`
      await db.update("./data/players.json", async (ps) => {
        const uniqueAttackers = [...new Set(raid.attackers)]
        uniqueAttackers.forEach(id => {
          if (ps[id]) ps[id].gold += 2000
        })
      })
      w.raid = null
    }
    sock.sendMessage(sender, { text })
  })
}
