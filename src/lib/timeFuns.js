
const TimeFuns = {

  outOfTime: function(round, gameState) {
    const scope = gameState.clickOnCoins ? 'click' : 'demo'
    const timeLimit = round.name == 'Value First' ? gameState.valueTimeLimit[scope] : gameState.timeLimit[scope]
    return round.time >= timeLimit
  },
}

export default TimeFuns
