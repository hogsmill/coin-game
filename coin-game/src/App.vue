<template>
  <div id="app">
    <appHeader></appHeader>
    <div v-if="showAbout">
      <AboutView />
    </div>
    <div v-else>
      <h1>The Coin Game</h1>
      <app-denominations></app-denominations>
      <app-roles></app-roles>
      <app-control></app-control>
      <ResultsView v-bind:gameState="gameState" />
    </div>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Denominations from "./components/game-config/Denominations.vue";
import Roles from "./components/game-config/Roles.vue";
import Control from "./components/game-config/Control.vue";
import AboutView from "./components/about/AboutView.vue";
import ResultsView from "./components/results/ResultsView.vue";

export default {
  name: "App",
  components: {
    appHeader: Header,
    appDenominations: Denominations,
    appRoles: Roles,
    appControl: Control,
    AboutView,
    ResultsView,
  },
  computed: {
    showAbout() {
      return this.$store.getters.getShowAbout;
    },
    stateSet() {
      return this.$store.getters.getStateSet;
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
      var round = this.state["rounds"][roundNum];
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
        i < this.state["rounds"][round]["roles"].length - 1;
        i++
      ) {
        var roles = this.state["rounds"][round]["roles"];
        var role = roles[i];
        console.log("role", role["name"]);
        for (var j = 0; j < role["coins"].length; j++) {
          var coin = role["coins"][j];
          if (coin["played"]) {
            coin["played"] = false;
            roles[i + 1]["coins"].push(coin);
            role["coins"].splice(j, 1);
            this.deliverCoin(coin, roles[i + 1], this.state["rounds"][round]);
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
      var roles = this.state["rounds"][round]["roles"];
      var played;
      for (var i = 0; i < roles.length; i++) {
        if (!played) {
          this.playCoin(roles[i]["coins"]);
        }
      }
    },
    incrementTime(round) {
      this.state["rounds"][round]["time"] =
        this.state["rounds"][round]["time"] + parseInt(this.interval);
      return this.state["rounds"][round]["time"];
    },
    complete(round) {
      var limit =
        this.state["rounds"][round]["name"] == "Value First"
          ? this.state["valueTimeLimit"]
          : this.state["timeLimit"];
      return (
        this.state["rounds"][round]["time"] >= parseInt(limit) ||
        this.state["rounds"][round]["delivered"] == this.state["total"]
      );
    },
    run() {
      var round = this.state["round"];
      this.playRoleCoins(round);
      console.log("round", this.state["rounds"][round]);
      if (this.state["rounds"][round]["name"] == "Batch") {
        this.moveCoins(round);
      } else {
        this.moveCoin(round);
      }
      this.incrementTime(this.state["round"]);
      if (!this.complete(this.state["round"]) && !this.stopped) {
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
        coins = coins.sort(function (a, b) {
          return parseInt(b["value"]) - parseInt(a["value"]);
        });
      } else {
        coins = this.shuffleArray(coins);
      }
      return coins;
    },
    start() {
      this.stopped = false;
    },
    stop() {
      this.stopped = true;
    },
    go(round) {
      this.stateSet = true;
      this.state["round"] = round;
      var roles = [];
      for (var i = 0; i < this.state["roles"].length; i++) {
        if (this.state["roles"][i]["include"]) {
          var role = JSON.parse(JSON.stringify(this.state["roles"][i]));
          if (i == 0) {
            role["coins"] = this.getCoins(this.state["rounds"][round]["name"]);
          } else {
            role["coins"] = [];
          }
          roles.push(role);
        }
      }
      this.state["rounds"][round]["roles"] = roles;
      console.log(this.state);
      this.run();
    },
  },
};
</script>

<style>
.menu {
  text-align: right;
  background-color: #ccc;
  padding: 6px;
}
.menu span {
  margin: 0 4px 0 4px;
}
.menu span:hover {
  text-decoration: underline;
}
.selected {
  text-decoration: underline;
  font-weight: bold;
}

.denominations {
  width: 20%;
  text-align: left;
  margin: 0 auto;
  display: inline-block;
  vertical-align: top;
}
.denominations div {
  vertical-align: middle;
}
label {
  width: 30px;
  margin: 2px;
  display: inline-block;
  text-align: right;
}
input {
  width: 40px;
  padding: 2px;
  margin-bottom: 2px;
}
.distribution {
  height: 20px;
  width: 300px;
  margin: 2px 0 0 6px;
  background-color: green;
  display: inline-block;
}

.roles {
  width: 40%;
  display: inline-block;
  vertical-align: top;
}
.role {
  width: 100%;
  text-align: left;
}
.role .rolename {
  width: 120px;
}

.run {
  width: 20%;
  display: inline-block;
  padding-left: 40px;
}
.run div {
  text-align: left;
}
.run label {
  width: 80%;
  text-align: left;
}
.run button {
  margin: 0 auto 6px auto;
  display: block;
  width: 130px;
}
.running {
  width: 100%;
}
.running button {
  display: inline-block;
  margin: 6px;
}
</style>
