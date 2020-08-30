<template>
  <div class="config card bg-light mb-3 no-padding-r-l">
    <div class="card-body">
      <div class="control-header">
        <h5 class="card-title">Denominations and Currency</h5>
        <span v-if="showDenominations"  @click="setShowDenominations(false)">&#9650;</span>
        <span v-if="!showDenominations"  @click="setShowDenominations(true)">&#9660;</span>
      </div>
      <div v-if="showDenominations">
        <form class="form-inline denominations">
          <Denomination v-bind:socket="socket" v-bind:id="'twoPound'" v-bind:amount="200" v-bind:denominations="denominations" />
          <Denomination v-bind:socket="socket" v-bind:id="'onePound'" v-bind:amount="100" v-bind:denominations="denominations" />
          <Denomination v-bind:socket="socket" v-bind:id="'fifty'" v-bind:amount="50" v-bind:denominations="denominations" />
          <Denomination v-bind:socket="socket" v-bind:id="'twenty'" v-bind:amount="20" v-bind:denominations="denominations" />
          <Denomination v-bind:socket="socket" v-bind:id="'ten'" v-bind:amount="10" v-bind:denominations="denominations" />
          <Denomination v-bind:socket="socket" v-bind:id="'five'" v-bind:amount="5" v-bind:denominations="denominations" />
          <Denomination v-bind:socket="socket" v-bind:id="'two'" v-bind:amount="2" v-bind:denominations="denominations" />
          <Denomination v-bind:socket="socket" v-bind:id="'one'" v-bind:amount="1" v-bind:denominations="denominations" />
          <div class="form-group currency">
            <label for="currency">Currency: </label>
            <select class="form-control" id="currency" v-on:change="updateCurrency()">
              <option>-- Select --</option>
              <option value="pound">&pound;</option>
              <option value="euro">&euro;</option>
              <option value="dollar">&dollar;</option>
            </select>
          </div>
        </form>
        <div class="mt-4">Total: £{{ total() }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Denomination from "./denominations/Denomination.vue";

export default {
  props: [
    'socket'
  ],
  components: {
    Denomination
  },
  data() {
    return {
      showDenominations: false
    }
  },
  methods: {
    setShowDenominations(val) {
      this.showDenominations = val
    },
    total() {
      var total = 0;
      for (var denomination in this.denominations) {
        total += this.denominations[denomination] * denomination;
      }
      this.$store.getters.getGameState["total"] = total;
      var pounds = Math.floor(total / 100);
      var pence = total - pounds * 100;
      if (pence < 10) {
        pence = "0" + pence;
      }
      return pounds + ":" + pence;
    },
    getWidth(n) {
      var sum = 0;
      for (var denomination in this.denominations) {
        sum = sum + parseInt(this.denominations[denomination]);
      }
      return (n / sum) * 100 + "%";
    },
    updateDenominations() {
      this.socket.emit("updateDenominations", { gameName: this.gameName, value: this.denominations })
    },
    updateCurrency() {
      var currency = document.getElementById('currency').value
      this.socket.emit("updateCurrency", { gameName: this.gameName, value: currency })

    }
  },
  computed: {
    denominations() {
      return this.$store.getters.getDenominations;
    },
    gameName() {
      return this.$store.getters.getGameName;
    },
    gameState() {
      return this.$store.getters.getGameState;
    },
    currency() {
      return this.$store.getters.getCurrency;
    }
  }
};
</script>

<style scoped lang="scss">
  .denominations {
    position: relative;

    .currency {
      vertical-align: top;
      position: absolute;
      top: 0;
      right: 12px;

      select {
        margin-left: 6px;
      }
    }
  }
</style>
