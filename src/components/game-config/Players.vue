<template>
  <div class="card bg-light mb-3 mr-1 col-md-2 no-padding-r-l" v-if="!stateSet">
    <div class="card-body">
      <h5 class="card-title">Players</h5>
      <form class="form-inline">
        <input type="text" class="form-control mb-2 ml-1 col-md-6" v-model="player" />
        <button
          class="btn btn-site-primary mb-2 update-role"
          @click.prevent="addPlayer()"
          @click="addPlayer()"
          data-toggle="tooltip" data-placement="top" title="Add player"
        >
        &crarr;
        </button>
      </form>
      <div v-for="(player, index) in players" :key="index">
        <div>{{player}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      player: ''
    }
  },
  props: [
    'socket'
  ],
  computed: {
    players() {
      return this.$store.getters.getPlayers;
    },
    stateSet() {
      return this.$store.getters.getStateSet;
    },
    gameState() {
      return this.$store.getters.getGameState;
    },
    gameName() {
      return this.$store.getters.getGameName;
    },
  },
  methods: {
    addPlayer() {
      var players = []
      for (var i= 0; i < this.players.length; i++) {
        players.push(this.players[i])
      }
      players.push(this.player)
      this.socket.emit("updatePlayers", { gameName: this.gameName, players: players })
    }
  },
  mounted() {
    this.socket.on("updatePlayers", (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch("updateGameStatePlayers", data.players)
      }
    })
  }
};
</script>

<style scoped>
.col-md-2 {
    -ms-flex: 0 0 19%;
    flex: 0 0 19%;
    max-width: 19%;
}
</style>