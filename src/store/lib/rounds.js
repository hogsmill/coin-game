
module.exports = {

  getRoundNFromName: function(name, rounds) {
    for (var i = 0; i < rounds.length; i++) {
      if (rounds[i].name == name) {
        return i
      }
    }
  },

  resetRounds: function(gameState) {
    for (var i = 0; i < gameState.rounds.length; i++) {
      gameState.rounds[i].running = false
      gameState.rounds[i].time = 0
      for (var j = 0; j < gameState.rounds[i].roles.length; j++) {
        gameState.rounds[i].roles[j].coins = []
      }
    }
    return gameState
  }
}
