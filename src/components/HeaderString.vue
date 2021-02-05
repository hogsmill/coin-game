<template>
  <h2>
    {{ headerString() }}
  </h2>
</template>

<script>
export default {
  computed: {
    workshopName() {
      return this.$store.getters.getWorkshopName
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    myName() {
      return this.$store.getters.getMyName
    }
  },
  methods: {
    headerString() {
      const elements = []
      let str = ''
      if (this.workshopName && this.workshopName != 'None (Single team Game)') {
        elements.push(this.workshopName)
      }
      if (this.gameName) {
        elements.push(this.gameName)
      }
      if (this.myName) {
        elements.push(this.myName.name)
      }
      if (elements.length) {
        str = '(' + elements.join(', ') + ')'
      }
      return str
    }
  }
}
</script>
