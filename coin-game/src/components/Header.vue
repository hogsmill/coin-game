<template>
  <div class="menu">
    <span @click="updateShowAbout(false)" :class="{ selected: !showAbout }"
      >Simulation</span
    >
    <span @click="updateShowAbout(true)" :class="{ selected: showAbout }"
      >About</span
    >
  </div>
</template>

<script>
export default {
  computed: {
    showAbout() {
      return this.$store.getters.getShowAbout;
    },
  },
  methods: {
    updateShowAbout(payload) {
      this.$store.dispatch("updateShowAbout", payload);
    },
  },
};
</script>
