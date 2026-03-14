const { ELEMENTS } = require("./constants")
const db = require("./database")

function useMove(dragon, moveID) {
  const moves = db.read("./data/moves.json")
  const move = moves[moveID]
  if (!move) return null
  const damage = Math.floor(dragon.attack * move.damage)
  return {
    name: move.name,
    damage
  }
}

function calculateDamage(attacker, defender, isAttackerPlayer = false, options = {}) {
  let damage = attacker.attack - (defender.defense || 0) / 2
  if (damage < 0) damage = 5 // minimum damage

  // Elemental advantage
  const attackerElement = ELEMENTS[attacker.element]
  if (attackerElement) {
    if (attackerElement.strong.includes(defender.element)) {
      damage *= 1.3
    } else if (attackerElement.weak.includes(defender.element)) {
      damage *= 0.7
    }
  }

  if (isAttackerPlayer) {
    // Eye boost
    if (options.eyeMatch) damage *= 1.3
    // Guild modifier
    if (options.guildBoost) damage *= options.guildBoost
  }

  return Math.floor(damage)
}

function battle(attacker, defender, options = {}) {
  let attackerHP = attacker.hp
  let defenderHP = defender.hp
  let turn = 0
  const log = []

  while (attackerHP > 0 && defenderHP > 0) {
    if (turn % 2 === 0) {
      // Attacker turn
      let dmg
      let moveName = "basic attack"
      if (attacker.moves && attacker.moves.length > 0) {
        const moveID = attacker.moves[Math.floor(Math.random() * attacker.moves.length)]
        const moveResult = useMove(attacker, moveID)
        if (moveResult) {
          dmg = moveResult.damage
          moveName = moveResult.name
        } else {
          dmg = calculateDamage(attacker, defender, true, options)
        }
      } else {
        dmg = calculateDamage(attacker, defender, true, options)
      }

      defenderHP -= dmg
      log.push(`${attacker.name} used ${moveName} on ${defender.name} for ${dmg} damage. (${Math.max(defenderHP, 0)} HP left)`)
    } else {
      // Defender turn
      const dmg = calculateDamage(defender, attacker, false, options)
      attackerHP -= dmg
      log.push(`${defender.name} hits ${attacker.name} for ${dmg} damage. (${Math.max(attackerHP, 0)} HP left)`)
    }
    turn++
    if (turn > 50) break
  }

  const winner = attackerHP > 0 ? attacker.name : defender.name
  return {
    log,
    winner,
    winnerHP: Math.max(attackerHP, defenderHP)
  }
}

module.exports = {
  battle,
  calculateDamage,
  useMove
}
