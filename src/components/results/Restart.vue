<template>
  <span class="restart">
    <button class="btn btn-sm btn-secondary mb-2" :disabled="running()" @click="restart()">Re-start Game</button>
  </span>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  computed: {
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
      return false
      //let r = false
      //for (let i = 0; i < this.gameState.rounds.length; i++) {
      //  r = r || this.gameState.rounds[i].running
      //}
      //return r
    },
    restart() {
      this.socket.emit('restartGame', {workshopName: this.workshopName, gameName: this.gameName})
    }
  }
}
</script>
