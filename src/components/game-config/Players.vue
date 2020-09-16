<template>
  <div class="config card bg-light mb-3 no-padding-r-l">
    <div class="card-body">
      <div class="control-header">
        <h5 class="card-title">
          Players
        </h5>
        <span v-if="showPlayers" @click="setShowPlayers(false)">&#9650;</span>
        <span v-if="!showPlayers" @click="setShowPlayers(true)">&#9660;</span>
      </div>
      <div v-if="showPlayers">
        <form class="form-inline">
          <input type="text" class="form-control mb-2 ml-1 col-md-8" v-model="player">
          <button class="btn btn-site-primary mb-2 update-role"
                  @click.prevent="addPlayer()"
                  @click="addPlayer()"
                  data-toggle="tooltip" data-placement="top" title="Add player"
          >
            &crarr;
          </button>
        </form>
        <div v-for="(player, index) in players" :key="index">
          <div>{{ player.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  data() {
    return {
      showPlayers: false,
      player: ''
    }
  },
  computed: {
    players() {
      return this.$store.getters.getPlayers
    },
    gameState() {
      return this.$store.getters.getGameState
    },
    gameName() {
      return this.$store.getters.getGameName
    },
  },
  methods: {
    setShowPlayers(val) {
      this.showPlayers = val
    },
    addPlayer() {
      const players = []
      for (let i= 0; i < this.players.length; i++) {
        players.push(this.players[i])
      }
      players.push(this.player)
      this.socket.emit('updatePlayers', { gameName: this.gameName, players: players })
    }
  }
}
</script>

<style scoped>

</style>
