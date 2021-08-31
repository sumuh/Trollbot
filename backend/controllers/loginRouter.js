const loginRouter = require('express').Router()
const logger = require('../utils/logger')
const { getUsers, login } = require('../services/roomService')

loginRouter.post('/', async (request, response) => {
  const body = request.body
  const logginUser = login(body.name)
  logger.info('Logged in as:', logginUser)
  response.status(200).send(logginUser)

})

loginRouter.get('/', (request, response) => {
  response.json(getUsers())
})

module.exports = loginRouter