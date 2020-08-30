<template>

  <div class="form-group">
    <label class="width-50" :for="id" v-html="getLabel(amount)"></label>
    <input type="text" class="form-control col-md-3" :id="id" :name="id" v-model.lazy="denominations[amount]" v-on:change="updateDenominations()" />
    <div class="distribution" :style="{ width: getWidth(denominations[amount]) }"></div>
  </div>

</template>

<script>
export default {
  props: [
    'socket',
    'id',
    'denominations',
    'amount'
  ],
  methods: {
    getLabel(n) {
      if (n >= 100) {
        return this.currency.major + n / 100
      } else {
        return n + this.currency.minor
      }
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
    }
  },
  computed: {
    currency() {
      return this.$store.getters.getCurrency;
    }
  }
}
</script>
