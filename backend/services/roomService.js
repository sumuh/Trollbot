const logger = require('../utils/logger')
var uuid = require('uuid')
const { createBot } = require('./botFactory')
const addressGen = require('../utils/addressGen')
const crypto = require('crypto')
const dbService = require('../database/databaseService')
const { login, addUser, getUsers, deleteUser, getSenderId, getUser } = require('./userService')
const { db } = require('../models/user')

// Callback functions should take the result as an argument

const getRooms = async (callback) => {
  const rooms = await dbService.getRooms()
  if(callback) callback(rooms)
  return rooms
}

// adds testrooms to database if there are no rooms, as the frontend will not work with an empty room array

const test = (rooms) => {
  logger.info(rooms)
  logger.info(rooms.length)
  if(rooms.length < 2) {
    logger.info('Adding test rooms')
    dbService.saveRoomToDatabase({
      name: 'Test_Normal',
      roomLink: 'aaaaaaaaa',
      bot: testBotNormal,
      users: [],
      completed_users: [],
      messages: [],
      active: true,
      in_use: false
    })
    dbService.saveRoomToDatabase({
      name: 'Test_Troll',
      roomLink: 'bbbbbbbbb',
      bot: testBotTroll,
      users: [],
      completed_users: [],
      messages: [],
      active: true,
      in_use: false
    })
  }
}
getRooms(test)


const getRoom = roomId => dbService.getRoomByLink(roomId)

const getRoomName = async roomId => {
  const foundRoom = await getRoom(roomId)
  if (!foundRoom || foundRoom === undefined) return undefined 
  return foundRoom.name
}
const getRoomLink = async roomId => {
  const foundRoom = await getRoom(roomId)
  if (!foundRoom || foundRoom === undefined) return undefined 
  return foundRoom.roomLinkBase
}
const getMessagesInRoom = async roomId => {
  const foundRoom = await getRoom(roomId)
  if (!foundRoom || foundRoom === undefined) return undefined 
  return foundRoom.messages
}
const getUsersInRoom = async roomId => {
  const foundRoom = await getRoom(roomId)
  if (!foundRoom || foundRoom === undefined) return undefined 
  return foundRoom.users
}
const getBot = async roomId => {
  const foundRoom = await getRoom(roomId)
  if (!foundRoom || foundRoom === undefined) return undefined 
  return foundRoom.bot
}
const isRoomActive = async roomId => {
  const foundRoom = await getRoom(roomId)
  if (!foundRoom || foundRoom === undefined) return false 
  return foundRoom.active
}
const deleteRoom = async roomId => {
  await dbService.deleteRoom(roomId)
  return getRooms()
}

const getUserInRoom = (roomName, name) => {
  const existingRoom = getRoom(roomName)
  if (!existingRoom || !existingRoom.users) return
  return existingRoom.users.find(u => u.name === name)
}


const addUserIntoRoom = async (senderId, roomName, name) => {
  logger.info(`User '${name}' is trying to enter room '${roomName}`)
  const existingUser = getUserInRoom(roomName, name)
  const existingRoom = getRoom(roomName)
  const user = await getUser(name)
  if (!name || !roomName) return { error: 'Username and room are required.' }
  if (!existingRoom || existingRoom.length === 0) return { error: 'Room not found.' }
  if (existingUser) return { error: 'User is already in this room.' }

  await dbService.addUserToRoom(roomName, name)
  
  logger.info(`'users in room: '${await getUsersInRoom(roomName)}`)

  logger.info(`Adding user: '${user.username}' into room: '${await getRoomName(roomName)}'`)

  return user
}

const removeUserFromRoom = async (roomName, name) => {
  const existingRoom = await getRoom(roomName)
  if (!existingRoom) return

  logger.info(`Removing ${name} from ${existingRoom}`)

  dbService.removeUserFromRoom(roomName, name)
}



const addMessage = async (roomName, message) => {
  const existingRoom = await getRoom(roomName)
  if (!existingRoom) return

  const msg = { room: roomName, ...message }
  logger.info('id?:', message.user.id)
  if(!message.user.id || message.user.id === undefined) return
  msg.user = message.user.id
  logger.info('Add message:', msg)

  await dbService.addMessage(roomName, msg)
  return msg
}

const addRoom = room => {
  let roomCode = (room.roomLink !== undefined)? room.roomLink : addressGen.generate(9)

  // In case generates an existing room code
  while (rooms.find(r => r.roomLink === roomCode) !== undefined) {
    roomCode = addressGen.generate(9)
  }
	
  const newRoom = { ...room, id: rooms.length + 1, users: [], messages: [], completed_users: ['bot'], roomLink: roomCode , active: false, in_use: true }

  const bot = createBot(room.botType)
  
  newRoom.bot = bot
  newRoom.users.push(bot)
  users.push(bot)

  logger.info('Added room:', newRoom)
  rooms.push(newRoom)
  return newRoom
}

const autoCreateRoom = () => {
  const randomInt = crypto.randomInt(2)
  const newBotType = (randomInt === 0)? 'Normal' : 'Troll'
  const newRoom = { name:  `Room ${rooms.length + 1}`, botType: newBotType }
  
  return addRoom(newRoom)
}

const getActiveRoom = () => {
  let roomCandidates = rooms.filter(r => r.users.length === 2 && r.in_use)
  if (roomCandidates.length > 0) return roomCandidates[0].roomLink

  roomCandidates = rooms.filter(r => r.users.length === 1 && r.in_use)
  if (roomCandidates.length > 0) return roomCandidates[0].roomLink
  
  return autoCreateRoom().roomLink
}

const activateRoom = roomCode => {
  const foundRoom = getRoom(roomCode)

  if (foundRoom === undefined || foundRoom.users.length < 3) return false
  foundRoom.in_use = false
  foundRoom.active = true
  return true
}

const manageComplete = async (value, roomId) => {
  logger.info(`Task completion requested by ${value}`)
  const foundRoom = await getRoom(roomId)
  const completedUsers = foundRoom.completed_users
  logger.info(`${completedUsers.length} vs ${foundRoom.users.length}`)

  // returns true if the room has already completed its assignment
  if (completedUsers.length === foundRoom.users.length) return true
  // returns false if the user requesting has already requested completion
  if (!value || completedUsers.includes(value)) return false

  completedUsers.push(value)
  logger.info(completedUsers.length)

  return completedUsers.length === foundRoom.users.length
}




module.exports = {
  addRoom,
  deleteRoom,
  getBot,
  getRooms,
  getRoom,
  addMessage,
  addUserIntoRoom,
  getMessagesInRoom,
  removeUserFromRoom,
  getUserInRoom,
  getUsersInRoom,
  getRoomName,
  getRoomLink,
  isRoomActive,
  autoCreateRoom,
  getActiveRoom,
  activateRoom,
  manageComplete
}
