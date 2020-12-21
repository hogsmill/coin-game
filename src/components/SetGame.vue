<template>
  <div class="game-name" v-if="!showAbout">
    <button class="btn btn-sm btn-secondary smaller-font" @click="show">
      Set Up Game
    </button>

    <modal name="set-game" :height="400" :classes="['rounded', 'set-game']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4">
        <h3>
          Set Up Game
        </h3>
        <table>
          <tr>
            <td>
              Workshop
            </td>
            <td>
              <div>
                <input type="text" id="workshop-name" class="form-control" :value="workshopName">
                <i class="fas fa-save" @click="setWorkshop()" />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <span v-if="workshopName">Team</span>
              <span v-if="!workshopName">Game</span>
            </td>
            <td>
              <div>
                <input type="text" id="game-name" class="form-control" :value="gameName">
                <i class="fas fa-save" @click="setGame()" />
              </div>
              <div>
                <select id="selected-game-name" v-if="workshop.games" @change="selectGame()">
                  <option>-- Select --</option>
                  <option v-for="(game, index) in workshop.games" :key="index">
                    {{ game }}
                  </option>
                </select>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              My Name
            </td>
            <td>
              <div>
                <input type="text" id="my-name" class="form-control" :value="myName.name">
                <i class="fas fa-save" @click="setWorkshop()" />
              </div>
              <div>
                <select id="selected-player" v-if="players.length" @change="selectMyName()">
                  <option>-- Select --</option>
                  <option v-for="(player, index) in players" :key="index" :value="player.id">
                    {{ player.name }}
                  </option>
                </select>
              </div>
            </td>
          </tr>
        </table>
        <button class="btn btn-sm btn-secondary smaller-font" @click="hide()">
          Done
        </button>
      </div>
    </modal>
  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  computed: {
    showAbout() {
      return this.$store.getters.getShowAbout
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
    players() {
      return this.$store.getters.getPlayers
    },
    myName() {
      return this.$store.getters.getMyName
    }
  },
  methods: {
    show() {
      this.$modal.show('set-game')
    },
    hide() {
      this.$modal.hide('set-game')
    },
    setWorkshop() {
      const workshop = document.getElementById('workshop-name').value
      localStorage.setItem('workshopName-cg', workshop)
      this.$store.dispatch('updateWorkshopName', workshop)
      this.$store.dispatch('updateGameName', '')
      this.$store.dispatch('setMyName', '')
      this.socket.emit('loadWorkshop', {workshopName: workshop})
    },
    _setGame(gameName) {
      localStorage.setItem('gameName-cg', gameName)
      this.$store.dispatch('updateGameName', gameName)
      this.socket.emit('loadGame', { workshopName: this.workshopName, gameName: gameName })
    },
    selectGame() {
      const gameName = document.getElementById('selected-game-name').value
      this._setGame(gameName)
    },
    setGame() {
      const gameName = document.getElementById('game-name').value
      this._setGame(gameName)
    },
    selectMyName() {
      const id = document.getElementById('selected-player').value
      const myName = this.players.find(function(p) {
        return p.id = id
      })
      localStorage.setItem('myName-cg', JSON.stringify(myName))
      this.$store.dispatch('setMyName', myName)
    }
  },
}
</script>

<style lang="scss">

  .game-name {
    float: right;
    width: 110px;
    display: inline-block;
  }

  .restart {
    margin-right: 12px;
  }

  .set-game {
    table {
      margin: 0 auto;
      td {
        padding: 4px;

        input, select {
          width: 180px;
          padding: 4px;
          margin-bottom: 8px;
          display: inline-block;
        }
        div {
          text-align: left;
          width: 250px;
        }
        .fas {
          font-size: x-large;
          color: #888;
          display: inline-block;
          margin: 0px 8px;
          position: relative;
          top: 4px;

          &:hover {
            cursor: pointer;
            color: #444;
          }
        }
      }
    }
  }
</style>
