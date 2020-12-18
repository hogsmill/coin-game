<template>
  <div class="config card bg-light mb-3 no-padding-r-l">
    <div class="card-body">
      <div class="control-header">
        <h5 class="card-title">
          Workshops and Games (<i>Just select game for single team game</i>)
        </h5>
      </div>
      <div>
        <table class="config-table">
          <tr>
            <td>
              Workshop
            </td>
            <td>
              <div>
                <div v-if="editingWorkshop">
                  Selected: <b>{{ editingWorkshop.workshopName ? editingWorkshop.workshopName : '(None)' }}</b>
                </div>
                <input type="text" id="new-workshop">
                <button class="btn btn-sm btn-secondary smaller-font" @click="addWorkshop()">
                  Add New
                </button>
              </div>
              <select id="selected-workshop" @change="selectWorkshop()">
                <option value="">
                  -- Select --
                </option>
                <option v-for="(workshop, index) in workshops" :key="index" :value="workshop.workshopName ? workshop.workshopName : ''">
                  {{ workshop.workshopName ? workshop.workshopName : 'No Workshop (Single team Game)' }}
                </option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              Game/Team
            </td>
            <td>
              <div>
                <div>
                  <span v-if="editingGame">Selected: <b>{{ editingGame.gameName }}</b></span>
                </div>
                <input type="text" id="new-game">
                <button class="btn btn-sm btn-secondary smaller-font" @click="addGame()">
                  Add New
                </button>
              </div>
              <select id="selected-game" @change="selectGame()">
                <option value="">
                  -- Select --
                </option>
                <option v-for="(game, index) in editingWorkshop.games" :key="index">
                  {{ game }}
                </option>
              </select>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  computed: {
    workshops() {
      return this.$store.getters.getWorkshops
    },
    editingWorkshop() {
      return this.$store.getters.getEditingWorkshop
    },
    editingGame() {
      return this.$store.getters.getEditingGame
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    gameState() {
      return this.$store.getters.getGameState
    }
  },
  methods: {
    addWorkshop() {
      const workshop = document.getElementById('new-workshop').value
      this.socket.emit('loadWorkshop', {workshopName: workshop})
      document.getElementById('new-workshop').value = ''
    },
    selectWorkshop() {
      let workshop = document.getElementById('selected-workshop').value
      if (workshop) {
        workshop = this.workshops.find(function(w) {
          return w.workshopName == workshop
        }).workshopName
      }
      this.socket.emit('loadEditingWorkshop', {workshopName: workshop})
    },
    addGame() {
      const workshop = this.editingWorkshop.workshopName
      const game = document.getElementById('new-game').value
      if (!game) {
        alert('Please enter a valid team name')
      } else {
        this.socket.emit('addGame', {workshopName: workshop, gameName: game})
        document.getElementById('new-game').value = ''
      }
    },
    selectGame() {
      const workshop = this.editingWorkshop.workshopName
      const game = document.getElementById('selected-game').value
      this.socket.emit('loadEditingGame', {workshopName: workshop, gameName: game})
    }
  }
}
</script>

<style scoped lang="scss">
</style>
