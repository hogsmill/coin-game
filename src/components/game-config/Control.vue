<template>
  <div class="config card bg-light mb-3 no-padding-r-l">
    <div class="card-body">
      <div class="control-header">
        <h5 class="card-title">Control</h5>
        <span v-if="showControl"  @click="setShowControl(false)">&#9650;</span>
        <span v-if="!showControl"  @click="setShowControl(true)">&#9660;</span>
      </div>
      <div v-if="showControl">
        <form class="control">
          <div class="form-group">
            <label for="interval">Interval Between Coin Plays (ms)</label>
            <input type="text" class="form-control" id="interval" name="interval" v-model.lazy="gameState.interval" v-on:change="updateInterval()"/>
          </div>
          <div class="form-group">
            <label for="timeLimit">Time Limit Per Round (s) - </label>
            Demo: <input type="text" class="form-control" id="demoTimeLimit" name="demoTimeLimit" v-model.lazy="gameState.timeLimit.demo" v-on:change="updateDemoTimeLimit()" />
            Click: <input type="text" class="form-control" id="clickTimeLimit" name="clickTimeLimit" v-model.lazy="gameState.timeLimit.click" v-on:change="updateClickTimeLimit()" />
          </div>
          <div class="form-group">
            <label for="valueTimeLimit">Value First Round Time Limit (s) - </label>
            Demo: <input type="text" class="form-control" id="demoValueTimeLimit" name="demoValueTimeLimit" v-model.lazy="gameState.valueTimeLimit.demo" v-on:change="updateDemoValueTimeLimit()" />
            Click: <input type="text" class="form-control" id="clickValueTimeLimit" name="clickValueTimeLimit" v-model.lazy="gameState.valueTimeLimit.click" v-on:change="updateClickValueTimeLimit()" />
          </div>
          <div class="form-check always-visible">
            <label for="clickCoins">Click on Coins</label>
            <input class="form-check-input mr-neg-10" id="clickOnCoins" type="checkbox" v-model.lazy="gameState.clickOnCoins" @click="updateClickOnCoins()" />
          </div>
        </form>
      </div>
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
      showControl: false,
      clickOnCoins: true
    }
  },
  methods: {
    setShowControl(val) {
      this.showControl = val
    },
    updateInterval() {
      var interval = document.getElementById('interval').value
      this.socket.emit("updateInterval", { gameName: this.gameName, value: interval})
    },
    updateDemoTimeLimit() {
      var timeLimit = document.getElementById('demoTimeLimit').value
      this.socket.emit("updateDemoTimeLimit", { gameName: this.gameName, value: timeLimit})
    },
    updateClickTimeLimit() {
      var timeLimit = document.getElementById('clickTimeLimit').value
      this.socket.emit("updateClickTimeLimit", { gameName: this.gameName, value: timeLimit})
    },
    updateDemoValueTimeLimit() {
      var valueTimeLimit = document.getElementById('demoValueTimeLimit').value
      this.socket.emit("updateDemoValueTimeLimit", { gameName: this.gameName, value: valueTimeLimit})
    },
    updateClickValueTimeLimit() {
      var valueTimeLimit = document.getElementById('clickValueTimeLimit').value
      this.socket.emit("updateClickValueTimeLimit", { gameName: this.gameName, value: valueTimeLimit})
    },
    updateClickOnCoins() {
      this.clickOnCoins = !this.clickOnCoins
      this.socket.emit("updateClickOnCoins", { gameName: this.gameName, value: this.clickOnCoins})
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName;
    },
    gameState() {
      return this.$store.getters.getGameState;
    }
  }
};
</script>

<style scoped lang="scss">

  .control {
    label {
      width: 250px;
      display: inline-block;
      text-align: right;
      margin-right: 6px;
    }
    input {
      width: 80px;
      display: inline-block;
    }
  }
</style>
