<template>
  <div id="app" class="mb-4">
    <appHeader />
    <WalkThroughView />
    <h1>The Coin Game</h1>
    <div v-if="showTab == 'about'">
      <AboutView />
    </div>
    <div v-if="showTab != 'about'">
      <div class="game-params">
        <MyName :socket="socket" />
        <GameName :socket="socket" />
      </div>
      <div class="container">
        <div v-if="showTab == 'facilitator'" :class="{'not-host' : !isHost}">
          <div class="connections">
            Current server connections: {{ connections.connections }} / {{ connections.maxConnections }}
          </div>
          <app-denominations :socket="socket" />
          <app-roles :socket="socket" />
          <app-players :socket="socket" />
          <app-control :socket="socket" />
        </div>
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
import MyName from './components/MyName.vue'
import GameName from './components/GameName.vue'
import Denominations from './components/game-config/Denominations.vue'
import Roles from './components/game-config/Roles.vue'
import Players from './components/game-config/Players.vue'
import Control from './components/game-config/Control.vue'
import AboutView from './components/about/AboutView.vue'
import WalkThroughView from './components/about/WalkThroughView.vue'
import ResultsView from './components/results/ResultsView.vue'

export default {
  name: 'App',
  components: {
    appHeader: Header,
    appDenominations: Denominations,
    appRoles: Roles,
    appPlayers: Players,
    appControl: Control,
    AboutView,
    WalkThroughView,
    MyName,
    GameName,
    ResultsView
  },
  computed: {
    isHost() {
      return this.$store.getters.getHost
    },
    walkThrough() {
      return this.$store.getters.getWalkThrough
    },
    showTab() {
      return this.$store.getters.getShowTab
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    gameState() {
      return this.$store.getters.getGameState
    },
    connections() {
      return this.$store.getters.getConnections
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

    if (params.getParam('game')) {
      const game = params.getParam('game')
      this.$store.dispatch('updateGameName', game)
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

    this.socket.on('updateGameState', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('updateGameState', data)
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
        width: 50%;
        display: inline-block;
        text-align: left;
      }
      span {
        width: 50%;
        display: inline-block;
        text-align: right;
      }
    }
  }
</style>
