<template>
  <div id="app" class="mb-4">
    <appHeader></appHeader>
    <WalkThroughView />
    <h1>The Coin Game</h1>
    <div v-if="showTab == 'about'">
      <AboutView />
    </div>
    <div v-if="showTab != 'about'">
      <div class="game-params">
        <MyName v-bind:socket="socket" />
        <GameName v-bind:socket="socket" />
      </div>
      <div class="container">
        <div v-if="showTab == 'facilitator'" :class="{'not-host' : !isHost}">
          <app-denominations v-bind:socket="socket"></app-denominations>
          <app-roles v-bind:socket="socket"></app-roles>
          <app-players v-bind:socket="socket"></app-players>
          <app-control v-bind:socket="socket"></app-control>
        </div>
        <div v-if="showTab == 'game'">
          <app-game-buttons v-bind:socket="socket"></app-game-buttons>
          <ResultsView v-bind:gameState="gameState" v-bind:socket="socket" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

import params from './lib/params.js'

import Header from "./components/Header.vue";
import MyName from "./components/MyName.vue";
import GameName from "./components/GameName.vue";
import Denominations from "./components/game-config/Denominations.vue";
import Roles from "./components/game-config/Roles.vue";
import Players from "./components/game-config/Players.vue";
import Control from "./components/game-config/Control.vue";
import GameButtons from "./components/game-config/GameButtons.vue";
import AboutView from "./components/about/AboutView.vue";
import WalkThroughView from "./components/about/WalkThroughView.vue";
import ResultsView from "./components/results/ResultsView.vue";

export default {
  name: "App",
  components: {
    appHeader: Header,
    appDenominations: Denominations,
    appRoles: Roles,
    appPlayers: Players,
    appControl: Control,
    appGameButtons: GameButtons,
    AboutView,
    WalkThroughView,
    MyName,
    GameName,
    ResultsView
  },
  computed: {
    isHost() {
      return this.$store.getters.getHost;
    },
    walkThrough() {
      return this.$store.getters.getWalkThrough;
    },
    showTab() {
      return this.$store.getters.getShowTab;
    },
    stateSet() {
      return this.$store.getters.getStateSet;
    },
    gameName() {
      return this.$store.getters.getGameName;
    },
    gameState() {
      return this.$store.getters.getGameState;
    }
  },
  created() {
    var host = "77.68.122.69"
    if (location.hostname == 'localhost') {
      host = 'localhost'
    }
    var connStr = "http://" + host + ":3000"
    console.log("Connecting to: " + connStr)
    this.socket = io(connStr)

    if (params.isParam("host")) {
      this.$store.dispatch("updateHost", true)
    }

    this.socket.on("updateGameState", (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch("updateGameState", data)
      }
    })
  }
}
</script>

<style lang="scss">
  .not-host { height: 0px; visibility: hidden; }
  #clickCoins { margin-left: -2rem; }

  .game-params {
    height: 30px;
  }

  .config {
    margin: 0 auto;
    max-width: 800px;
    .control-header {
      h5 {
        width: 50%;
        display: inline-block;
        text-align: left;
      }
      span {
        width: 50%;
        display: inline-block;
        text-align: right;
      }
    }
  }
</style>
