
var Params = {

  isParam: function(param) {
    var search = location.search.replace('?', '').split('&')
    var found = false
    for (var i = 0; i < search.length; i++) {
      if (search[i] == param) {
        found = true
      }
    }
    return found
  }
}

export default Params
