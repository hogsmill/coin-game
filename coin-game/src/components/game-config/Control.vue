<template>
  <div class="run" :class="{ running: stateSet }">
    <h2>Control</h2>
    <div v-if="!stateSet">
      <label for="interval">Interval Between Coin Plays (ms)</label>
      <input
        type="input"
        id="interval"
        name="interval"
        v-model.lazy="interval"
      />
      <label for="timeLimit">Time Limit Per Round (ms)</label>
      <input
        type="input"
        id="timeLimit"
        name="timeLimit"
        v-model.lazy="gameState['timeLimit']"
      />
      <label for="valueTimeLimit">Value First Round Time Limit (ms)</label>
      <input
        type="input"
        id="valueTimeLimit"
        name="valueTimeLimit"
        v-model.lazy="gameState['valueTimeLimit']"
      />
    </div>
    <button @click="go(0)" :disabled="gameState['running']">
      Run Batch
    </button>
    <button @click="go(1)" :disabled="gameState['running']">
      Run Kanban
    </button>
    <button @click="go(2)" :disabled="gameState['running']">
      Run Value Delivery
    </button>
    <button
      @click="stop()"
      v-if="stateSet && !stopped"
      :disabled="gameState['running']"
    >
      Stop
    </button>
    <button @click="start()" v-if="stopped" :disabled="gameState['running']">
      Start
    </button>
  </div>
</template>

<script>
export default {
  computed: {
    stateSet() {
      return this.$store.getters.getStateSet;
    },
    interval() {
      return this.$store.getters.getInterval;
    },
    stopped() {
      return this.$store.getters.getStopped;
    },
    gameState() {
      return this.$store.getters.getGameState;
    },
  },
};
</script>
