<template>
  <div class="card bg-light mb-3 col-md-3 no-padding-r-l" v-if="!stateSet">
    <div class="card-body">
      <h5 class="card-title">Control</h5>
      <form>
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
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    stateSet() {
      return this.$store.getters.getStateSet;
    },
    interval: {
      get() {
        return this.$store.getters.getInterval;
      },
      set(value) {
        this.$store.dispatch("updateInterval", value);
      },
    },
    gameState() {
      return this.$store.getters.getGameState;
    },
  },
};
</script>
