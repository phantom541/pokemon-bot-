const db = require("./database")

function getRandomEnemy() {

 const enemies = db.read("./data/enemies.json")

 const keys = Object.keys(enemies)

 const random = keys[Math.floor(Math.random() * keys.length)]

 return enemies[random]

}

module.exports = { getRandomEnemy }
