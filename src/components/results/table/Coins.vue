<template>
  <div v-if="round.running && index == gameState.round && gameState.rounds[index].roles[roleIndex]">
    <div v-for="(coin, coinIndex) in gameState.rounds[index].roles[roleIndex].coins"
         :coin="coin"
         :coinIndex="coinIndex"
         :key="coinIndex"
         class="coin-parent"
         @click="playCoin(coinIndex, gameState.rounds[index].roles[roleIndex], gameState.rounds[index])"
    >
      <div
        class="coin"
        data-toggle="tooltip" data-placement="top" :title="coinNames[coin.value]"
        :class="[getClassName(role), getValueName(coin)]"
        @mouseover="showCoinValue(coinNames[coin.value])"
      />
    </div>
  </div>
</template>

<script>
import timeFuns from '../../../lib/timeFuns.js'

export default {
  props: [
    'socket',
    'round',
    'role',
    'index',
    'roleIndex'
  ],
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
      },
      coinNames: {
        1: '1p',
        2: '2p',
        5: '5p',
        10: '10p',
        20: '20p',
        50: '50p',
        100: '£1',
        200: '£2'
      }
    }
  },
  computed: {
    workshopName() {
      return this.$store.getters.getWorkshopName
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    gameState() {
      return this.$store.getters.getGameState
    },
    myName() {
      return this.$store.getters.getMyName
    }
  },
  methods: {
    getClassName(role) {
      return role.role.replace(' ', '-').toLowerCase()
    },
    getValueName(coin) {
      let classStr = this.coinClasses[coin.value]
      if (coin.played) {
        classStr = classStr + ' played'
      }
      return classStr
    },
    showCoinValue(value) {
      if (value) {
        this.$store.dispatch('updateCurrentCoin', value)
      }
    },
    outOfTime(round) {
      return timeFuns.outOfTime(round, this.gameState)
    },
    canPlayCoin(coin, role, round) {
      let canPlay = true
      if (this.gameState.config.namedRolesClick) {
        canPlay = role.name.id == this.myName.id
        if (!canPlay) {
          this.socket.emit('status', 'Unable to play that coin - that is not your role...')
        }
      }
      return canPlay && role.role != 'Customer' && !this.outOfTime(round)
    },
    playCoin(coin, role, round) {
      if (this.canPlayCoin(coin, role, round)) {
        this.socket.emit('playCoin', {workshopName: this.workshopName, gameName: this.gameName, coin: coin, role: role.role, round: round.name})
      }
    }
  }
}
</script>

<style lang="scss">

.coin-parent {
  display: inline-block;
  height: 20px;
  width: 20px;
}

.coin {
  opacity: 0.3;
  height: 20px;
  width: 20px;
  background-size: 20px 20px;
  background-repeat: no-repeat;
  background-position: center center;

  &:hover {
    cursor: pointer;
  }
}

.played, .customer {
  opacity: 1;
  background-color: green;
  border-radius: 9px;
}

</style>
