const db = require("./database")

function unlock(player, achievementID) {
  if (!player.achievements) {
    player.achievements = []
  }
  const achievements = db.read("./data/achievements.json")
  const ach = achievements.find(a => a.id === achievementID)
  if (ach && !player.achievements.includes(ach.name)) {
    player.achievements.push(ach.name)
    return ach.name
  }
  return null
}

module.exports = {
  unlock
}
