
module.exports = {

  getRoleNFromName: function(name, roles) {
    for (var i = 0; i < roles.length; i++) {
      if (roles[i].role == name) {
        return i
      }
    }
  }

}
