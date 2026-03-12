const db = require("./database")

function addItem(playerId, item, amount = 1) {

 const players = db.read("./data/players.json")

 const player = players[playerId]

 if (!player.inventory) player.inventory = {}

 if (!player.inventory[item]) player.inventory[item] = 0

 player.inventory[item] += amount

 db.write("./data/players.json", players)

}

function removeItem(playerId, item, amount = 1) {

 const players = db.read("./data/players.json")

 const player = players[playerId]

 if (!player.inventory || !player.inventory[item]) return false

 if (player.inventory[item] < amount) return false

 player.inventory[item] -= amount

 if (player.inventory[item] <= 0) delete player.inventory[item]

 db.write("./data/players.json", players)

 return true

}

function hasItem(playerId, item, amount = 1) {

 const players = db.read("./data/players.json")

 const player = players[playerId]

 if (!player.inventory || !player.inventory[item]) return false

 return player.inventory[item] >= amount

}

module.exports = {
 addItem,
 removeItem,
 hasItem
}
