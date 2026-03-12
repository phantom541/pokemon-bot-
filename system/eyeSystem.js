const db = require("./database")

const EYES = [
 "blazz",
 "beru",
 "sino",
 "dezer",
 "aeria",
 "vapir",
 "zite"
]

function tryEyeDrop() {

 const chance = Math.random()

 // 10% drop rate
 if (chance <= 0.10) {
  const eye = EYES[Math.floor(Math.random() * EYES.length)]
  return eye
 }

 return null
}

function giveEyeToGuild(player, eye) {

 const guilds = db.read("./data/guilds.json")

 if (!player.guild) return false

 const guild = guilds[player.guild]

 if (!guild.eyes) guild.eyes = []

 guild.eyes.push(eye)

 db.write("./data/guilds.json", guilds)

 return true
}

module.exports = {
 tryEyeDrop,
 giveEyeToGuild
}
