const db = require("./database")

function updateQuest(player, task) {
  if (!player.quests) return []
  const completed = []
  player.quests.forEach(q => {
    if (q.task === task && !q.complete) {
      q.progress++
      if (q.progress >= q.goal) {
        q.complete = true
        completed.push(q.id)
      }
    }
  })
  return completed
}

module.exports = {
  updateQuest
}
