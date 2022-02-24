<template>
  <span class="game-name" v-if="showTab == 'game'">
    <button class="btn btn-sm btn-secondary mb-2" @click="show()">
      Set Up Game
    </button>
  </span>
</template>

<script>
import bus from '../socket.js'

export default {
  data() {
    return {
      workshopUrl: '',
      gameUrl: ''
    }
  },
  computed: {
    showTab() {
      return this.$store.getters.getShowTab
    }
  },
  methods: {
    show() {
      bus.emit('sendLoadWorkshops')
      this.$store.dispatch('showModal', 'setGame')
    }
  }
}
</script>
