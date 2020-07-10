<template>
  <div class="my-name" v-if="!showAbout">
    <div class="my-name text-right">
      <button class="btn btn-sm btn-info" v-if="!myName" @click="show">Set My Name</button>
      <span v-if="myName" @click="show">I am: {{myName}}</span>
    </div>

    <modal name="set-my-name" :height="120" :classes="['rounded']">
      <div class="text-right"><span @click="hide" class="glyphicon glyphicon-star">x</span></div>
      <h4>Enter Your Name</h4>
      <div class="set-my-name">
        <input type="text" id="my-name" class="form-control" />
        <button class="btn btn-sm btn-info" @click="saveMyName">Save</button>
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

<style>
  .my-name { padding-right: 2px; }
  .my-name button { font-size: smaller; background-color: #aaa; border: 1px solid #aaa; }
  .my-name button:hover { color: #aaa; background-color: #fff; }
  .set-my-name-modal { height: 120px; }

  #my-name { display: inline-block; width: 30%; margin-right: 6px; }
</style>
