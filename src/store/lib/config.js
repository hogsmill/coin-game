
module.exports = {

  getTimeLimit: function(gameState, round) {
    const scope = gameState.config.clickOnCoins ? 'click' : 'demo'
    return gameState.rounds[round].name == 'Value First'
      ? gameState.config.valueTimeLimit[scope]
      : gameState.config.timeLimit[scope]
  },

  setConfig: function(res, field, value) {
    if (field.match(/\./)) {
      const fields = field.split('.')
      res.config[fields[0]][fields[1]] = value
    } else {
      res.config[field] = value
    }
    return res
  }
}
