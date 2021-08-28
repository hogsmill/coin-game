<template>
  <i class="fas fa-store-alt-slash clear-storage" title="Clear local storage (will log you out)" @click="clearLocalStorage()" />
</template>

<script>
import ls from '../lib/localStorage.js'

export default {
  computed: {
    lsSuffix() {
      return this.$store.getters.lsSuffix
    }
  },
  methods: {
    clearLocalStorage() {
      if (confirm('Clear all your details fron this game?')) {
        ls.clear(this.lsSuffix)
        location.reload()
      }
    }
  }
}
</script>

<style lang="scss">
  .clear-storage {
    &.fas {
      float: right;
      margin: 0 6px 0 0;
      color: #888;
      font-size: revert;
      position: revert;

      &:hover {
        color: #444;
        cursor: pointer;
      }
    }
  }
</style>
