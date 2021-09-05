const roomRouter = require('express').Router()
const { getRooms, getRoom, addRoom, getMessagesInRoom, getUsersInRoom, getBot } = require('../services/roomService')

roomRouter.get('/', (req, res) => {
  res.json(getRooms())
})

roomRouter.post('/', (req, res) => {
  const body = req.body
  const addedRoom = addRoom(body)
  return res.status(200).send(addedRoom)
})

roomRouter.get('/:roomId', (req, res) => {
  const room = getRoom(req.params.roomId)
  return res.json({ room })
})

roomRouter.get('/:roomId/users', (req, res) => {
  const users = getUsersInRoom(req.params.roomId)
  return res.json({ users })
})

roomRouter.get('/:roomId/bot', (req, res) => {
  const bot = getBot(req.params.roomId)
  return res.json({ bot })
})

roomRouter.get('/:roomId/messages', (req, res) => {
  const messages = getMessagesInRoom(req.params.roomId)
  return res.json({ messages })
})

module.exports = roomRouter