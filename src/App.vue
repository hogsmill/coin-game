<template>
  <div id="app" class="mb-4">
    <appHeader></appHeader>
    <div v-if="showAbout">
      <AboutView />
    </div>
    <div v-else>
      <h1>The Coin Game</h1>
      <div class="container">
        <div :class="{'not-host' : !isHost}" class="card-deck">
          <app-denominations></app-denominations>
          <app-roles></app-roles>
          <app-control></app-control>
        </div>
        <div v-if="!isHost && !stateSet" class="form-check">
          <input
            class="form-check-input mr-neg-10"
            id="clickCoins"
            type="checkbox"
            v-model.lazy="gameState['clickOnCoins']"
          />
          <label for="clickCoins">Click on Coins</label>
        </div>
        <app-game-buttons></app-game-buttons>
      </div>
      <ResultsView v-bind:gameState="gameState" />
    </div>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Denominations from "./components/game-config/Denominations.vue";
import Roles from "./components/game-config/Roles.vue";
import Control from "./components/game-config/Control.vue";
import GameButtons from "./components/game-config/GameButtons.vue";
import AboutView from "./components/about/AboutView.vue";
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
    ResultsView,
  },
  computed: {
    isHost() {
      return this.$store.getters.getHost;
    },
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
};
</script>

<style>
  .not-host { height: 0px; visibility: hidden; }
</style>
