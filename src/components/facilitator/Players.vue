<template>
  <div class="config card bg-light mb-3 no-padding-r-l">
    <div class="card-body">
      <div class="control-header">
        <h5 class="card-title">
          Players
        </h5>
        <i v-if="showTeams && editingGame.gameName" @click="setShowTeams(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showTeams && editingGame.gameName" @click="setShowTeams(true)" title="expand" class="fas fa-caret-down toggle" />
      </div>
      <div v-if="showTeams && editingGame.gameName">
        <Selected />
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
              <table class="player-table">
                <tr v-for="(player, index) in editingGame.gameState.players" :key="index">
                  <td>
                    <div class="player-name" v-if="editingPlayer != player.id">
                      {{ player.name }}
                    </div>
                    <input v-if="editingPlayer == player.id" class="editing-player" :id="'player-' + player.id" type="text" :value="player.name">
                  </td>
                  <td>
                    <i v-if="editingPlayer != player.id" class="far fa-edit" @click="editPlayer(player)" />
                    <i v-if="editingPlayer == player.id" class="far fa-save" @click="changePlayerName(player)" />
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

import Selected from './selected/Selected.vue'

export default {
  props: [
    'socket'
  ],
  components: {
    Selected
  },
  data() {
    return {
      showTeams: false,
      editingPlayer: ''
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
    },
    editPlayer(player) {
      this.editingPlayer = player.id
    },
    changePlayerName(player) {
      const workshop = this.editingWorkshop.workshopName
      const game = this.editingGame.gameName
      const newName = document.getElementById('player-' + player.id).value
      this.socket.emit('changePlayerName', { workshopName: workshop, gameName: game, player: player, newName: newName })
      document.getElementById('player-' + player.id).value = ''
      this.editingPlayer = ''
    },
    deletePlayer(player) {
      const deletePlayer = confirm('Delete ' + player.name + '?')
      if (deletePlayer) {
        const workshop = this.editingWorkshop.workshopName
        const game = this.editingGame.gameName
        this.socket.emit('deletePlayer', { workshopName: workshop, gameName: game, player: player })
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .inline {
    display: inline;
  }

  .player-table {
    td {
      border: none;
      vertical-align: middle;

      .player-name {
        width: 270px;
      }
      .editing-player {
        margin: 0 0 0 2px;
      }
    }
  }
</style>
