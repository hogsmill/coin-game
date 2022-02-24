<template>
  <span class="walk-through">
    <button v-if="!gameName && !showAbout" class="btn btn-sm btn-info mb-2" @click="help">
      Explain this for me...
    </button>
  </span>
</template>

<script>
import params from '../../lib/params.js'

export default {
  data() {
    return {
      step: 1
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
  mounted() {
    const self = this
    if (params.isParam('walkThrough')) {
      self.$store.dispatch('showModal', 'walkThrough')
    }
  },
  methods: {
    help() {
      this.$store.dispatch('updateWalkThroughStep', 1)
      this.$store.dispatch('showModal', 'walkThrough')
    }
  }
}
</script>
