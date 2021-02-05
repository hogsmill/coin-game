<template>
  <div class="config card bg-light mb-3 no-padding-r-l">
    <div class="card-body">
      <div class="control-header">
        <h5 class="card-title">
          Coins
        </h5>
        <i v-if="showCoins" @click="setShowCoins(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showCoins" @click="setShowCoins(true)" title="expand" class="fas fa-caret-down toggle" />
      </div>
      <div v-if="showCoins">
        <Selected :scope="'workshop'" />
        <table class="config-table">
          <tr>
            <td>
              Currency:
            </td>
            <td>
              <select class="form-control" id="currency">
                <option>-- Select --</option>
                <option v-for="(currency, index) in editingWorkshop.currencies" :key="index" :selected="currency.name == editingWorkshop.currency.name">
                  {{ currency.name }}
                </option>
              </select>
              <i class="fas fa-save" title="Save Changes" @click="updateCurrency()" />
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <table class="denominations-table">
                <Denomination :socket="socket" :id="'twoPound'" :amount="200" />
                <Denomination :socket="socket" :id="'onePound'" :amount="100" />
                <Denomination :socket="socket" :id="'fifty'" :amount="50" />
                <Denomination :socket="socket" :id="'twenty'" :amount="20" />
                <Denomination :socket="socket" :id="'ten'" :amount="10" />
                <Denomination :socket="socket" :id="'five'" :amount="5" />
                <Denomination :socket="socket" :id="'two'" :amount="2" />
                <Denomination :socket="socket" :id="'one'" :amount="1" />
              </table>
            </td>
          </tr>
          <tr>
            <td>
              Total: {{ currencySymbol() }}{{ total() }}
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Selected from './selected/Selected.vue'
import Denomination from './coins/Denomination.vue'

export default {
  components: {
    Selected,
    Denomination
  },
  props: [
    'socket'
  ],
  data() {
    return {
      showCoins: false
    }
  },
  computed: {
    editingWorkshop() {
      return this.$store.getters.getEditingWorkshop
    }
  },
  methods: {
    setShowCoins(val) {
      this.showCoins = val
    },
    currencySymbol() {
      return this.editingWorkshop.currency.symbol
    },
    total() {
      let total = 0
      for (const denomination in this.editingWorkshop.denominations) {
        total += this.editingWorkshop.denominations[denomination] * denomination
      }
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
    updateCurrency() {
      const workshop = this.editingWorkshop.workshopName
      const currency = document.getElementById('currency').value
      this.socket.emit('updateCurrency', {workshopName: workshop, currency: currency })

    }
  }
}
</script>

<style scoped lang="scss">
  .denominations-table {
    width: 100%;

    td {
      vertical-align: middle !important;
    }
  }
</style>
