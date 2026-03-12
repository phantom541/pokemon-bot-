const cooldowns = {}

function checkCooldown(user, command, duration) {

 const now = Date.now()

 if (!cooldowns[user]) cooldowns[user] = {}

 const userCooldowns = cooldowns[user]

 if (!userCooldowns[command]) {
  userCooldowns[command] = now
  return 0
 }

 const expiration = userCooldowns[command] + duration

 if (now < expiration) {
  return Math.ceil((expiration - now) / 1000)
 }

 userCooldowns[command] = now
 return 0
}

module.exports = { checkCooldown }
