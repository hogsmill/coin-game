<template>
  <div id="app" class="mb-4">
    <Header />
    <h1>
      The Coin Game
    </h1>
    <HeaderString />
    <div v-if="showTab == 'about'">
      <About />
    </div>
    <div v-if="showTab != 'about'">
      <div class="game-params">
        <Status :socket="socket" />
      </div>
      <div class="container">
        <Facilitator v-if="showTab == 'facilitator'" :socket="socket" />
        <div v-if="showTab == 'game'">
          <Results :game-state="gameState" :socket="socket" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'

import params from './lib/params.js'

import Header from './components/Header.vue'
import HeaderString from './components/HeaderString.vue'
import Status from './components/Status.vue'
import About from './components/about/About.vue'
import Facilitator from './components/Facilitator.vue'
import Results from './components/results/Results.vue'

export default {
  name: 'App',
  components: {
    Header,
    HeaderString,
    About,
    Status,
    Facilitator,
    Results
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

    this.socket.emit('checkSystemWorkshops')

    /*
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
    */

    /*
    const self = this
    window.onload = function() {
      const workshopName = localStorage.getItem('workshopName-cg')
      if (workshopName) {
        self.$store.dispatch('updateWorkshopName', workshopName)
      }
      const gameName = localStorage.getItem('gameName-cg')
      if (gameName) {
        self.$store.dispatch('updateGameName', gameName)
      }
      const myName = localStorage.getItem('myName-cg')
      if (myName) {
        self.$store.dispatch('setMyName', JSON.parse(myName))
      }
    }
    */

    this.socket.on('updateWorkshops', (data) => {
      this.$store.dispatch('updateWorkshops', data)
    })

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
