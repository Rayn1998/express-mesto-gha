const User = require('../models/users')

const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
    return res.send(users)
  } catch {
    res.status(500)
  }
}

const getUser = async (req, res) => {
  const id = req.params.id
  console.log(id.length > 10)
  if (id.length > 10) {
    const user = await User.findById(id)
    if (!user) {
      res.status(404).send("User hasn't found")
    } else {
      res.send({data: user})
    }
  } else {
    res.status(500).send("Enter correct values")
  }
}

const createUser = async (req, res, next) => {
  const {name, about, avatar} = req.body
  if (!name || !about || !avatar) {
    res.status(400).send(`Введены некорректные данные`)
  } else {
    const user = await User.create({name, about, avatar})
    return res.send({data: user})
  }
}

const refreshProfile = (req, res) => {
  res.status(200).send('Profile refreshed')
}

const refreshAvatar = (req, res) => {
  res.status(200).send('Avatar refreshed')
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  refreshProfile,
  refreshAvatar,
}