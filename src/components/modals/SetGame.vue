<template>
  <vue-final-modal name="set-game" classes="modal-container" content-class="vfm__content modal-content set-game" v-model="modals['setGame']">
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
            <div v-if="!workshopUrl">
              <select id="workshop-name" @change="setWorkshop()">
                <option value="">
                  -- Select --
                </option>
                <option v-for="(wshop, index) in workshops" :key="index" :selected="wshop.workshopName == workshopName">
                  {{ wshop.workshopName }}
                </option>
              </select>
            </div>
            <div v-if="workshopUrl">
              <b>{{ workshopUrl }}</b>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <span v-if="!workshop.single">Team</span>
            <span v-if="workshop.single">Game</span>
          </td>
          <td>
            <div v-if="!gameUrl">
              <select id="game-name" v-if="workshop.games" @change="setGame()">
                <option value="">
                  -- Select --
                </option>
                <option v-for="(game, index) in workshop.games" :key="index" :selected="game.gameName == gameName">
                  {{ game.gameName }}
                </option>
              </select>
            </div>
            <div v-if="gameUrl">
              <b>{{ gameUrl }}</b>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            My Name
          </td>
          <td>
            <div>
              <select id="my-name" v-if="players.length" @change="setMyName()">
                <option value="">
                  -- Select --
                </option>
                <option v-for="(player, index) in players" :key="index" :selected="player.id == myName.id" :value="player.id">
                  {{ player.name }}
                </option>
              </select>
            </div>
          </td>
        </tr>
      </table>
      <button class="btn btn-info" @click="hide()">
        Done
      </button>
    </div>
  </vue-final-modal>
</template>

<script>
import bus from '../../socket.js'

import { VueFinalModal } from 'vue-final-modal'

import params from '../../lib/params.js'
import mailFuns from '../../lib/mail.js'

export default {
  components: {
    VueFinalModal
  },
  data() {
    return {
      workshopUrl: '',
      gameUrl: ''
    }
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    workshops() {
      return this.$store.getters.getWorkshops
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
  created() {
    this.workshopUrl = params.getParam('workshop')
    this.gameUrl = params.getParam('game')
    if (this.gameUrl) {
      this.workshopUrl = 'None (Single team Game)'
    }
  },
  methods: {
    hide() {
      this.$store.dispatch('hideModal', 'setGame')
    },
    setWorkshop() {
      const workshop = this.workshopUrl ? this.workshopUrl : document.getElementById('workshop-name').value
      localStorage.setItem('workshopName-cg', workshop)
      this.$store.dispatch('updateWorkshopName', workshop)
      this.$store.dispatch('updateGameName', '')
      this.$store.dispatch('setMyName', '')
      this.$store.dispatch('clearPlayers')
      if (!workshop) {
        this.$store.dispatch('updateWorkshop', false)
      } else {
        bus.emit('sendLoadWorkshop', {workshopName: workshop})
      }
    },
    setGame() {
      const gameName = this.gameUrl ? this.gameUrl : document.getElementById('game-name').value
      localStorage.setItem('gameName-cg', gameName)
      if (gameName) {
        this.$store.dispatch('updateGameName', gameName)
        bus.emit('sendLoadGame', { workshopName: this.workshopName, gameName: gameName })
      }
    },
    setMyName() {
      const id = document.getElementById('my-name').value
      const myName = this.players.find(function(p) {
        return p.id == id
      })
      localStorage.setItem('myName-cg', JSON.stringify(myName))
      this.$store.dispatch('setMyName', myName)
    }
  }
}
</script>

<style lang="scss">

  .set-game {
    table {
      margin: 0 auto;
      td {
        padding: 0 4px;
        height: 40px;

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
