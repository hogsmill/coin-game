<template>
  <div id="app" class="mb-4">
    <Header />
    <WalkThroughView />
    <h1>
      The Coin Game
    </h1>
    <h2>
      <span v-if="workshopName || gameName">(</span>
      <span v-if="workshopName">{{ workshopName }}</span>
      <span v-if="!workshopName && gameName">{{ gameName }}</span>
      <span v-if="workshopName && gameName">, {{ gameName }}</span>
      <span v-if="myName">, {{ myName.name }}</span>
      <span v-if="workshopName || gameName">)</span>
    </h2>
    <div v-if="showTab == 'about'">
      <AboutView />
    </div>
    <div v-if="showTab != 'about'">
      <div class="game-params">
        <SetGame :socket="socket" />
      </div>
      <div class="container">
        <FacilitatorView v-if="showTab == 'facilitator'" :socket="socket" />
        <div v-if="showTab == 'game'">
          <ResultsView :game-state="gameState" :socket="socket" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'

import params from './lib/params.js'

import Header from './components/Header.vue'
import SetGame from './components/SetGame.vue'
import AboutView from './components/about/AboutView.vue'
import WalkThroughView from './components/about/WalkThroughView.vue'
import FacilitatorView from './components/FacilitatorView.vue'
import ResultsView from './components/results/ResultsView.vue'

export default {
  name: 'App',
  components: {
    Header,
    AboutView,
    WalkThroughView,
    SetGame,
    FacilitatorView,
    ResultsView
  },
  computed: {
    walkThrough() {
      return this.$store.getters.getWalkThrough
    },
    showTab() {
      return this.$store.getters.getShowTab
    },
    workshopName() {
      return this.$store.getters.getWorkshopName
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    myName() {
      return this.$store.getters.getMyName
    },
    gameState() {
      return this.$store.getters.getGameState
    }
  },
  created() {
    let host = '77.68.122.69'
    if (location.hostname == 'localhost') {
      host = 'localhost'
    }
    const connStr = 'http://' + host + ':3000'
    console.log('Connecting to: ' + connStr)
    this.socket = io(connStr)

    if (params.isParam('host')) {
      this.$store.dispatch('updateHost', true)
    }

    if (params.getParam('workshop')) {
      const workshop = decodeURIComponent(params.getParam('workshop'))
      this.$store.dispatch('updateWorkshopName', workshop)
      this.$store.dispatch('updateGameName', '')
      localStorage.setItem('workshopName-cg', workshop)
      this.socket.emit('loadWorkshop', {workshopName: workshop})
    } else if (params.getParam('game')) {
      const game = decodeURIComponent(params.getParam('game'))
      this.$store.dispatch('updateWorkshopName', '')
      this.$store.dispatch('updateGameName', game)
      this.$store.dispatch('updateWorkshop', false)
      localStorage.setItem('gameName-cg', game)
    }

    const gameName = localStorage.getItem('gameName-cg')
    if (gameName) {
      this.$store.dispatch('updateGameName', gameName)
      this.socket.emit('loadGame', {gameName: gameName})
    }

    let myName = localStorage.getItem('myName-cg')
    if (myName) {
      myName = JSON.parse(myName)
      this.$store.dispatch('setMyName', myName)
    }

    this.socket.on('updateWorkshop', (data) => {
      if (this.workshopName == data.workshopName) {
        this.$store.dispatch('updateWorkshop', data)
      }
    })

    this.socket.on('updateGameState', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('updateGameState', data)
      }
    })

    this.socket.on('updateWorkshopResults', (data) => {
      if (this.workshopName == data.workshopName) {
        this.$store.dispatch('updateWorkshopResults', data)
      }
    })

    this.socket.on('updateConnections', (data) => {
      this.$store.dispatch('updateConnections', data)
    })
  }
}
</script>

<style lang="scss">
  .not-host { height: 0px; visibility: hidden; }
  #clickCoins { margin-left: -2rem; }

  .connections {
    text-align: right;
    margin: 6px
  }

  .game-params {
    height: 30px;
  }

  .config {
    margin: 0 auto;
    max-width: 800px;
    .control-header {
      h5 {
        width: 90%;
        display: inline-block;
        text-align: left;
      }
      .fas {
        color: #888;
        font-size: x-large;
        float: right;

        &:hover {
          cursor: pointer;
          color: #5a6268
        }
      }
      span {
        width: 50%;
        display: inline-block;
        text-align: right;
      }
    }
  }
</style>
