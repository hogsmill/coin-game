
module.exports = {

  getRoundNFromName: function(name, rounds) {
    for (let i = 0; i < rounds.length; i++) {
      if (rounds[i].name == name) {
        return i
      }
    }
  },

  resetRounds: function(gameState) {
    for (let i = 0; i < gameState.rounds.length; i++) {
      gameState.rounds[i].running = false
      for (let j = 0; j < gameState.rounds[i].roles.length; j++) {
        gameState.rounds[i].roles[j].coins = []
        gameState.rounds[i].delivered = 0
        gameState.rounds[i].time = 0
        gameState.rounds[i].running = false
      }
    }
    return gameState
  },

  running: function(round, gameState, timeLimit) {
    return gameState.coins && round.roles[round.roles.length - 1].coins.length < gameState.coins.length && round.running && round.time < timeLimit
  }
}
