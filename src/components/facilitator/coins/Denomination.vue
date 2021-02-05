<template>
  <tr>
    <td>
      {{ getLabel(amount) }}
    </td>
    <td>
      <input type="text" class="form-control col-md-3" :id="id" :name="id" :value="editingWorkshop.denominations[amount]">
      <i class="fas fa-save" title="Save Changes" @click="updateDenomination()" />
      (<i>Default: {{ editingWorkshop.defaultDenominations[amount] }}</i>)
    </td>
    <td>
      <div class="distribution" :style="{ width: getWidth(editingWorkshop.denominations[amount]) }" />
    </td>
  </tr>
</template>

<script>
import stringFuns from '../../../lib/stringFuns.js'

export default {
  props: [
    'socket',
    'id',
    'amount'
  ],
  computed: {
    editingWorkshop() {
      return this.$store.getters.getEditingWorkshop
    },
    editingGame() {
      return this.$store.getters.getEditingGame
    }
  },
  methods: {
    scope() {
      return this.editingWorkshop ? this.editingWorkshop : this.editingGame
    },
    currencyMajorSymbol() {
      return this.scope().currency.symbol
    },
    currencyMinorSymbol() {
      return this.scope().currency.minor
    },
    getLabel(n) {
      if (n >= 100) {
        return this.currencyMajorSymbol() + (n / 100)
      } else {
        return n + this.currencyMinorSymbol()
      }
    },
    getWidth(n) {
      return n * 10 + 'px'
    },
    updateDenomination() {
      const workshop = this.editingWorkshop.workshopName
      const game = this.editingGame.gameName
      const n = document.getElementById(this.id).value
      this.socket.emit('updateDenomination', {workshopName: workshop, gameName: game, amount: this.amount, number: n})
    }
  }
}
</script>
