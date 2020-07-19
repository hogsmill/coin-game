<template>
  <div class="my-name float-right" v-if="!showAbout">
      <button class="btn btn-sm btn-secondary smaller-font" v-if="!myName" @click="show">Set My Name</button>
      <span v-if="myName" @click="show" class="mr-2 mt-2 pointer">I am: {{myName}}</span>

    <modal name="set-my-name" :height="120" :classes="['rounded', 'set-my-name']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4">
        <h4>Enter Your Name</h4>
        <div class="set-my-name">
          <input type="text" id="my-name" class="form-control" />
          <button class="btn btn-sm btn-secondary smaller-font" @click="saveMyName">Save</button>
        </div>
      </div>
    </modal>

  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  methods: {
    show () {
      this.$modal.show('set-my-name');
    },
    hide () {
      this.$modal.hide('set-my-name');
    },
    saveMyName: function() {
      var myName = document.getElementById('my-name').value
      this.$store.dispatch("updateMyName", myName)
      this.socket.emit("addMyNameAsAPlayer", {gameName: this.gameName, player: myName })

      this.hide()
    }
  },
  computed: {
    showAbout() {
      return this.$store.getters.getShowAbout
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    myName() {
      return this.$store.getters.getMyName
    }
  },
  mounted() {
    this.socket.on("addMyNameAsAPlayer", (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch("addPlayer", data.player)
      }
    })
  }
}
</script>

<style lang="scss">

.set-my-name {
  height: 120px;

  #my-name {
    display: inline-block;
    width: 30%;
    margin-right: 6px;
  }
}
</style>
