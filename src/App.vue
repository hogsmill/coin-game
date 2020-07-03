<template>
  <div id="app" class="mb-4">
    <appHeader></appHeader>
    <WalkThroughView />
    <div v-if="showAbout">
      <AboutView />
    </div>
    <div v-else>
      <h1>The Coin Game</h1>
      <GameName />
      <div class="container">
        <div :class="{'not-host' : !isHost}" class="card-deck">
          <app-denominations></app-denominations>
          <app-roles></app-roles>
          <app-control></app-control>
        </div>
        <div v-if="!isHost && !stateSet" class="form-check">
          <input
            class="form-check-input"
            id="clickCoins"
            type="checkbox"
            v-model.lazy="gameState['clickOnCoins']"
          />
          <label for="clickCoins" id="click-coins">Click on Coins</label>
        </div>
        <app-game-buttons></app-game-buttons>
      </div>
      <ResultsView v-bind:gameState="gameState" />
    </div>
  </div>
</template>

<script>
import params from './lib/params.js'

import Header from "./components/Header.vue";
import GameName from "./components/GameName.vue";
import Denominations from "./components/game-config/Denominations.vue";
import Roles from "./components/game-config/Roles.vue";
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
    appControl: Control,
    appGameButtons: GameButtons,
    AboutView,
    WalkThroughView,
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
    if (params.isParam("host")) {
      this.$store.dispatch("updateHost", true)
    }
    if (params.isParam("walkThrough")) {
      this.$store.dispatch("updateWalkThrough", true)
      this.$modal.show("walk-through")
    }
  }
}
</script>

<style>
  .not-host { height: 0px; visibility: hidden; }
  #clickCoins { margin-left: -2rem; }
</style>
