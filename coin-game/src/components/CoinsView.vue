<template>
  <div>
    <div v-for="(coin, index) in coins" :key="index" class="coin-parent">
      <div class="coin" v-bind:class="getValueName(coin)"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Coins',
  props: ['coins'],
  data() {
    return {
      coinClasses: {
        1: 'one-p',
        2: 'two-p',
        5: 'five-p',
        10: 'ten-p',
        20: 'twenty-p',
        50: 'fifty-p',
        100: 'one-pound',
        200: 'two-pound'
      }
    }
  },
  methods: {
    getValueName(coin) {
      var classStr = this.coinClasses[coin['value']]
      if (coin['played']) {
        classStr = classStr + ' played'
      }
      return classStr
    }
  }
}
</script>

<style>
  .coin-parent { display: inline-block; height: 30px; width: 30px; }
  .coin { opacity: 0.3; height: 30px; width: 30px; background-size: 30px 30px; background-repeat: no-repeat; background-position: center center; }
  .played { opacity: 1.0; }
  .one-p { background-image: url("../assets/img/1p.png"); }
  .two-p { background-image: url("../assets/img/2p.png"); }
  .five-p { background-image: url("../assets/img/5p.png"); }
  .ten-p { background-image: url("../assets/img/10p.png"); }
  .twenty-p { background-image: url("../assets/img/20p.png"); }
  .fifty-p { background-image: url("../assets/img/50p.png"); }
  .one-pound { background-image: url("../assets/img/1pound.png"); }
  .two-pound { background-image: url("../assets/img/2pound.png"); }
</style>
