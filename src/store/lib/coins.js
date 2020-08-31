
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function valueDelivered(round) {
  var delivered = 0;
  var customer = round.roles[round.roles.length - 1]
  for (var i = 0; i < customer.coins.length; i++) {
    delivered = delivered + parseInt(customer.coins[i].value)
  }
  return delivered
}

function moveCoinsIfAllPlayed(roles) {
  var i, j
  for (i = 0; i < roles.length - 1; i++) {
    var allPlayed = true
    for (j = 0; j < roles[i].coins.length; j++) {
      var coin = roles[i].coins[j]
      if (!coin.played) {
        allPlayed = false
      }
    }
    if (allPlayed) {
      for (j = 0; j < roles[i].coins.length; j++) {
        roles[i].coins[j].played = false
        roles[i + 1].coins.push(roles[i].coins[j])
      }
      roles[i].coins = []
    }
  }
  return roles
}

function moveCoinsIfPlayed(roles) {
  for (var i = 0; i < roles.length - 1; i++) {
    var coins = []
    for (var j = 0; j < roles[i].coins.length; j++) {
      var coin = roles[i].coins[j]
      if (coin.played) {
        coin.played = false
        roles[i + 1].coins.push(coin)
      } else {
        coins.push(coin)
      }
    }
    roles[i].coins = coins
  }
  return roles
}

module.exports = {

  getCoins: function(round, denominations) {
    var coins = [];
    for (var denomination in denominations) {
      for (var i = 0; i < denominations[denomination]; i++) {
        coins.push({ value: denomination, played: false });
      }
    }
    if (round == "Value First") {
      coins = coins.sort(function(a, b) {
        return parseInt(b.value) - parseInt(a.value);
      });
    } else {
      coins = shuffleArray(coins);
    }
    return coins;
  },

  moveCoins: function(round) {
    if (round.name == 'Batch') {
      round.roles = moveCoinsIfAllPlayed(round.roles)
    } else {
      round.roles = moveCoinsIfPlayed(round.roles)
    }
    round.delivered = valueDelivered(round)
    return round
  }
}
