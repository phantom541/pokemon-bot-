const db = require("./database")
const { battle } = require("./battleEngine")
const { getPlayerBuffs } = require("./instability")
const { STARTER_DRAGON } = require("./constants")

module.exports = {
  generateDungeon: (level) => {
    // Enemy stats based on level
    const enemies = []
    let baseHP = 50, baseAtk = 20, baseDef = 10

    switch(level.toLowerCase()) {
      case "easy":
        enemies.push({ name: "Goblin", hp: baseHP, attack: baseAtk, defense: baseDef, element: "earth", linkedEye: null, eye: null })
        break
      case "medium":
        enemies.push({ name: "Orc", hp: baseHP*2, attack: baseAtk*1.5, defense: baseDef*1.2, element: "earth", linkedEye: null, eye: null })
        break
      case "hard":
        enemies.push({ name: "Dark Knight", hp: baseHP*3, attack: baseAtk*2, defense: baseDef*1.5, element: "storm", linkedEye: null, eye: null })
        break
      default:
        enemies.push({ name: "Training Dummy", hp: baseHP, attack: baseAtk, defense: baseDef, element: "earth", linkedEye: null, eye: null })
    }

    const boss = { name: `Dungeon Boss ${level}`, hp: baseHP*5, attack: baseAtk*3, defense: baseDef*2, element: "fire", linkedEye: null, eye: null }

    return {
      name: `Dungeon Level ${level}`,
      difficulty: level,
      enemies,
      boss,
      rewards: { gold: enemies.length * 50 + boss.hp / 10 }
    }
  },

  fightDungeon: (player, dungeon) => {
    const log = []
    let totalGold = 0

    const options = getPlayerBuffs(player)

    // Attacker: pick first dragon, or use starter
    const attacker = player.dragons[0] || STARTER_DRAGON

    // Fight each enemy
    for (const enemy of dungeon.enemies) {
      const result = battle(attacker, enemy, options)
      log.push(`🛡 Fought ${enemy.name}:\n${result.log.join("\n")}\nWinner: ${result.winner}\n`)
      if (result.winner === attacker.name) totalGold += dungeon.rewards.gold / 2
    }

    // Fight boss
    const bossResult = battle(attacker, dungeon.boss, options)
    log.push(`👑 Boss Fight: ${dungeon.boss.name}\n${bossResult.log.join("\n")}\nWinner: ${bossResult.winner}\n`)
    if (bossResult.winner === attacker.name) totalGold += dungeon.rewards.gold / 2

    return { log, totalGold }
  }
}
