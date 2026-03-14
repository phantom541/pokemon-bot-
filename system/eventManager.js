const db = require("./database")

function startEvent() {
  const events = db.read("./data/events.json")
  const e = events[Math.floor(Math.random() * events.length)]
  const world = db.read("./data/world.json")
  world.event = {
    name: e.name,
    started: Date.now(),
    duration: e.duration,
    bonus: e.bonus,
    boss: e.boss
  }
  db.write("./data/world.json", world)
  return e
}

module.exports = {
  startEvent
}
