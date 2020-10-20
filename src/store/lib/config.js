
module.exports = {

  getTimeLimit: function(gameState, round) {
    const scope = gameState.clickOnCoins ? 'click' : 'demo'
    return gameState.rounds[round].name == 'Value First'
      ? gameState.valueTimeLimit[scope]
      : gameState.timeLimit[scope]
  }
}