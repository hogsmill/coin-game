
const TimeFuns = {

  outOfTime: function(round, gameState) {
    const scope = gameState.config.clickOnCoins ? 'click' : 'demo'
    const timeLimit = round.name == 'Value First' ? gameState.config.valueTimeLimit[scope] : gameState.config.timeLimit[scope]
    return round.time >= timeLimit
  },
}

export default TimeFuns
