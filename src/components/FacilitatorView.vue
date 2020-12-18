<template>
  <div :class="{'not-host' : !isHost}">
    <div class="connections">
      Current server connections: {{ connections.connections }} / {{ connections.maxConnections }}
    </div>
    <WorkshopsAndGames :socket="socket" />
    <Teams :socket="socket" />
    <Roles :socket="socket" />
    <Denominations :socket="socket" />
    <Control :socket="socket" />
  </div>
</template>

<script>
import WorkshopsAndGames from './facilitator/WorkshopsAndGames.vue'
import Teams from './facilitator/Teams.vue'
import Denominations from './facilitator/Denominations.vue'
import Roles from './facilitator/Roles.vue'
import Control from './facilitator/Control.vue'

export default {
  components: {
    WorkshopsAndGames,
    Teams,
    Denominations,
    Roles,
    Control
  },
  props: [
    'socket'
  ],
  computed: {
    isHost() {
      return this.$store.getters.getHost
    },
    connections() {
      return this.$store.getters.getConnections
    },
    editingWorkshop() {
      return this.$store.getters.getEditingWorkshop
    },
    editingGame() {
      return this.$store.getters.getEditingGame
    }
  },
  created() {
    this.socket.emit('loadWorkshops', {})

    this.socket.on('updateWorkshops', (data) => {
      this.$store.dispatch('updateWorkshops', data)
    })
    this.socket.on('setEditingWorkshop', (data) => {
      this.$store.dispatch('setEditingWorkshop', data)
    })
    this.socket.on('setEditingGame', (data) => {
      this.$store.dispatch('setEditingGame', data)
    })
  }
}
</script>

<style lang="scss">
.config-table {
  width: 90%;
  margin: 0 auto;

  td {
    text-align: left;
    border: 1px solid #ccc;
    padding: 4px;

    input[type="text"], select {
      padding: 2px;
      width: 270px;
      margin: 4px 8px;
      display: inline;
    }

    button {
      margin: 4px 8px;
    }
    .far, .fas {
      margin: 0 4px;
      color: #888;
      font-size: large;

      &:hover {
        cursor: pointer;
        color: #444;
      }
    }
  }
}
</style>
