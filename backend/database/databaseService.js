const User = require('../models/user')
const Artist = require('../models/artist')

const getUsers = async () => {
  const users = await User.find()
  console.log(users.toJSON())
  return users
}

const saveUserToDatabase = async (user) => {
  const userModel = new User({
    username: user.name
  })
  return await userModel.save()
}

const saveArtistToDatabase = async (artist) => {
  const artistModel = new Artist({
    professionalName: artist.professionalName,
    firstName: artist.firstName,
    lastName: artist.lastName,
    gender: artist.gender,
    genres: artist.genres
  })
  return await artistModel.save()
}

const getUserByName = async (username) => {
  return await User.findOne({ username })
}

const getArtistByName = async (name) => {
<<<<<<< HEAD
  return await Artist.findOne({ professionalName: { $regex: new RegExp(name, 'i')} })
}

const updateArtist = async(professionalName, artist) => {
  return await Artist.findOneAndUpdate(professionalName, artist)
=======
  return await Artist.findOne({ professionalName: name })
>>>>>>> parent of da32e4d (Merge branch 'artist_object' of github.com:sumuh/Trollbot into artist_object)
}

const addGenreToArtist = async (professionalName, genre) => {
  return await Artist.findByIdAndUpdate(professionalName, { $push: { genres: genre } }, { new: true })
}

const deleteAll = async () => {
  return await Artist.deleteMany( {} )
}

module.exports = {
  getUsers,
  saveUserToDatabase,
  saveArtistToDatabase,
  getUserByName,
  getArtistByName,
  addGenreToArtist,
  deleteAll
}
