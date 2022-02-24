
module.exports = {

  max: function(arr) {
    let max
    for (let i = 0; i < arr.length; i++) {
      if (!max || arr[i] > max) {
        max = arr[i]
      }
    }
    return max
  },

  maxSub: function(arr, index) {
    let max
    for (let i = 0; i < arr.length; i++) {
      if (!max || arr[i][index] > max) {
        max = arr[i][index]
      }
    }
    return max
  },

  min: function(arr) {
    let min
    for (let i = 0; i < arr.length; i++) {
      if (!min || arr[i] < min) {
        min = arr[i]
      }
    }
    return min
  },

  minSub: function(arr, index) {
    let min
    for (let i = 0; i < arr.length; i++) {
      if (!min || arr[i][index] < min) {
        min = arr[i][index]
      }
    }
    return min
  }

}
