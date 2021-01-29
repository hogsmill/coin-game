<template>
  <div class="config card bg-light mb-3 no-padding-r-l">
    <div class="card-body">
      <div class="control-header">
        <h5 class="card-title">
          Workshops and Games/Teams
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
                <input type="text" id="new-workshop">
                <button class="btn btn-sm btn-secondary smaller-font" @click="addWorkshop()">
                  Add New
                </button>
              </div>
              <table class="workshops-table">
                <tr v-for="(workshop, index) in workshops" :key="index" :class="{ 'selected': workshop.workshopName == editingWorkshop.workshopName }">
                  <td>
                    <input :id="'workshop-' + index" type="checkbox" :checked="workshop.workshopName == editingWorkshop.workshopName" @click="selectWorkshop(workshop.workshopName, index)">
                  </td>
                  <td>
                    {{ workshop.workshopName }}
                  </td>
                  <td>
                    <i v-if="!workshop.isProtected" @click="deleteWorkshop(workshop.workshopName)" :title="'Delete ' + workshop.workshopName" class="fas fa-trash-alt" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <span v-if="!editingWorkshop.single">Team</span>
              <span v-if="editingWorkshop.single">Game</span>
            </td>
            <td>
              <div>
                <input type="text" id="new-game">
                <button class="btn btn-sm btn-secondary smaller-font" @click="addGame()" :disabled="!editingWorkshop.workshopName">
                  Add New
                </button>
              </div>
              <table class="games-table">
                <tr v-for="(game, index) in editingWorkshopGames" :key="index" :class="{ 'selected': editingGame && game.gameName == editingGame.gameName }">
                  <td>
                    <input :id="'game-' + index" type="checkbox" :checked="editingGame && game.gameName == editingGame.gameName" @click="selectGame(game.gameName, index)">
                  </td>
                  <td>
                    {{ game.gameName }}
                  </td>
                  <td>
                    <i v-if="!game.isProtected" @click="deleteGame(game.gameName)" :title="'Delete ' + game.gameName" class="fas fa-trash-alt" />
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
export default {
  props: [
    'socket'
  ],
  data() {
    return {
      noWorkshopString: 'No Workshop (Single team Game)'
    }
  },
  computed: {
    workshops() {
      return this.$store.getters.getWorkshops
    },
    editingWorkshop() {
      return this.$store.getters.getEditingWorkshop
    },
    editingWorkshopGames() {
      return this.$store.getters.getEditingWorkshopGames
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
  created() {
    this.socket.emit('loadEditingWorkshop', {workshopName: ''})
  },
  methods: {
    addWorkshop() {
      const workshop = document.getElementById('new-workshop').value
      this.socket.emit('loadWorkshop', {workshopName: workshop})
      document.getElementById('new-workshop').value = ''
    },
    selectWorkshop(workshop, index) {
      const checked = document.getElementById('workshop-' + index).checked
      this.socket.emit('loadEditingWorkshop', {workshopName: checked ? workshop : ''})
    },
    deleteWorkshop(workshop) {
      if (confirm('Delete ' + workshop + '?')) {
        this.socket.emit('deleteWorkshop', {workshopName: workshop})
      }
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
    selectGame(game, index) {
      const checked = document.getElementById('game-' + index).checked
      const workshop = this.editingWorkshop.workshopName
      this.socket.emit('loadEditingGame', {workshopName: workshop, gameName: checked ? game: ''})
    },
    deleteGame(game) {
      if (confirm('Delete ' + game + '?')) {
        const workshop = this.editingWorkshop.workshopName
        this.socket.emit('deleteGame', {workshopName: workshop, gameName: game})
      }
    },
  }
}
</script>

<style scoped lang="scss">
  .workshops-table, .games-table {
    td {
      border-left: none;
      border-right: none;
    }
  }
</style>
