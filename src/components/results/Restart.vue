<template>
  <span class="restart">
    <button class="btn btn-sm btn-secondary mb-2" @click="restart()">Re-start Game</button>
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
    restart() {
      const restartGame = confirm('Are you sure you want to re-start this game?')
      if (restartGame) {
        this.socket.emit('restartGame', { workshopName: this.workshopName, gameName: this.gameName })
      }
    }
  }
}
</script>
