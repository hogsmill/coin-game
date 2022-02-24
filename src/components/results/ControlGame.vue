<template>
  <span v-if="gameName" class="restart">
    <i title="Restart Game" v-if="admin || !workshop.config.onlyAdminCanControl" class="fas fa-undo-alt restart" aria-hidden="true" @click="restart()" />
    <i title="Clear Users" v-if="admin || !workshop.config.onlyAdminCanControl" class="fas fa-users-slash clear-users" aria-hidden="true" @click="clearUsers()" />
    <i title="End Game" v-if="admin || !workshop.config.onlyAdminCanControl" class="fas fa-stop-circle" aria-hidden="true" @click="endGame()" />
  </span>
</template>

<script>
import bus from '../../socket.js'

export default {
  computed: {
    admin() {
      return this.$store.getters.getAdmin
    },
    workshopName() {
      return this.$store.getters.getWorkshopName
    },
    workshop() {
      return this.$store.getters.getWorkshop
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    gameState() {
      return this.$store.getters.getGameState
    }
  },
  methods: {
    clearUsers() {
      if (confirm('Are you sure you want to clear users and re-start this game?')) {
        bus.emit('sendClearUsers', {workshopName: this.workshopName, gameName: this.gameName})
      }
    },
    restart() {
      if (confirm('Are you sure you want to re-start this game?')) {
        bus.emit('sendRestartGame', {workshopName: this.workshopName, gameName: this.gameName})
      }
    },
    endGame() {
      alert('endGame not implemented')
    }
  }
}
</script>
