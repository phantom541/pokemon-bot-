const db = require("./database")

function getRandomDragon() {

 const dragons = db.read("./data/dragons.json")

 const keys = Object.keys(dragons)

 const random = keys[Math.floor(Math.random()*keys.length)]

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
  attack: dragon.baseAttack
 }

}

module.exports = {
 getRandomDragon,
 createPlayerDragon
}
