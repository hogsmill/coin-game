<template>
  <div class="large-coin" :class="coinClasses[currentCoin]" />
</template>

<script>
export default {
  data() {
    return {
      coinClasses: {
        '1p': 'one-p',
        '2p': 'two-p',
        '5p': 'five-p',
        '10p': 'ten-p',
        '20p': 'twenty-p',
        '50p': 'fifty-p',
        '£1': 'one-pound',
        '£2': 'two-pound'
      }
    }
  },
  computed: {
    currentCoin() {
      return this.$store.getters.getCurrentCoin
    }
  }
}
</script>

<style lang="scss">

.large-coin {
  width: 60px;
  height: 60px;
  margin: 0 auto;
  background-size: 60px 60px;
  background-repeat: no-repeat;
  background-position: center center;
}

</style>
