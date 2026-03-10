const db = require("./database")
const { battle } = require("./battleEngine")
const { getPlayerBuffs } = require("./instability")

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

    const result = battle(
      player.dragons[0] || { name: "Starter Dragon", attack: 50, defense: 20, hp: 200, element: "fire", linkedEye: null, eye: null },
      { ...titan, eye: titan.linkedEye },
      options
    )

    return result
  }
}
