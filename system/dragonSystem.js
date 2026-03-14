const db = require("./database")

function getRandomDragon() {
  const dragons = db.read("./data/dragons.json")
  const keys = Object.keys(dragons)
  const random = keys[Math.floor(Math.random() * keys.length)]
  return {
    id: random,
    ...dragons[random]
  }
}

function createPlayerDragon(dragon) {
  return {
    id: dragon.id,
    name: dragon.name,
    element: dragon.element,
    rarity: dragon.rarity,
    level: 1,
    xp: 0,
    hp: dragon.baseHP,
    attack: dragon.baseAttack,
    moves: dragon.moves || [],
    cooldowns: {}
  }
}

function addXP(dragon, amount) {
  dragon.xp += amount
  const xpNeeded = dragon.level * 100
  if (dragon.xp >= xpNeeded) {
    dragon.level += 1
    dragon.xp = 0
    // stat growth
    dragon.hp += 20
    dragon.attack += 5
    return true
  }
  return false
}

function checkEvolution(dragon) {
  const evolutions = db.read("./data/evolutions.json")
  const evo = evolutions[dragon.id]
  if (!evo) return dragon
  if (dragon.level >= evo.level) {
    const dragons = db.read("./data/dragons.json")
    const newForm = dragons[evo.evolvesTo]
    if (newForm) {
      dragon.id = evo.evolvesTo
      dragon.name = newForm.name
      dragon.hp += 50 // Evo bonus
      dragon.attack += 15 // Evo bonus
    }
  }
  return dragon
}

function checkSkills(dragon) {
  const skills = db.read("./data/skills.json")
  const tree = skills[dragon.id]
  if (!tree) return dragon
  if (!dragon.skills) dragon.skills = []
  tree.forEach(s => {
    if (dragon.level >= s.level) {
      const already = dragon.skills.find(x => x.skill === s.skill)
      if (!already) {
        dragon.skills.push(s)
      }
    }
  })
  return dragon
}

module.exports = {
  getRandomDragon,
  createPlayerDragon,
  addXP,
  checkEvolution,
  checkSkills
}
