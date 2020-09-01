<template>

  <div class="col-md-12 mb-3">
    <button id="batch-button" class="btn btn-site-primary mb-2" @click="go(0)">Run Batch</button>
    <button id="kanban-button" class="btn btn-site-primary mb-2" @click="go(1)">Run Kanban</button>
    <button id="value-delivery-button" class="btn btn-site-primary mb-2" @click="go(2)">Run Value Delivery</button>
  </div>

</template>

<script>
export default {
  props: [
    'socket'
  ],
  methods: {
    //allPlayed(coins) {
    //  var played = true;
    //  for (var i = 0; i < coins.length; i++) {
    //    if (!coins[i].played) {
    //      played = false;
    //    }
    //  }
    //  return played;
    //},
    //setCoin(coin, i, roles) {
    //  if (i < roles.length - 2) {
    //    coin.played = false;
    //  }
    //  return coin;
    //},
    //deliverCoin(coin, role, round) {
    //  var l = round.roles.length;
    //  if (role.role == round.roles[l - 1].role) {
    //    round.delivered = round.delivered + parseInt(coin.value);
    //  }
    //},
    moveCoins(roundNum) {
      var i, j, coin;
      var round = this.gameState.rounds[roundNum];
      for (i = 0; i < round.roles.length - 1; i++) {
        if (
          round.roles[i].coins.length &&
          this.allPlayed(round.roles[i].coins)
        ) {
          for (j = 0; j < round.roles[i].coins.length; j++) {
            coin = round.roles[i].coins[j];
            coin.played = false;
            round.roles[i + 1].coins.push(coin);
            this.deliverCoin(coin, round.roles[i + 1], round);
          }
          round.roles[i].coins = [];
        }
      }
    },
    moveCoin(round) {
      for (var i = 0; i < this.gameState.rounds[round].roles.length - 1; i++) {
        var roles = this.gameState.rounds[round].roles
        var role = roles[i];
        for (var j = 0; j < role.coins.length; j++) {
          var coin = role.coins[j];
          if (coin.played) {
            coin.played = false;
            roles[i + 1].coins.push(coin);
            role.coins.splice(j, 1);
            this.deliverCoin(
              coin,
              roles[i + 1],
              this.gameState.rounds[round]
            );
          }
        }
      }
    },
    //playACoin(coin, role, round) {
    //  var i, roundN, roleN
    //  for (i = 0; i < this.gameState.rounds.length; i++) {
    //    if (this.gameState.rounds[i].name == round.name) {
    //      roundN = i
    //    }
    //  }
    //  if (this.complete(roundN)) {
    //    alert("Times Up!")
    //  } else {
    //    for (i = 0; i < this.gameState.rounds[roundN].roles.length; i++) {
    //      if (this.gameState.rounds[roundN].roles[i].role == role.role) {
    //        roleN = i
    //      }
    //    }
    //    this.gameState.rounds[roundN].roles[roleN].coins[coin].played = true
    //    this.$store.dispatch("updateGameState", this.gameState);
    //    if (round.name == "Batch") {
    //      this.moveCoins(roundN);
    //    } else {
    //      this.moveCoin(roundN);
    //    }
    //  }
    //},
    //playCoin(coins) {
    //  var i = 0;
    //  var played = false;
    //  while (i < coins.length && !played) {
    //    if (!coins[i].played) {
    //      coins[i].played = true;
    //      played = true;
    //    }
    //    i++;
    //  }
    //},
    //playRoleCoins(round) {
    //  var roles = this.gameState.rounds[round].roles;
    //  var played;
    //  for (var i = 0; i < roles.length; i++) {
    //    if (!played) {
    //      this.playCoin(roles[i].coins);
    //    }
    //  }
    //},
    //incrementTime(round) {
    //  this.gameState.rounds[round].time =
    //    this.gameState.rounds[round].time + parseInt(this.interval)
    //    console.log('here', round, this.gameState.rounds[round].time)
    //
    //  return this.gameState.rounds[round].time
    //},
    //complete(round) {
    //  var scope = this.gameState.clickOnCoins ? 'click' : 'demo'
    //  var limit =
    //    this.gameState.rounds[round].name == "Value First"
    //      ? this.gameState.valueTimeLimit[scope]
    //      : this.gameState.timeLimit[scope]
    //  return (
    //    this.gameState.rounds[round].time >= parseInt(limit) ||
    //    this.gameState.rounds[round].delivered == this.gameState.total
    //  )
    //},
    //run() {
    //  var round = this.gameState.round
    //  if (!this.gameState["clickOnCoins"]) {
    //    this.playRoleCoins(round)
    //    if (this.gameState.rounds[round].name == "Batch") {
    //      this.moveCoins(round);
    //    } else {
    //      this.moveCoin(round);
    //    }
    //  }
      //this.incrementTime(this.gameState.round);
      //if (!this.complete(this.gameState.round)) {
      //  setTimeout(this.run, this.interval)
      //}
    //},
    start() {
      this.$store.dispatch("updateStopped", false);
    },
    stop() {
      this.$store.dispatch("updateStopped", true);
    },
    go(round) {
      this.socket.emit("startRound", {gameName: this.gameName, round: round});
    },
  },
  computed: {
    interval() {
      return this.$store.getters.getInterval;
    },
    stopped() {
      return this.$store.getters.getStopped;
    },
    denominations() {
      return this.$store.getters.getDenominations;
    },
    gameName() {
      return this.$store.getters.getGameName;
    },
    gameState() {
      return this.$store.getters.getGameState;
    },
  }
};
</script>
