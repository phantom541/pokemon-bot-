const db = require("./database")

function calculateDamage(attacker, defender, isAttackerPlayer = false, options = {}) {
  let damage = attacker.attack - defender.defense / 2
  if (damage < 0) damage = 5 // minimum damage

  // Elemental advantage
  const ELEMENTS = {
    fire: { strong: "ice", weak: "water" },
    water: { strong: "fire", weak: "storm" },
    ice: { strong: "storm", weak: "fire" },
    storm: { strong: "water", weak: "earth" },
    earth: { strong: "storm", weak: "ice" },
    smoke: { strong: "spirit", weak: "storm" },
    spirit: { strong: "smoke", weak: "fire" },
  }

  if (ELEMENTS[attacker.element]?.strong === defender.element) damage *= 1.2
  if (ELEMENTS[attacker.element]?.weak === defender.element) damage *= 0.8

  if (isAttackerPlayer) {
    // Eye boost
    if (options.eyeMatch) damage *= 1.3

    // Guild modifier
    if (options.guildBoost) damage *= options.guildBoost
  }

  return Math.floor(damage)
}

// Battle function now passes options
function battle(attacker, defender, options = {}) {
  let attackerHP = attacker.hp
  let defenderHP = defender.hp
  let turn = 0
  const log = []

  while (attackerHP > 0 && defenderHP > 0) {
    if (turn % 2 === 0) {
      // Player (attacker) hits enemy (defender)
      const dmg = calculateDamage(attacker, defender, true, options)
      defenderHP -= dmg
      log.push(`${attacker.name} hits ${defender.name} for ${dmg} damage. (${Math.max(defenderHP,0)} HP left)`)
    } else {
      // Enemy (defender) hits player (attacker)
      const dmg = calculateDamage(defender, attacker, false, options)
      attackerHP -= dmg
      log.push(`${defender.name} hits ${attacker.name} for ${dmg} damage. (${Math.max(attackerHP,0)} HP left)`)
    }
    turn++
    if (turn > 50) break
  }

  const winner = attackerHP > 0 ? attacker.name : defender.name
  return { log, winner }
}

module.exports = { battle, calculateDamage }
