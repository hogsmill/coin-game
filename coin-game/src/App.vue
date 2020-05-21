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
