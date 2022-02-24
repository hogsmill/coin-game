<template>
  <span class="learnings">
    <button v-if="gameName && (admin || !workshop.config.onlyAdminCanControl)" class="btn btn-sm btn-secondary mb-2" :disabled="running()" @click="show()">Show Learnings</button>
  </span>
</template>

<script>
import bus from '../../socket.js'

export default {
  data() {
    return {
      step: 1
    }
  },
  computed: {
    admin() {
      return this.$store.getters.getAdmin
    },
    workshop() {
      return this.$store.getters.getWorkshop
    },
    workshopName() {
      return this.$store.getters.getWorkshopName
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    gameState() {
      return this.$store.getters.getGameState
    }
  },
  methods: {
    running() {
      let r = false
      for (let i = 0; i < this.gameState.rounds.length; i++) {
        r = r || this.gameState.rounds[i].running
      }
      return r
    },
    show() {
      bus.emit('sendGetWorkshopResults', { workshopName: this.workshopName, single: this.workshop.single, gameName: this.gameName })
      this.$store.dispatch('showModal', 'learnings')
    }
  }
}
</script>
