
const standardRoles = [
  {name: 'Standard Roles',
   roles: [
     { role: 'Product Owner', include: true, name: '' },
     { role: 'Developer', include: true, name: '' },
     { role: 'Tester', include: true, name: '' },
     { role: 'Integrator', include: true, name: '' },
     { role: 'Customer', include: true, name: '' }
    ]
  },
  {name: 'Standard States',
   roles: [
     { role: 'To Do', include: true, name: '' },
     { role: 'In Progress', include: true, name: '' },
     { role: 'In Test', include: true, name: '' },
     { role: 'Demo', include: true, name: '' },
     { role: 'Customer', include: true, name: '' }
    ]
  }
]

function swap(roles, a, b) {
  const role = roles[a]
  roles[a] = roles[b]
  roles[b] = role
  return roles
}

function roundRoles(roles) {
  const newRoles = []
  for (let i = 0; i < roles.length; i++) {
    newRoles.push({
      role: roles[i].role,
      name: '',
      coins: []
    })
  }
  return newRoles
}

module.exports = {

  getRoleNFromName: function(name, roles) {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].role == name) {
        return i
      }
    }
  },

  getStandardRoles: function() {
    return standardRoles
  },

  setRoleInclude: function(roles, role, include) {
    const newRoles = []
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].role == role.role) {
        roles[i].include = include
      }
      newRoles.push(roles[i])
    }
    return newRoles
  },

  moveRoleDown: function(roles, role) {
    for (let i = 0; i < roles.length + 1; i++) {
      if (roles[i].role == role.role) {
        return swap(roles, i, i + 1)
      }
    }
  },

  moveRoleUp: function(roles, role) {
    for (let i = 0; i < roles.length + 1; i++) {
      if (roles[i].role == role.role) {
        return swap(roles, i - 1, i)
      }
    }
  },

  updateRoleName: function(roles, role, newRole) {
    const newRoles = []
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].role == role.role) {
        roles[i].role = newRole
      }
      newRoles.push(roles[i])
    }
    return newRoles
  },

  deleteRole: function(roles, role) {
    const newRoles = []
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].role != role.role) {
        newRoles.push(roles[i])
      }
    }
    return newRoles
  },

  addNewRole: function(roles, role) {
    const newRoles = JSON.parse(JSON.stringify(roles))
    newRoles.push({
      role: role,
      include: true,
      name: ''
    })
    return newRoles
  },

  updateRolesInRounds: function(rounds, roles) {
    console.log('Roles', roles)
    const newRounds = []
    for (let i = 0; i < rounds.length; i++) {
      const round = rounds[i]
      round.roles = roundRoles(roles)
      newRounds.push(round)
    }
    console.log('New Rounds', newRounds)
    return newRounds
  }
}
