<template>
  <div class="game-name float-right" v-if="!showAbout">
      <button class="btn btn-secondary" v-if="!gameName" @click="show">Set Game Name</button>
      <span v-if="gameName" @click="show">Game: {{gameName}}</span>

    <modal name="set-game-name" :height="120" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4">
        <h4>Enter Your Game Name</h4>
        <div class="set-game-name">
          <input type="text" id="game-name" class="form-control" />
          <button class="btn btn-secondary" @click="saveGameName">Save</button>
        </div>
      </div>
    </modal>

  </div>
</template>

<script>
export default {
  methods: {
    show () {
      this.$modal.show('set-game-name');
    },
    hide () {
      this.$modal.hide('set-game-name');
    },
    saveGameName: function() {
      var gameName = document.getElementById('game-name').value
      this.$store.dispatch("updateGameName", gameName)

      this.hide()
    }
  },
  computed: {
    showAbout() {
      return this.$store.getters.getShowAbout
    },
    gameName() {
      return this.$store.getters.getGameName
    }
  },
}
</script>

<style>
.set-game-name-modal { height: 120px; }

#game-name { display: inline-block; width: 30%; margin-right: 6px; }
</style>
