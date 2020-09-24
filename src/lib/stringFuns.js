
const StringFuns = {

  htmlDecode: function(input) {
    const doc = new DOMParser().parseFromString(input, 'text/html')
    return doc.documentElement.textContent
  },

  valueString: function(n) {
    const pounds = Math.floor(n / 100)
    let pence = n - pounds * 100
    if (pence < 10) {
      pence = '0' + pence
    }
    return pounds + '.' + pence
  },

  timeString: function(secs) {
    const minutes = Math.floor(secs / 60)
    secs = Math.floor(secs - minutes * 60)
    if (secs < 10) {
      secs = '0' + secs
    }
    return minutes + ':' + secs
  }
}

export default StringFuns
