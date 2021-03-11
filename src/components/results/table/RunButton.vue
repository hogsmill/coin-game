<template>
  <button :id="round.name + '-button'" class="btn btn-site-primary mb-2" @click="go(index)">
    Run {{ round.name }}
  </button>
</template>

<script>
import bus from '../../../socket.js'

export default {
  props: [
    'round',
    'index'
  ],
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    workshopName() {
      return this.$store.getters.getWorkshopName
    }
  },
  methods: {
    go(round) {
      bus.$emit('sendStartRound', {workshopName: this.workshopName, gameName: this.gameName, round: round})
    }
  }
}
</script>
