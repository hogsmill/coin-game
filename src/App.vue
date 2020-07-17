<template>
  <div id="app" class="mb-4">
    <appHeader></appHeader>
    <WalkThroughView />
    <div v-if="showAbout">
      <AboutView />
    </div>
    <div v-else>
      <h1>The Coin Game</h1>
      <div class="col-md-12 mb-6">
        <MyName v-bind:socket="socket" />
        <GameName />
      </div>
      <div class="container">
        <div :class="{'not-host' : !isHost}" class="row">
          <app-denominations v-bind:socket="socket"></app-denominations>
          <app-roles v-bind:socket="socket"></app-roles>
          <app-players v-bind:socket="socket"></app-players>
          <app-control v-bind:socket="socket"></app-control>
        </div>
        <div v-if="!isHost && !stateSet" class="form-check col-md-12 mb-3 float-left">
          <input
            class="form-check-input"
            id="clickCoins"
            type="checkbox"
            v-model.lazy="gameState['clickOnCoins']"
          />
          <label for="clickCoins" id="click-coins">Click on Coins</label>
        </div>
        <app-game-buttons v-bind:socket="socket"></app-game-buttons>
      </div>
      <ResultsView v-bind:gameState="gameState" v-bind:socket="socket" />
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
    ResultsView,
  },
  computed: {
    isHost() {
      return this.$store.getters.getHost;
    },
    walkThrough() {
      return this.$store.getters.getWalkThrough;
    },
    showAbout() {
      return this.$store.getters.getShowAbout;
    },
    stateSet() {
      return this.$store.getters.getStateSet;
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
  },
}
</script>

<style>
  .not-host { height: 0px; visibility: hidden; }
  #clickCoins { margin-left: -2rem; }
</style>
