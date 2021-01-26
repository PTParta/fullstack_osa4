const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  //response.json(users) this is the same as below? At least in this case seems to give the same result
  response.json(users.map(u => u.toJSON()))
})


usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.password.length < 3) {
    response.status(400).send({ error: 'password length was shorter than 3' })
  } else {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.json(savedUser)
  }
})

module.exports = usersRouter