<template>
  <div class="config card bg-light mb-3 no-padding-r-l">
    <div class="card-body">
      <div class="control-header">
        <h5 class="card-title">
          Teams
        </h5>
        <i v-if="showTeams" @click="setShowTeams(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showTeams" @click="setShowTeams(true)" title="expand" class="fas fa-caret-down toggle" />
      </div>
      <div v-if="showTeams">
        <table class="config-table">
          <tr>
            <td>Players</td>
            <td>
              <div>
                <input type="text" id="new-player">
                <button class="btn btn-sm btn-secondary smaller-font" @click="addPlayer()">
                  Add New
                </button>
              </div>
              <table v-if="editingGame" class="player-table">
                <tr v-for="(player, index) in editingGame.gameState.players" :key="index">
                  <td>
                    {{ player.name }}
                  </td>
                  <td>
                    <i class="far fa-edit" @click="editPlayer(player)" />
                    <i class="far fa-trash-alt" @click="deletePlayer(player)" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'

export default {
  props: [
    'socket'
  ],
  data() {
    return {
      showTeams: false
    }
  },
  computed: {
    editingWorkshop() {
      return this.$store.getters.getEditingWorkshop
    },
    editingGame() {
      return this.$store.getters.getEditingGame
    }
  },
  methods: {
    setShowTeams(val) {
      this.showTeams = val
    },
    addPlayer() {
      const workshop = this.editingWorkshop.workshopName
      const game = this.editingGame.gameName
      const player = document.getElementById('new-player').value
      if (!player) {
        alert('Please enter a valid player name')
      } else {
        const uuid = uuidv4()
        const playerData = {id: uuid, name: player}
        this.socket.emit('addPlayer', {workshopName: workshop, gameName: game, player: playerData})
        document.getElementById('new-player').value = ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .player-table {
    td {
      border: none;
      vertical-align: middle;
    }
  }
</style>
