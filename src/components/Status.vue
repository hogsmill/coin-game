<template>
  <div class="status" :class="{ 'message': status }">
    {{ status }}
  </div>
</template>

<script>
import bus from '../socket.js'

export default {
  data() {
    return {
      status: ''
    }
  },
  created() {
    const self = this
    bus.$on('status', (data) => {
      self.status = data
      setTimeout(function() {
        self.status = ''
      }, 3000)
    })
  }
}
</script>

<style lang="scss">
  .status {
    width: 65%;
    height: 22px;
    display: inline-block;
    margin: 0 auto;
    font-weight: bold;

    &.message {
      background-color: red;
      color: white;
    }
  }
</style>
