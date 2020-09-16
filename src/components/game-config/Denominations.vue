<template>
  <div class="config card bg-light mb-3 no-padding-r-l">
    <div class="card-body">
      <div class="control-header">
        <h5 class="card-title">
          Denominations and Currency
        </h5>
        <span v-if="showDenominations" @click="setShowDenominations(false)">&#9650;</span>
        <span v-if="!showDenominations" @click="setShowDenominations(true)">&#9660;</span>
      </div>
      <div v-if="showDenominations">
        <form class="form-inline denominations">
          <Denomination :socket="socket" :id="'twoPound'" :amount="200" :denominations="denominations" />
          <Denomination :socket="socket" :id="'onePound'" :amount="100" :denominations="denominations" />
          <Denomination :socket="socket" :id="'fifty'" :amount="50" :denominations="denominations" />
          <Denomination :socket="socket" :id="'twenty'" :amount="20" :denominations="denominations" />
          <Denomination :socket="socket" :id="'ten'" :amount="10" :denominations="denominations" />
          <Denomination :socket="socket" :id="'five'" :amount="5" :denominations="denominations" />
          <Denomination :socket="socket" :id="'two'" :amount="2" :denominations="denominations" />
          <Denomination :socket="socket" :id="'one'" :amount="1" :denominations="denominations" />
          <div class="form-group currency">
            <label for="currency">Currency: </label>
            <select class="form-control" id="currency" @change="updateCurrency()">
              <option>-- Select --</option>
              <option value="pound">
                &pound;
              </option>
              <option value="euro">
                &euro;
              </option>
              <option value="dollar">
                &dollar;
              </option>
            </select>
          </div>
        </form>
        <div class="mt-4">
          Total: £{{ total() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Denomination from './denominations/Denomination.vue'

export default {
  components: {
    Denomination
  },
  props: [
    'socket'
  ],
  data() {
    return {
      showDenominations: false
    }
  },
  computed: {
    denominations() {
      return this.$store.getters.getDenominations
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    gameState() {
      return this.$store.getters.getGameState
    },
    currency() {
      return this.$store.getters.getCurrency
    }
  },
  methods: {
    setShowDenominations(val) {
      this.showDenominations = val
    },
    total() {
      let total = 0
      for (const denomination in this.denominations) {
        total += this.denominations[denomination] * denomination
      }
      this.$store.getters.getGameState['total'] = total
      const pounds = Math.floor(total / 100)
      let pence = total - pounds * 100
      if (pence < 10) {
        pence = '0' + pence
      }
      return pounds + ':' + pence
    },
    getWidth(n) {
      let sum = 0
      for (const denomination in this.denominations) {
        sum = sum + parseInt(this.denominations[denomination])
      }
      return (n / sum) * 100 + '%'
    },
    updateDenominations() {
      this.socket.emit('updateDenominations', { gameName: this.gameName, value: this.denominations })
    },
    updateCurrency() {
      const currency = document.getElementById('currency').value
      this.socket.emit('updateCurrency', { gameName: this.gameName, value: currency })

    }
  }
}
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
