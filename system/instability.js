const db = require("./database")

function calculateStability(guild) {
 const eyes = guild.eyes ? guild.eyes.length : 0
 const base = 100
 const loss = eyes * 15
 return Math.max(base - loss, 0)
}

function checkInstability(guild) {
 const stability = calculateStability(guild)
 if (stability >= 70) return null
 if (stability >= 40) return "⚠ The Eyes vibrate with unstable energy."
 if (stability >= 10) return "🌩 The Eyes clash violently. Something stirs in the world."
 return "💀 The relics destabilize reality itself."
}

module.exports = {
 calculateStability,
 checkInstability,
 getPlayerBuffs: (player, titan = null) => {
    const guilds = db.read("./data/guilds.json")
    let guildBoost = 1
    let guildEyes = []

    if (player.guild && guilds[player.guild]) {
      guildEyes = guilds[player.guild].eyes || []
      // Each Eye in guild gives +5% attack boost
      guildBoost += guildEyes.length * 0.05
    }

    // Player Eye boost: match if titan's eye is in player's eyes OR guild's eyes
    const allOwnedEyes = [...(player.eyes || []), ...guildEyes]
    let eyeMatch = allOwnedEyes.length > 0
    if (titan && titan.linkedEye) {
      eyeMatch = allOwnedEyes.includes(titan.linkedEye)
    }

    return { eyeMatch, guildBoost }
  }
}
