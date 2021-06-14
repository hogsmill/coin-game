<template>
  <button :id="round.name + '-button'" :disabled="!host && workshop.config.onlyHostCanControl" class="btn btn-site-primary mb-2" @click="go(index)">
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
    host() {
      return this.$store.getters.getHost
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    workshopName() {
      return this.$store.getters.getWorkshopName
    },
    workshop() {
      return this.$store.getters.getWorkshop
    }
  },
  methods: {
    go(round) {
      bus.$emit('sendStartRound', {workshopName: this.workshopName, gameName: this.gameName, round: round})
    }
  }
}
</script>
