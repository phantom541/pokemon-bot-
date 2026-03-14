const db = require("./database")
const { battle } = require("./battleEngine")
const { getPlayerBuffs } = require("./instability")
const { STARTER_DRAGON } = require("./constants")

module.exports = {
  spawnEvents: () => {
    const world = db.read("./data/world.json")
    const now = Date.now()

    const guardianCooldown = 6 * 60 * 60 * 1000
    const beastCooldown = 12 * 60 * 60 * 1000

    if (now - (world.lastGuardianSpawn || 0) > guardianCooldown) {
      const guardians = db.read("./data/guardians.json")
      const g = guardians[Math.floor(Math.random() * guardians.length)]
      world.guardian = g
      world.lastGuardianSpawn = now
    }

    if (now - (world.lastBeastSpawn || 0) > beastCooldown) {
      const beasts = db.read("./data/beasts.json")
      const b = beasts[Math.floor(Math.random() * beasts.length)]
      world.colossal = b
      world.lastBeastSpawn = now
    }

    db.write("./data/world.json", world)
    return world
  },

  spawnTitan: (name) => {
    const titans = db.read("./data/titans.json")
    const world = db.read("./data/world.json")
    const titan = name ? titans.find(t => t.name.toLowerCase() === name.toLowerCase()) : titans[Math.floor(Math.random() * titans.length)]
    if (!titan) return null
    world.activeTitans = [{
      ...titan
    }]
    db.write("./data/world.json", world)
    return titan
  },

  fightTitan: (player, titan) => {
    const options = getPlayerBuffs(player, titan)
    const attacker = player.dragons[player.team ? player.team[0] : 0] || player.dragons[0] || STARTER_DRAGON
    const result = battle(
      attacker, {
        ...titan,
        eye: titan.linkedEye
      },
      options
    )
    return result
  }
}
