<template>
  <div class="selected-header">
    <span v-if="scope == 'game'">Workshop: <b>{{ editingWorkshop.workshopName }}</b>, Game: <b>{{ editingGame.gameName }}</b></span>
    <span v-if="scope == 'workshop'">Workshop: <b>{{ editingWorkshop.workshopName }}</b></span>
  </div>
</template>

<script>
export default {
  props: [
    'scope'
  ],
  computed: {
    editingWorkshop() {
      return this.$store.getters.getEditingWorkshop
    },
    editingGame() {
      return this.$store.getters.getEditingGame
    }
  }
}
</script>

<style lang="scss">
  .selected-header {
    padding: 0 0 12px 22px;
    text-align: left;
  }
</style>
