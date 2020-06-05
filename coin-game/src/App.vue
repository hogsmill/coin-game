<template>
  <div id="app" class="mb-4">
    <appHeader></appHeader>
    <div v-if="showAbout">
      <AboutView />
    </div>
    <div v-else>
      <h1>{{ h1 }}</h1>
      <button @click="updateH1('New h1 message')" class="btn btn-primary mb-4">
        Update H1 text
      </button>
      <div class="container">
        <div class="card-deck">
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
import io from "socket.io-client";

export default {
  name: "App",
  data() {
    return {
      h1: "The Coin Game",
    };
  },
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
    updateH1(data) {
      this.socket.emit("test", data);
    },
  },
  created() {
    this.socket = io("http://localhost:3000");
  },
  mounted() {
    this.socket.on("updateHeader", (data) => {
      this.h1 = data;
    });
  },
};
</script>
