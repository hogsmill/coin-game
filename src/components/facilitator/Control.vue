<template>
  <div class="config card bg-light mb-3 no-padding-r-l">
    <div class="card-body">
      <div class="control-header">
        <h5 class="card-title">
          Control
        </h5>
        <i v-if="showControl" @click="setShowControl(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showControl" @click="setShowControl(true)" title="expand" class="fas fa-caret-down toggle" />
      </div>
      <div v-if="showControl">
        <table class="config-table control-table">
          <tr>
            <td>
              Interval Between Coin Plays (ms)
            </td>
            <td colspan="2">
              <input type="text" class="form-control" id="interval" :value="editingWorkshop.config.interval">
              <i class="fas fa-save" title="Save Changes" @click="updateInterval()" />
              (<i>Default: {{ editingWorkshop.defaultConfig.interval }}</i>)
            </td>
          </tr>
          <tr>
            <td>
              Time Limit Per Round (s)
            </td>
            <td>
              Demo:
              <input type="text" class="form-control" id="demoTimeLimit" :value="editingWorkshop.config.timeLimit.demo">
              <i class="fas fa-save" title="Save Changes" @click="updateDemoTimeLimit()" />
              <div>
                (<i>Default: {{ editingWorkshop.defaultConfig.timeLimit.demo }}</i>)
              </div>
            </td>
            <td>
              Click:
              <input type="text" class="form-control" id="clickTimeLimit" :value="editingWorkshop.config.timeLimit.click">
              <i class="fas fa-save" title="Save Changes" @click="updateClickTimeLimit()" />
              <div>
                (<i>Default: {{ editingWorkshop.defaultConfig.timeLimit.click }}</i>)
              </div>
            </td>
          </tr>
          <tr>
            <td>
              Value First Round Time Limit (s)
            </td>
            <td>
              Demo:
              <input type="text" class="form-control" id="demoValueTimeLimit" :value="editingWorkshop.config.valueTimeLimit.demo">
              <i class="fas fa-save" title="Save Changes" @click="updateDemoValueTimeLimit()" />
              <div>
                (<i>Default: {{ editingWorkshop.defaultConfig.valueTimeLimit.demo }}</i>)
              </div>
            </td>
            <td>
              Click:
              <input type="text" class="form-control" id="clickValueTimeLimit" :value="editingWorkshop.config.valueTimeLimit.click">
              <i class="fas fa-save" title="Save Changes" @click="updateClickValueTimeLimit()" />
              <div>
                (<i>Default: {{ editingWorkshop.defaultConfig.valueTimeLimit.click }}</i>)
              </div>
            </td>
          </tr>
          <tr>
            <td>
              Click on Coins
            </td>
            <td colspan="2">
              <input disabled="true" class="form-check-input mr-neg-10" id="clickOnCoins" type="checkbox" :value="editingWorkshop.clickOnCoins" @click="updateClickOnCoins()">
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
      showControl: false,
      clickOnCoins: true
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
    setShowControl(val) {
      this.showControl = val
    },
    updateInterval() {
      const workshop = this.editingWorkshop.workshopName
      const game = this.editingGame.gameName
      const interval = document.getElementById('interval').value
      this.socket.emit('updateInterval', {workshopName: workshop, gameName: game, value: interval})
    },
    updateDemoTimeLimit() {
      const workshop = this.editingWorkshop.workshopName
      const game = this.editingGame.gameName
      const timeLimit = document.getElementById('demoTimeLimit').value
      this.socket.emit('updateDemoTimeLimit', {workshopName: workshop, gameName: game, value: timeLimit})
    },
    updateClickTimeLimit() {
      const workshop = this.editingWorkshop.workshopName
      const game = this.editingGame.gameName
      const timeLimit = document.getElementById('clickTimeLimit').value
      this.socket.emit('updateClickTimeLimit', {workshopName: workshop, gameName: game, value: timeLimit})
    },
    updateDemoValueTimeLimit() {
      const workshop = this.editingWorkshop.workshopName
      const game = this.editingGame.gameName
      const valueTimeLimit = document.getElementById('demoValueTimeLimit').value
      this.socket.emit('updateDemoValueTimeLimit', {workshopName: workshop, gameName: game, value: valueTimeLimit})
    },
    updateClickValueTimeLimit() {
      const workshop = this.editingWorkshop.workshopName
      const game = this.editingGame.gameName
      const valueTimeLimit = document.getElementById('clickValueTimeLimit').value
      this.socket.emit('updateClickValueTimeLimit', {workshopName: workshop, gameName: game, value: valueTimeLimit})
    },
    updateClickOnCoins() {
      const workshop = this.editingWorkshop.workshopName
      const game = this.editingGame.gameName
      this.clickOnCoins = !this.clickOnCoins
      this.socket.emit('updateClickOnCoins', {workshopName: workshop, gameName: game, value: this.clickOnCoins})
    }
  }
}
</script>

<style scoped lang="scss">
  .control-table {
    input {
      width: 80px !important;
      display: inline-block;
    }
  }
</style>
