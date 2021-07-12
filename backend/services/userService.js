const logger = require('../utils/logger')

let users = [{ username: 'testuser', id: 1 }]

const login = (username) => {
  const user = users.find(u => u.username == username)
  if (user == undefined) {
    const newUser = {
      username: username,
      id: users.length + 1
    }
    users = users.concat(newUser)
    return newUser
  }
  return user
}

const removeUser = (id) => {
  logger.info('Remove user with ID:', id)
  users = users.filter(u => u.id === id)
  return users
}

const getUsers = () => {
  return users
}

module.exports = { login, getUsers, removeUser }