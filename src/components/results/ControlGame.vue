<template>
  <span v-if="gameName" class="restart">
    <i title="Restart Game" class="fas fa-undo-alt restart" aria-hidden="true" @click="restart()" />
    <i title="End Game" class="fas fa-stop-circle" aria-hidden="true" @click="endGame()" />
  </span>
</template>

<script>
import bus from '../../socket.js'

export default {
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
        bus.$emit('sendRestartGame', { workshopName: this.workshopName, gameName: this.gameName })
      }
    }
  }
}
</script>
