<template>
  <div class="card bg-light mb-3 no-padding-r-l" v-if="!stateSet">
    <div class="card-body">
      <h5 class="card-title">Control</h5>
      <form class="control">
        <div class="form-group">
          <label for="interval">Interval Between Coin Plays (ms)</label>
          <input type="text" class="form-control" id="interval" name="interval" v-model.lazy="gameState.interval" v-on:change="updateInterval()"/>
        </div>
        <div class="form-group">
          <label for="timeLimit">Time Limit Per Round (ms)</label>
          <input type="text" class="form-control" id="timeLimit" name="timeLimit" v-model.lazy="gameState.timeLimit" v-on:change="updateTimeLimit()" />
        </div>
        <div class="form-group">
          <label for="valueTimeLimit">Value First Round Time Limit (ms)</label>
          <input type="text" class="form-control" id="valueTimeLimit" name="valueTimeLimit" v-model.lazy="gameState.valueTimeLimit" v-on:change="updateValueTimeLimit()" />
        </div>
        <div class="form-check always-visible">
          <input class="form-check-input mr-neg-10" id="clickOnCoins" type="checkbox" v-model.lazy="gameState.clickOnCoins" @click="updateClickOnCoins()" />
          <label for="clickCoins">Click on Coins</label>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  data() {
    return {
      clickOnCoins: true
    }
  },
  methods: {
    updateInterval() {
      var interval = document.getElementById('interval').value
      this.socket.emit("updateInterval", { gameName: this.gameName, value: interval})
    },
    updateTimeLimit() {
      var timeLimit = document.getElementById('timeLimit').value
      this.socket.emit("updateTimeLmit", { gameName: this.gameName, value: timeLimit})
    },
    updateValueTimeLimit() {
      var valueTimeLimit = document.getElementById('valueTimeLimit').value
      this.socket.emit("updateValueTimeLmit", { gameName: this.gameName, value: valueTimeLimit})
    },
    updateClickOnCoins() {
      this.clickOnCoins = !this.clickOnCoins
      this.socket.emit("updateClickOnCoins", { gameName: this.gameName, value: this.clickOnCoins})
    }
  },
  computed: {
    stateSet() {
      return this.$store.getters.getStateSet;
    },
    gameName() {
      return this.$store.getters.getGameName;
    },
    gameState() {
      return this.$store.getters.getGameState;
    }
  }
};
</script>

<style scoped>
</style>
