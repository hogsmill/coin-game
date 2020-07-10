<template>
  <div class="card bg-light mb-3 col-md-3 no-padding-r-l" v-if="!stateSet">
    <div class="card-body">
      <h5 class="card-title">Control</h5>
      <form class="control">
        <div class="form-group">
          <label for="interval">Interval Between Coin Plays (ms)</label>
          <input
            type="text"
            class="form-control"
            id="interval"
            name="interval"
            v-model.lazy="interval"
          />
        </div>

        <div class="form-group">
          <label for="timeLimit">Time Limit Per Round (ms)</label>
          <input
            type="text"
            class="form-control"
            id="timeLimit"
            name="timeLimit"
            v-model.lazy="gameState['timeLimit']"
            v-on:change="updateGameState()"
          />
        </div>

        <div class="form-group">
          <label for="valueTimeLimit">Value First Round Time Limit (ms)</label>
          <input
            type="text"
            class="form-control"
            id="valueTimeLimit"
            name="valueTimeLimit"
            v-model.lazy="gameState['valueTimeLimit']"
            v-on:change="updateGameState()"
          />
        </div>
        <div class="form-check always-visible">
          <input
            class="form-check-input mr-neg-10"
            id="clickCoins"
            type="checkbox"
            v-model.lazy="gameState['clickOnCoins']"
          />
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
  methods: {
    updateGameState() {
      this.socket.emit("updateGameState", { gameName: this.gameName, gameState: this.$store.getters.getGameState})
    }
  },
  computed: {
    stateSet() {
      return this.$store.getters.getStateSet;
    },
    interval: {
      get() {
        return this.$store.getters.getInterval;
      },
      set(value) {
        this.socket.emit("updateInterval", { gameName: this.gameName, value: value })
      },
    },
    gameState() {
      return this.$store.getters.getGameState;
    }
  },
  mounted() {
    this.socket.on("updateInterval", (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch("updateInterval", data.value)
      }
    }),
    this.socket.on("updateGameState", (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch("updateGameState", data.gameState)
      }
    })
  }
};
</script>
