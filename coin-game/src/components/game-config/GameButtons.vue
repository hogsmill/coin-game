<template>
  <div class="col-md-12 mb-3" :class="{ running: stateSet }">
    <button
      class="btn btn-info mb-2"
      @click="go(0)"
      :disabled="gameState['running']"
    >
      Run Batch
    </button>
    <button
      class="btn btn-info mb-2"
      @click="go(1)"
      :disabled="gameState['running']"
    >
      Run Kanban
    </button>
    <button
      class="btn btn-info mb-2"
      @click="go(2)"
      :disabled="gameState['running']"
    >
      Run Value Delivery
    </button>
    <button
      class="btn btn-info mb-2"
      @click="stop()"
      v-if="stateSet && !stopped"
      :disabled="gameState['running']"
    >
      Stop
    </button>
    <button
      class="btn btn-info mb-2"
      @click="start()"
      v-if="stopped"
      :disabled="gameState['running']"
    >
      Start
    </button>
  </div>
</template>

<script>
export default {
  computed: {
    stateSet() {
      return this.$store.getters.getStateSet;
    },
    interval() {
      return this.$store.getters.getInterval;
    },
    stopped() {
      return this.$store.getters.getStopped;
    },
    denominations() {
      return this.$store.getters.getDenominations;
    },
    gameState() {
      return this.$store.getters.getGameState;
    },
  },
  methods: {
    allPlayed(coins) {
      var played = true;
      for (var i = 0; i < coins.length; i++) {
        if (!coins[i]["played"]) {
          played = false;
        }
      }
      return played;
    },
    setCoin(coin, i, roles) {
      if (i < roles.length - 2) {
        coin["played"] = false;
      }
      return coin;
    },
    deliverCoin(coin, role, round) {
      var l = round["roles"].length;
      if (role.name == round["roles"][l - 1]["name"]) {
        round["delivered"] = round["delivered"] + parseInt(coin["value"]);
      }
    },
    moveCoins(roundNum) {
      var i, j, coin;
      var round = this.gameState["rounds"][roundNum];
      for (i = 0; i < round["roles"].length - 1; i++) {
        if (
          round["roles"][i]["coins"].length &&
          this.allPlayed(round["roles"][i]["coins"])
        ) {
          for (j = 0; j < round["roles"][i]["coins"].length; j++) {
            coin = round["roles"][i]["coins"][j];
            coin.played = false;
            round["roles"][i + 1]["coins"].push(coin);
            this.deliverCoin(coin, round["roles"][i + 1], round);
          }
          round["roles"][i]["coins"] = [];
        }
      }
    },
    moveCoin(round) {
      for (
        var i = 0;
        i < this.gameState["rounds"][round]["roles"].length - 1;
        i++
      ) {
        var roles = this.gameState["rounds"][round]["roles"];
        var role = roles[i];
        console.log("role", role["name"]);
        for (var j = 0; j < role["coins"].length; j++) {
          var coin = role["coins"][j];
          if (coin["played"]) {
            coin["played"] = false;
            roles[i + 1]["coins"].push(coin);
            role["coins"].splice(j, 1);
            this.deliverCoin(
              coin,
              roles[i + 1],
              this.gameState["rounds"][round]
            );
          }
        }
      }
    },
    playCoin(coins) {
      var i = 0;
      var played = false;
      while (i < coins.length && !played) {
        if (!coins[i]["played"]) {
          coins[i]["played"] = true;
          played = true;
        }
        i++;
      }
    },
    playRoleCoins(round) {
      var roles = this.gameState["rounds"][round]["roles"];
      var played;
      for (var i = 0; i < roles.length; i++) {
        if (!played) {
          this.playCoin(roles[i]["coins"]);
        }
      }
    },
    incrementTime(round) {
      this.gameState["rounds"][round]["time"] =
        this.gameState["rounds"][round]["time"] + parseInt(this.interval);
      return this.gameState["rounds"][round]["time"];
    },
    complete(round) {
      var limit =
        this.gameState["rounds"][round]["name"] == "Value First"
          ? this.gameState["valueTimeLimit"]
          : this.gameState["timeLimit"];
      return (
        this.gameState["rounds"][round]["time"] >= parseInt(limit) ||
        this.gameState["rounds"][round]["delivered"] == this.gameState["total"]
      );
    },
    run() {
      var round = this.gameState["round"];
      this.playRoleCoins(round);
      console.log("round", this.gameState["rounds"][round]);
      if (this.gameState["rounds"][round]["name"] == "Batch") {
        this.moveCoins(round);
      } else {
        this.moveCoin(round);
      }
      this.incrementTime(this.gameState["round"]);
      if (!this.complete(this.gameState["round"]) && !this.stopped) {
        setTimeout(this.run, this.interval);
      }
    },
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    getCoins(round) {
      var coins = [];
      for (var denomination in this.denominations) {
        for (var i = 0; i < this.denominations[denomination]; i++) {
          coins.push({ value: denomination, played: false });
        }
      }
      if (round == "Value First") {
        coins = coins.sort(function(a, b) {
          return parseInt(b["value"]) - parseInt(a["value"]);
        });
      } else {
        coins = this.shuffleArray(coins);
      }
      return coins;
    },
    start() {
      this.$store.dispatch("updateStopped", false);
    },
    stop() {
      this.$store.dispatch("updateStopped", true);
    },
    go(round) {
      this.$socket.emit("click-go", {
        round: round,
        updateStateSet: true,
        updateGameStateRound: round,
      });
      this.$store.dispatch("updateStateSet", true);
      this.$store.dispatch("updateGameStateRound", round);
      var roles = [];
      for (var i = 0; i < this.gameState["roles"].length; i++) {
        if (this.gameState["roles"][i]["include"]) {
          var role = JSON.parse(JSON.stringify(this.gameState["roles"][i]));
          if (i == 0) {
            role["coins"] = this.getCoins(
              this.gameState["rounds"][round]["name"]
            );
          } else {
            role["coins"] = [];
          }
          roles.push(role);
        }
      }
      this.$store.dispatch("updateGameStateRoundsRoles", {
        round: round,
        roles: roles,
      });
      console.log(this.gameState);
      this.run();
    },
  },
  mounted() {
    console.log("inside mounted life cycle");
    this.$socket.on("click-go", (data) => {
      console.log("inside click-go emit");
      this.$store.dispatch("updateStateSet", data.updateStateSet);
      this.$store.dispatch("updateGameStateRound", data.updateGameStateRound);
    });
  },
};
</script>
