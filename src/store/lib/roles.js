
module.exports = {

  getRoleNFromName: function(name, roles) {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].role == name) {
        return i
      }
    }
  }

}
