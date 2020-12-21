<template>
  <div class="results mb-5">
    <Learnings :socket="socket" />
    <Restart :socket="socket" />
    <div class="narration" />
    <div class="container">
      <table class="table table-striped">
        <Header :socket="socket" />
        <tbody id="results-table-body">
          <tr v-for="(round, index) in gameState.rounds" :key="index">
            <td>
              <RunButton :socket="socket" :round="round" :index="index" />
            </td>
            <td v-for="(role, roleIndex) in gameState.rounds[0].roles"
                :role="role" :roleIndex="roleIndex" :key="roleIndex"
            >
              <Coins :socket="socket" :round="round" :role="role" :index="index" :role-index="roleIndex" />
            </td>
            <td>
              <div>
                {{ value(round.delivered) }} in {{ time(round.time) }}
              </div>
              <div v-if="outOfTime(round)" class="result missed">
                Out of Time!
              </div>
              <div v-if="allDelivered(round)" class="result all-delivered">
                All Delivered!
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import roundFuns from '../../lib/roundFuns.js'
import stringFuns from '../../lib/stringFuns.js'
import timeFuns from '../../lib/timeFuns.js'

import Learnings from './Learnings.vue'
import Restart from './Restart.vue'
import Header from './table/Header.vue'
import RunButton from './table/RunButton.vue'
import Coins from './table/Coins.vue'

export default {
  name: 'Results',
  components: {
    Learnings,
    Restart,
    Header,
    RunButton,
    Coins
  },
  props: [
    'socket'
  ],
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
    time(secs) {
      return stringFuns.timeString(secs)
    },
    value(n) {
      return stringFuns.htmlDecode(this.currency.major) + stringFuns.valueString(n)
    },
    outOfTime(round) {
      return timeFuns.outOfTime(round, this.gameState)
    },
    allDelivered(round) {
      return roundFuns.allDelivered(round, this.gameState)
    }
  }
}
</script>

<style lang="scss">
thead {
  font-weight: bold;
}

.results {
  .result {
    margin-top: 12px;
    font-weight: bold;

    &.missed {
      color: red;
    }

    &.all-delivered {
      color: green;
    }
  }
}

</style>
