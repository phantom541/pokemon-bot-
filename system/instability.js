const db = require("./database")

module.exports = {
  calculateStability: (guildName) => {
    const guilds = db.read("./data/guilds.json")
    const guild = guilds[guildName]
    if (!guild) return 100
    const eyesOwned = guild.eyes.length
    const stability = Math.max(100 - eyesOwned * 15, 0)
    return stability
  },
  checkGuildChaos: (guildName) => {
    const stability = module.exports.calculateStability(guildName)
    if (stability < 40) {
      return "⚠ The Eyes are unstable! Chaos may occur."
    }
    return null
  },
  getPlayerBuffs: (player, titan = null) => {
    const guilds = db.read("./data/guilds.json")
    let guildBoost = 1
    if (player.guild && guilds[player.guild]) {
      // Each Eye in guild gives +5% attack boost
      guildBoost += guilds[player.guild].eyes.length * 0.05
    }

    // Player Eye boost: simplified if any eye owned, or matched with titan
    let eyeMatch = player.eyes.length > 0
    if (titan && titan.linkedEye) {
      eyeMatch = player.eyes.includes(titan.linkedEye)
    }

    return { eyeMatch, guildBoost }
  }
}
