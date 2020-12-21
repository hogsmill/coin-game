<template>
  <div class="status" :class="{ 'message': status }">
    {{ status }}
  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  data() {
    return {
      status: ''
    }
  },
  created() {
    const self = this
    this.socket.on('status', (data) => {
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
