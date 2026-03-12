const db = require("./database")
const { battle } = require("./battleEngine")
const { getPlayerBuffs } = require("./instability")
const { STARTER_DRAGON } = require("./constants")

module.exports = {
  spawnTitan: (name) => {
    const titans = db.read("./data/titans.json")
    const world = db.read("./data/world.json")

    // Pick titan by name or first in list
    const titan = name ? titans.find(t => t.name.toLowerCase() === name.toLowerCase()) : titans[0]

    if (!titan) return null

    world.activeTitans = [ { ...titan } ]
    db.write("./data/world.json", world)

    return titan
  },

  fightTitan: (player, titan) => {
    const options = getPlayerBuffs(player, titan)
    const attacker = player.dragons[0] || STARTER_DRAGON

    const result = battle(
      attacker,
      { ...titan, eye: titan.linkedEye },
      options
    )

    return result
  }
}
