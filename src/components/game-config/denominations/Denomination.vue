<template>
  <div class="form-group">
    <label class="width-50" :for="id">{{ getLabel(amount) }}</label>
    <input type="text" class="form-control col-md-3" :id="id" :name="id" v-model.lazy="denominations[amount]" @change="updateDenominations()">
    <div class="distribution" :style="{ width: getWidth(denominations[amount]) }" />
  </div>
</template>

<script>
import stringFuns from '../../../lib/stringFuns.js'

export default {
  props: [
    'socket',
    'id',
    'denominations',
    'amount'
  ],
  computed: {
    currency() {
      return this.$store.getters.getCurrency
    }
  },
  methods: {
    getLabel(n) {
      if (n >= 100) {
        return stringFuns.htmlDecode(this.currency.major) + (n / 100)
      } else {
        return n + stringFuns.htmlDecode(this.currency.minor)
      }
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
    }
  }
}
</script>
