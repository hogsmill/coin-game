<template>
  <div class="results mb-5">
    <h2>Results </h2><Learnings :socket="socket" />
    <div class="narration" />
    <div class="container">
      <table class="table table-striped">
        <thead>
          <td :style="{ width: setWidth() }">
            Round
          </td>
          <td v-for="role in gameState.rounds[0]['roles']" :key="role.role" :style="{ width: setWidth() }">
            <span @click="showNameEdit(role.role)"> {{ role.role }} </span>
            <div v-if="roleEditing == role.role">
              <select id="roleSelect" class="form-control" v-model="role.name">
                <option v-for="(player, index) in gameState.players" :key="index">
                  {{ player.name }}
                </option>
              </select>
              <button class="btn btn-site-primary mb-2" @click="updateRole(role)">
                &crarr;
              </button>
            </div>
            <span v-if="roleEditing != role.role && role.name"><br> ({{ role.name }}) </span>
          </td>
          <td :style="{ width: setWidth() }">
            Delivered
          </td>
        </thead>
        <tbody id="results-table-body">
          <tr v-for="(round, index) in gameState.rounds" :key="index">
            <td>{{ round.name }}</td>
            <td
              v-for="(role, roleIndex) in gameState.rounds[0].roles"
              :role="role"
              :roleIndex="roleIndex"
              :key="roleIndex"
            >
              <div v-if="index == gameState.round && gameState.rounds[index].roles[roleIndex]">
                <div
                  v-for="(coin, coinIndex) in gameState.rounds[index].roles[roleIndex].coins"
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
                  />
                </div>
              </div>
            </td>
            <td>
              <div>
                {{ currencyLabel() }}{{ value(round.delivered) }} in {{ time(round.time) }}
              </div>
              <div v-if="outOfTime(round)" class="missed">
                Missed delivery
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import stringFuns from '../../lib/stringFuns.js'

import Learnings from './Learnings.vue'

export default {
  name: 'Results',
  components: {
    Learnings
  },
  props: [
    'socket'
  ],
  data() {
    return {
      roleEditing: '',
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
    showNameEdit(role) {
      this.roleEditing = role
    },
    updateRole(role) {
      this.roleEditing = ''
      const name = document.getElementById('roleSelect').value
      this.socket.emit('updateGameRole', {gameName: this.gameName, role: role, name: name})
    },
    setWidth() {
      return 100 / (this.gameState.roles.length + 1) + '%'
    },
    getClassName(role) {
      return role.role.replace(' ', '-').toLowerCase()
    },
    currencyLabel() {
      return stringFuns.htmlDecode(this.currency.major)
    },
    getValueName(coin) {
      let classStr = this.coinClasses[coin.value]
      if (coin.played) {
        classStr = classStr + ' played'
      }
      return classStr
    },
    time(secs) {
      const minutes = Math.floor(secs / 60)
      secs = Math.floor(secs - minutes * 60)
      if (secs < 10) {
        secs = '0' + secs
      }
      return minutes + ':' + secs
    },
    value(n) {
      const pounds = Math.floor(n / 100)
      let pence = n - pounds * 100
      if (pence < 10) {
        pence = '0' + pence
      }
      return pounds + '.' + pence
    },
    outOfTime(round) {
      const scope = this.gameState.clickOnCoins ? 'click' : 'demo'
      return round.time >= this.gameState.timeLimit[scope]
    },
    canPlayCoin(coin, role, round) {
       return role.role != 'Customer' && !this.outOfTime(round)
    },
    playCoin(coin, role, round) {
      if (this.canPlayCoin(coin, role, round)) {
        this.socket.emit('playCoin', { gameName: this.gameName, coin: coin, role: role.role, round: round.name })
      }
    }
  }
}
</script>

<style lang="scss">
thead {
  font-weight: bold;
}
.missed {
  margin-top: 12px;
  color: red;
  font-weight: bold;
}

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
  .played, .customer { opacity: 1; }

  .one-p { background-image: url("../../assets/img/1p.png"); }
  .two-p { background-image: url("../../assets/img/2p.png"); }
  .five-p { background-image: url("../../assets/img/5p.png"); }
  .ten-p { background-image: url("../../assets/img/10p.png"); }
  .twenty-p { background-image: url("../../assets/img/20p.png"); }
  .fifty-p { background-image: url("../../assets/img/50p.png"); }
  .one-pound { background-image: url("../../assets/img/1pound.png"); }
  .two-pound { background-image: url("../../assets/img/2pound.png"); }

  .role-name-edit { width: 60px; margin-right: 2px; border: 1px solid #ced4da; }
</style>
