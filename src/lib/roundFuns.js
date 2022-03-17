
const RoundFuns = {

  allDelivered: function(round, gameState) {
    let allDelivered = false
    if (gameState.coins && round.roles.length) {
      allDelivered = round.roles[round.roles.length - 1].coins.length == gameState.coins.length
    }
    return allDelivered
  }
}

export default RoundFuns
