<template>
  <div id="app" class="mb-4">
    <appHeader></appHeader>
    <div v-if="showAbout">
      <AboutView />
    </div>
    <div v-else>
      <h1>The Coin Game</h1>
      <div class="container">
        <div :class="{hidden : !isHost}" class="card-deck">
          <app-denominations></app-denominations>
          <app-roles></app-roles>
          <app-control></app-control>
          <app-game-buttons></app-game-buttons>
        </div>
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
