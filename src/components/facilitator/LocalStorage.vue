<template>
  <div class="config card bg-light mb-3 no-padding-r-l">
    <div class="card-body">
      <div class="control-header">
        <h5 class="card-title">
          Local Storage
        </h5>
        <i v-if="showLocalStorage" @click="setShowLocalStorage(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showLocalStorage" @click="setShowLocalStorage(true)" title="expand" class="fas fa-caret-down toggle" />
      </div>
      <div v-if="showLocalStorage">
        <button class="btn btn-sm btn-secondary smaller-font" @click="loadLocalStorage()">
          Load
        </button>
        <table>
          <tr v-for="(item, index) in storage" :key="index">
            <td>{{ item.key }}</td>
            <td>{{ item.value }}</td>
            <td>
              <button class="btn btn-sm btn-secondary smaller-font" @click="deleteLocalStorage(item.key)">
                Delete
              </button>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  data() {
    return {
      showLocalStorage: false,
      storage: []
    }
  },
  methods: {
    setShowLocalStorage(val) {
      this.showLocalStorage = val
    },
    loadLocalStorage() {
      this.storage = []
      for (let i = 0; i < localStorage.length; i++)   {
        this.storage.push({
          key: localStorage.key(i),
          value: localStorage.getItem(localStorage.key(i))
        })
      }
    },
    deleteLocalStorage(key) {
      localStorage.removeItem(key)
      this.loadLocalStorage()
    }
  }
}
</script>

<style scoped lang="scss">
  .control-table {
    input {
      width: 80px !important;
      display: inline-block;
    }
  }
</style>
